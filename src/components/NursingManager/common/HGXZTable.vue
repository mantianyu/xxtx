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
				      	:data="scope.row.memberinfo"
			      		style="width: 100%">
					    <el-table-column
					      	type="index"
					      	width="55">
					    </el-table-column>
				      	<el-table-column
				        	prop="name"
				        	label="护工名称">
				      	</el-table-column>
					    <el-table-column
					      prop="address"
					      label="操作">
					      	<template slot-scope="scope">
					          	<el-button type="text" size="small" @click="showElders(scope.row)">修改看护老人</el-button>
					        </template>
					    </el-table-column>
				    </el-table>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="nlname"
		      label="小组名称">
		    </el-table-column>
		    <el-table-column
		      prop="leadername"
		      label="小组组长">
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
	    <v-hgxz v-if="addHGXZ" :nlid="nlid"></v-hgxz>
	    <v-elders :eldernlid="eldernlid" :care="care"></v-elders>
	</div>
</template>

<script>
import vHgxz from "./addHGXZ.vue";
import vElders from "./eldersList.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      nlid: 0,
      eldernlid: 0,
      roomnlid: 0,
      total: 0,
      last_page: 0,
      care: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vHgxz,
    vElders
  },
  watch: {},
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
      let url = this.api.nwgrouplist + "?page=" + val;
      var data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
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
    deleteTeam: async function(id) {
      let url = this.api.nwgroupdel;
      var data = {
        nlid: id
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
        this.$alert(this.message.pleaseChoiceGroup, "", {
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
              let id = id_arr[k].nlid;
              data.push(id);
            }
            this.deleteTeam(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addHGXZTrue");
      if (scope != 0) {
        this.nlid = scope.nlid;
      } else {
        this.nlid = 0;
      }
    },
    showElders(scope) {
      this.$store.dispatch("eldersListTrue");
      if (scope != 0) {
        this.eldernlid = scope.id;
      } else {
        this.eldernlid = 0;
      }
    },
    fetchCare: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.HEALTH_SELF_CARE_ABILITY
      };
      const res = await this.$http.post(url, data);
      this.care = res.data.data;
    },
    clean(){
      this.eldernlid = 0;
    }
  },
  computed: mapState(["addHGXZ"])
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
a {
  color: #606266;
}
</style>