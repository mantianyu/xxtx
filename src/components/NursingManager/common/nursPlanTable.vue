<template>
	<div class="table">
		<el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column type="expand">
		      	<template slot-scope="scope">
		      		<el-table
				      	:data="scope.row.data"
			      		style="width: 100%">
					    <el-table-column
					      	type="index"
					      	width="55">
					    </el-table-column>
				      	<el-table-column
				        	prop="name"
				        	label="班次名称">
				      	</el-table-column>
				      	<el-table-column
				        	prop="start_time"
				        	label="开始时间">
				      	</el-table-column>
				      	<el-table-column
				        	prop="end_time"
				        	label="结束时间">
				      	</el-table-column>
				    </el-table>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="方案名称">
		    </el-table-column>
		    <el-table-column
		      prop="introduction"
		      label="方案说明">
		    </el-table-column>
		    <el-table-column
		      label="排班周期">
		      	<template slot-scope="scope">
		      		<p>{{scope.row.cycle == 0 ? '月' : '周'}}</p>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      label="班次数量">
		      	<template slot-scope="scope">
		      		<p>{{scope.row.data.length}}</p>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      prop="employee_name"
		      label="设置人员">
		    </el-table-column>
		    <el-table-column
		      prop="created_at"
		      label="设置时间">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
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
	    <v-plan :nursId="nursId"></v-plan>
	</div>
</template>

<script>
import vPlan from "./addNursPlan.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      nursId: 0,
      total: 0,
      last_page: 0,
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vPlan
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
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
      let url = this.api.schedulinglist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.nursId = 0;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
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
    deletePlan: async function(id) {
      let url = this.api.deletescheduling;
      var data = {
        id: id
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
        this.$alert(this.message.pleaseChoiceSolution, "", {
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
            var idArr = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].id;
              idArr.push(id);
            }
            this.deletePlan(idArr);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addNursPlanTrue");
      if (scope != 0) {
        this.nursId = scope.id;
      } else {
        this.nursId = 0;
      }
    },
    clean() {
      this.nursId = 0;
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