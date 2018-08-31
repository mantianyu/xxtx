<template>
	<el-container style="height: 100%;width: 100%;position: absolute;">
		<el-header style="height: 67px;border-bottom: 1px solid #ddd;">
			<div>
		      	<h5 style="color: #ff8777;margin-left: 30px;padding-top: 20px;margin-bottom: 20px;">护理项目</h5>
		    </div>
		</el-header>
		<el-main style="padding: 0;position: relative;">
			<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
				<div>
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
								label="项目名称">
							</el-table-column>
							<el-table-column
								prop="price"
								label="项目费用">
							</el-table-column>
							<el-table-column
								prop="price_mode"
								label="收费方式">
							</el-table-column>
							<el-table-column
								prop="nursing_time"
								label="所需时间">
								<template slot-scope="scope">
									<p>{{scope.row.nursing_time}}分钟</p>
								</template>
							</el-table-column>
							<el-table-column
								prop="type_name"
								label="所属类别">
							</el-table-column>
							<el-table-column
								prop="introduction"
								label="项目说明">
							</el-table-column>
							<el-table-column
								label="操作">
									<template slot-scope="scope">
										<el-button v-if="tableData.length != 0" type="text" size="small" @click="showAddHLXM(scope)">修改</el-button>
									</template>
							</el-table-column>
					</el-table>
					<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
						<div>
              <el-button type="danger" @click="delMore">删除</el-button>
              <el-button type="success" @click="showAddHLXM(0)">添加</el-button>
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
						<v-hlxmedit :nursId="nursId" :typeLists="typeLists"></v-hlxmedit>
				</div>
			</el-scrollbar>
		</el-main>
	</el-container>
	
</template>

<script>
import vHlxmedit from "./addHLXMEdit.vue";

export default {
  data() {
    return {
      tableData: [],
      name: "",
      multipleSelection: [],
      id: 0,
      total: 0,
      last_page: 0,
      nursId: 0,
      typeLists: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vHlxmedit
  },
  mounted() {
    this.fetchList(1);
    this.fetchTypeList();
  },
  watch: {
    "$route.params.pid"() {
      this.fetchList(1);
    }
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
      let url = this.api.nursingitemslist + "?page=" + val;
      var data = {
        type_id: this.$route.params.pid
      };
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
    showAddHLXM(scope) {
      this.$store.dispatch("addHLXMEditTrue");
      this.fetchTypeList();
      if (scope == 0) {
        this.nursId = 0;
      } else {
        this.nursId = scope.row.id;
      }
    },
    fetchTypeList: async function() {
      let url = this.api.nursingprojectlist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.typeLists = res.data.data;
    },
    delete: async function(id) {
      let url = this.api.deleteitems;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
           this.$notify({
              title: this.message.success,
              message: this.message.deleteNurseProSuccess,
              type: "success"
            });
          this.fetchList(1);
          if (res.data.data !== "") {
            this.$alert(res.data.data + this.message.usingCannotDelete, "", {
              confirmButtonText: this.message.confirm,
              center: true,
              callback: action => {}
            });
          }
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
        this.$alert(this.message.pleaseChoicePro, "", {
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
            this.delete(data);
          })
          .catch(() => {});
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
a {
  color: #606266;
}
</style>