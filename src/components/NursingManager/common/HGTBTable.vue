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
		      prop="successionname"
		      label="接班人">
		    </el-table-column>
		    <el-table-column
		      label="被替换的班次">
		      <template slot-scope="scope">
		      	<p>{{scope.row.timeplanid.wstname}}({{scope.row.timeplanid.starttime}}~{{scope.row.timeplanid.endtime}})</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="shiftname"
		      label="交班人">
		    </el-table-column>
		    <el-table-column
		      prop="startdate"
		      label="替班日期">
		    </el-table-column>
		    <el-table-column
		      prop="createdat"
		      label="登记时间">
		    </el-table-column>
		    <el-table-column
		      prop="employeename"
		      label="登记人">
		    </el-table-column>
		    <el-table-column
		      prop="workshiftstatus"
		      label="审批状态">
		      <template slot-scope="scope">
		      	<p>{{scope.row.workshiftstatus == 0 ? '待审批' : scope.row.workshiftstatus == 1 ? '同意' : scope.row.workshiftstatus == 2 ? '拒绝' : scope.row.workshiftstatus == -1 ? '失效' : ''}}</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button v-if="scope.row.workshiftstatus == 0" type="text" size="small" @click="approve(scope.row)">审批</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<el-dialog
		  title="审批"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <span>是否同意替班？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="disAgree">拒 绝</el-button>
		    <el-button type="primary" @click="agree">同 意</el-button>
		  </span>
		</el-dialog>
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
	    <v-relay :workshiftid="workshiftid" :nursesTeam="nursesTeam"></v-relay>
	</div>
</template>

<script>
import vRelay from "./addNursRelay.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      workshiftid: 0,
      total: 0,
      last_page: 0,
      nursesTeam: [],
      dialogVisible: false,
      proveId: 0,
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vRelay
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchNursTeam();
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
      let url = this.api.workshiftlist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.workshiftid = 0;
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
    fetchNursTeam: async function() {
      let url = this.api.getnursegrouplist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.nursesTeam = res.data.data;
    },
    deleteRelay: async function(id) {
      let url = this.api.workshiftdel;
      var data = {
        workshiftid: id
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
        this.$alert(this.message.pleaseChoiceRelay, "", {
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
              let id = id_arr[k].workshiftid;
              idArr.push(id);
            }
            this.deleteRelay(idArr);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addNursRelayTrue");
      if (scope != 0) {
        this.workshiftid = scope.workshiftid;
      } else {
        this.workshiftid = 0;
      }
    },
    agree: async function() {
      let url = this.api.approveworkshift;
      var data = {
        workshiftid: this.proveId,
        workstatus: 1
      };
      const res = await this.$http.post(url, data);
      this.fetchList(1);
      this.dialogVisible = false;
    },
    disAgree: async function() {
      let url = this.api.approveworkshift;
      var data = {
        workshiftid: this.proveId,
        workstatus: 2
      };
      const res = await this.$http.post(url, data);
      this.fetchList(1);
      this.dialogVisible = false;
    },
    approve(scope) {
      this.proveId = scope.workshiftid;
      this.dialogVisible = true;
    },
    clean() {
      this.workshiftid = 0;
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