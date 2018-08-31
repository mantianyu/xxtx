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
		      prop="name"
		      label="排班表名称">
		    </el-table-column>
		    <el-table-column
		      prop="scheme_id"
		      label="方案名称">
		    </el-table-column>
		    <el-table-column
		      prop="do_day"
		      label="执行时间">
		    </el-table-column>
		    <el-table-column
		      prop="start_day"
		      label="开始时间">
		    </el-table-column>
		    <el-table-column
		      prop="end_day"
		      label="结束时间">
		    </el-table-column>
		    <el-table-column
		      prop="employee_id"
		      label="登记人">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		          	<el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
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
	    <v-hgpb :workId="workId" :edit="edit" :plans="plans" :nurses="nurses" :detail="detail"></v-hgpb>
	</div>
</template>

<script>
import vHgpb from "./addHGPB.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      workId: 0,
      total: 0,
      last_page: 0,
      edit: false,
      detail: false,
      plans: [],
      nurses: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vHgpb
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchPlan();
    this.fetchNurs();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
      this.fetchPlan();
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.workschemeslist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.workId = 0;
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
    deleteHealth: async function(id) {
      let url = this.api.delworkschemes;
      var data = {
        wid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
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
        this.$alert(this.message.pleaseChoiceArrange, "", {
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
            this.deleteHealth(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addHGPBTrue");
      this.edit = false;
      if (scope != 0) {
        this.workId = scope.id;
        this.edit = true;
      } else {
        this.workId = 0;
      }
    },
    showDetail(scope) {
      this.$store.dispatch("addHGPBTrue");
      this.edit = true;
      this.detail = true;
      this.workId = scope.id;
    },
    fetchPlan: async function() {
      let url = this.api.doschedulinglist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.plans = res.data.data;
    },
    fetchNurs: async function() {
      let url = this.api.getnuringemployeelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.nurses = res.data.data;
    },
    clean() {
      this.workId = 0;
      this.edit = false;
      this.detail = false;
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