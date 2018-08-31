<template>
	<div class="table">
		<el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="elder_name"
		      label="老人姓名">
		    </el-table-column>
		    <el-table-column
		      prop="type"
		      label="评估类型">
		      	<template slot-scope="scope">
		      		<p>{{evaluateType[scope.row.type]}}</p>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      prop="results"
		      label="评估结果">
		    </el-table-column>
		    <el-table-column
		      prop="evaluated_by"
		      label="评估人">
		    </el-table-column>
		    <el-table-column
		      prop="evaluated_at"
		      label="评估地点">
		    </el-table-column>
		    <el-table-column
		      prop="date"
		      label="评估日期">
		    </el-table-column>
		    <el-table-column
		      prop="registration_time"
		      label="登记时间">
		    </el-table-column>
		    <el-table-column
		      prop="employees_name"
		      label="登记人">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		          	<el-button type="text" size="small" @click="checkMain(scope.row)">详情</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
        <el-button type="success" @click="showAdd(0)">新增</el-button>
			</div>
			<div style="display: flex;margin-right: 20px;">
				<el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
				<el-pagination
				  background
				  @current-change="handleCurrentChange"
					    :current-page="currentPage"
				  layout="prev, pager, next"
				  :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
			</div>
	    </div>
	    <v-regist :elderRegistId="elderRegistId" :evaluateType="evaluateType" :evaluatePerson="evaluatePerson" :evaluatePosition="evaluatePosition" :elders="elders"></v-regist>
	</div>
</template>

<script>
import vRegist from "./addElderRegist.vue";

export default {
  props: ["searchData", "evaluateType"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      elderRegistId: 0,
      total: 0,
      last_page: 0,
      evaluatePerson: [],
      evaluatePosition: [],
      elders: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vRegist
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchEvaluatePerson();
    this.fetchElders();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.elderregistrationlist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.data.length == 0) {
            this.$notify({
              title: this.message.hint,
              message: this.message.informationNoExist,
              type: "warning"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: `为您搜索到${res.data.data.total}条信息`,
              type: "success"
            });
          }
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.elderRegistId = 0;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    deleteElderRegistration: async function(id) {
      let url = this.api.delelderregistration;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteAssessRegistSuccess,
              type: "success"
            });
          this.fetchList(1);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    delMore() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceDelete, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherDelete, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            var data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].id;
              data.push(id);
            }
            this.deleteElderRegistration(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addElderRegistTrue");
      this.$store.dispatch("addElderRegistEditFalse");
      if (scope != 0) {
        this.elderRegistId = scope.id;
      } else {
        this.elderRegistId = 0;
      }
    },
    clean() {
      this.elderRegistId = 0;
    },
    checkMain(scope) {
      this.$store.dispatch("addElderRegistTrue");
      this.$store.dispatch("addElderRegistEditTrue");
      this.elderRegistId = scope.id;
    },
    fetchEvaluatePerson: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.TEMP_EVALUATE_PERSON,
          this.data.TEMP_EVALUATE_POSITION
        ]
      };
      const res = await this.$http.post(url, data);
      this.evaluatePerson = res.data.data[this.data.TEMP_EVALUATE_PERSON];
      this.evaluatePosition = res.data.data[this.data.TEMP_EVALUATE_POSITION];
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    }
  }
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
</style>