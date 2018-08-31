<template>
	<div class="table">
		<el-table v-loading="loading" :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="visitor" label="来访人姓名">
			</el-table-column>
			<el-table-column prop="old_name" label="老人姓名">
			</el-table-column>
			<el-table-column prop="visitor_phone" label="联系电话">
			</el-table-column>
			<el-table-column label="与老人关系">
				<template slot-scope="scope">
					<p>{{relation[scope.row.relation]}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="reason" label="来访缘由">
			</el-table-column>
			<el-table-column prop="visit_time" label="来访时间">
			</el-table-column>
			<el-table-column prop="leave_time" label="离开时间">
			</el-table-column>
			<el-table-column prop="employee_id" label="登记人">
			</el-table-column>
			<el-table-column prop="address" label="操作">
				<template slot-scope="scope">
					<el-button v-if="!scope.row.leave_time" type="text" size="small" @click="showEditFalse(scope.row,1)">修改</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin: 30px 0 800px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
				<el-button type="success" @click="showEditFalse(0,0)">新增</el-button>
				<el-button type="danger" @click="overMore">登记离开</el-button>
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
		<v-etslf :oldVisitId="oldVisitId" :relation="relation" :elders="elders"></v-etslf>
	</div>
</template>

<script>
import vEtslf from "./editTslf.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      oldVisitId: 0,
      relation: [],
      total: 0,
      last_page: 0,
      loading: false,
      elders: [],
      currentPage: 1
    };
  },
  components: {
    vEtslf
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchRelation();
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
      let url = this.api.visitlist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.oldVisitId = 0;
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
    showEditFalse(scope, oldVisitBackFlag) {
      this.$store.dispatch("oldVisitEditTrue");
      if (scope == 0) {
        this.oldVisitId = 0;
      } else {
        this.oldVisitId = scope.id;
      }
      if (oldVisitBackFlag == 1) {
        this.$store.dispatch("oldVisitEditBackTrue");
      } else {
        this.$store.dispatch("oldVisitEditBackFalse");
      }
    },
    clean() {
      this.oldVisitId = 0;
    },
    delOldVisitList: async function(id) {
      let url = this.api.delvisits;
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
        this.$alert(this.message.pleaseChoiceVisitor, "", {
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
            this.delOldVisitList(data);
          })
          .catch(() => {});
      }
    },
    overOldVisitList: async function(id) {
      let url = this.api.overvisits;
      var data = {
        id: id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.fetchList(1);
      }
    },
    overMore() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceVisitor, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        let id_arr = this.multipleSelection;
        for (let k = 0; k < id_arr.length; k++) {
          let id = id_arr[k].id;
          this.overOldVisitList(id);
        }
        this.$alert(this.message.registerLeaveSuccess, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    },
    fetchRelation: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_FAMILY_ELATION
      };
      const res = await this.$http.post(url, data);
      this.relation = res.data.data;
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
