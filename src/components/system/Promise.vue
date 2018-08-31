<template>
  <div class="promise">
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="promisename"
        label="权限组">
      </el-table-column>
      <el-table-column
        prop="active"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showPromiseEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;">
      <el-button type="danger" @click="delMore">删除</el-button>
      <el-button type="success" @click="showPromiseEdit(0)">添加权限组</el-button>
    </div>
    <v-pedit :roleid="roleid"></v-pedit>
  </div>
</template>
<script>
import vPedit from "./PromiseEdit.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      loading: false,
      roleid: 0
    };
  },
  components: {
    vPedit
  },
  mounted() {
    this.PromiseList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    PromiseList: async function() {
      this.loading = true;
      let url = this.api.promiseList;
      let data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          let PList = res.data.data;
          this.tableData = [];
          for (let i = 0; i < PList.length; i++) {
            var promise = {
              promisename: PList[i].name,
              pid: PList[i].id,
              is_readonly: PList[i].is_readonly,
              is_fixed: PList[i].is_fixed
            };
            this.tableData.push(promise);
          }
          this.$nextTick(function() {
            this.loading = false;
          });
          this.PName = "";
          this.pid = 0;
          this.permissions = [];
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
    showPromiseEdit(scope) {
      this.$store.dispatch("promiseEditOpen");
      if (scope != 0) {
        this.roleid = scope.pid;
      }
    },
    clean() {
      this.roleid = 0;
    },
    PromiseDel: async function(roleid) {
      let url = this.api.delUserRole;
      var data = {
        roleid: roleid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteSuccess,
              type: "success"
            });
          this.PromiseList();
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
        this.$alert(this.message.pleaseChoiceLimitsWarning, "", {
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
              let pid = id_arr[k].pid;
              data.push(pid);
            }
            this.PromiseDel(data);
          })
          .catch(() => {});
      }
    }
  }
};
</script>
<style scoped>
</style>