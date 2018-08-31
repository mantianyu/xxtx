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
		      width="50">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="活动名称">
		    </el-table-column>
		    <el-table-column
		      prop="subject"
		      label="活动主题">
		    </el-table-column>
		    <el-table-column
		      prop="time"
		      label="活动时间">
		    </el-table-column>
		    <el-table-column
		      prop="organizer"
		      label="活动组织者">
		    </el-table-column>
		    <el-table-column
		      prop="phone"
		      label="联系电话">
		    </el-table-column>
		    <el-table-column
		      prop="type"
		      label="活动类型">
		      <template slot-scope="scope">
		          	<p>{{activeType[scope.row.type]}}</p>
		        </template>
		    </el-table-column>
		    <el-table-column
		      prop="employee_id"
		      label="登记人姓名">
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
	    <v-active :activeType="activeType" :activeId="activeId" :elders="elders"></v-active>
	</div>
</template>

<script>
import vActive from "./addActive.vue";

export default {
  props: ["searchData", "activeType"],
  data() {
    return {
      tableData: [],
      total: 0,
      last_page: 0,
      activeId: 0,
      elders: [],
      multipleSelection: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vActive
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
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
      let url = this.api.careactivitieslist + "?page=" + val;
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
          this.activeId = 0;
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
    showAdd(scope) {
      this.$store.dispatch("addActiveTrue");
      this.$store.dispatch("isActiveFalse");
      if (scope != 0) {
        this.activeId = scope.id;
      } else {
        this.activeId = 0;
      }
    },
    showEdit(scope) {
      this.$store.dispatch("addActiveTrue");
      this.$store.dispatch("isActiveTrue");
      this.activeId = scope.id;
    },
    deleteActive: async function(id) {
      let url = this.api.careactivitiesdel;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteSuccess,
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
        this.$alert(this.message.pleaseChoiceActive, "", {
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
            this.deleteActive(data);
          })
          .catch(() => {});
      }
    },
    clean() {
      this.activeId = 0;
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