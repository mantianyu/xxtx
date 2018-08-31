<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
			<div class="top-tit">
				<h5>部门管理</h5>
	    </div>
    </el-header>
    <el-main style="position: relative;">
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
								label="部门名称">
							</el-table-column>
							<el-table-column
								prop="leader"
								label="部门领导">
							</el-table-column>
							<el-table-column
								prop="phone"
								label="联系电话">
							</el-table-column>
							<el-table-column
								prop="address"
								label="地址">
							</el-table-column>
							<el-table-column
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
					<div style="display: flex;margin-right: 20px;"></div>
					</div>
				</div>
      </el-scrollbar>
    </el-main>
		<v-depart :departId="departId"></v-depart>
  </el-container>
</template>

<script>
import vDepart from "./addDepart.vue";

export default {
  data() {
    return {
      tableData: [],
      departId: 0,
      multipleSelection: [],
      loading: false
    };
  },
  components: {
    vDepart
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.getshowdepartmentslist;
      var data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data;
          this.departId = 0;
          this.$nextTick(function() {
            this.loading = false;
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
    deleteDepart: async function(id) {
      let url = this.api.departmentsdel;
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
        this.$alert(this.message.pleaseChoiceDepartment, "", {
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
            this.deleteDepart(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addDepartTrue");
      if (scope != 0) {
        this.departId = scope.id;
      } else {
        this.departId = 0;
      }
    },
    clean() {
      this.departId = 0;
    }
  }
};
</script>

<style scoped>
.depart {
  background-color: #fff;
  min-height: 100%;
}
.top-tit {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}
.top-tit h5 {
  color: #ff8777;
  font-weight: normal;
  float: left;
  line-height: 30px;
  margin: 0;
  font-size: 18px;
}
.demo-ruleForm {
  display: flex;
}
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-form-item {
  margin-bottom: 0;
}
</style>