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
		      prop="old_name"
		      label="老人姓名">
		    </el-table-column>
		    <el-table-column
		      prop="bed_name"
		      label="床位号">
		    </el-table-column>
		    <el-table-column
		      prop="hospital"
		      label="体检医院">
		    </el-table-column>
		    <el-table-column
		      prop="time"
		      label="体检时间">
		    </el-table-column>
		    <el-table-column
		      prop="result"
		      label="体检结果">
		    </el-table-column>
		    <el-table-column
		      prop="employee_id"
		      label="登记人">
		    </el-table-column>
		    <el-table-column
		      prop="created_at"
		      label="登记时间">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		          	<el-button type="text" size="small" @click="showEdit(scope.row)">详情</el-button>
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
		<v-health :healthId="healthId" :elders="elders"></v-health>
	</div>
</template>

<script>
import vHealth from "./addHealth.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      healthId: 0,
      total: 0,
      last_page: 0,
      loading: false,
      elders: [],
      checkInElders: [],
      allElders: [],
      currentPage: 1
    };
  },
  components: {
    vHealth
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchElders();
    this.fetchAllElders();
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
      let url = this.api.getelderhealthexaminationslist + "?page=" + val;
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
          this.healthId = 0;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
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
    deleteHealth: async function(id) {
      let url = this.api.delelderhealthexaminations;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deletePhyExaRegisterSuccess,
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
          center: true,
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
            this.deleteHealth(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addHealthTrue");
      this.$store.dispatch("addHealthEditFalse");
      if (scope != 0) {
        this.healthId = scope.id;
        this.elders = this.allElders;
      } else {
        this.healthId = 0;
        this.elders = this.checkInElders;
      }
    },
    showEdit(scope) {
      this.$store.dispatch("addHealthTrue");
      this.$store.dispatch("addHealthEditTrue");
      this.healthId = scope.id;
      this.elders = this.allElders;
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.checkInElders = res.data.data;
    },
    fetchAllElders: async function() {
      let url = this.api.getsearchelder;
      var data = {
        type: 1
      };
      const res = await this.$http.post(url, data);
      this.allElders = res.data.data;
    },
    infoEmpty() {
      this.healthId = 0;
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