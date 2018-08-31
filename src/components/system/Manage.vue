<template>
  <div class="manage">
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
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="lastdate"
        label="上次登录">
      </el-table-column>
      <el-table-column
        prop="count"
        label="登录次数">
      </el-table-column>
      <el-table-column
        prop="promisename"
        label="权限组">
        <template slot-scope="scope">
          <p v-for="(promise, key) in promise_arr" :key="key" v-if="promise.pid == scope.row.promisename">
            {{promise.name}}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="active"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showManageEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;">
      <el-button type="danger" @click="delMore">删除</el-button>
      <el-button type="success" @click="showManageAdd">添加管理员</el-button>
    </div>
    <v-medit :userid="userid" :promise_arr="promise_arr"></v-medit>
  </div>
</template>
<script>
import vMedit from "./ManageEdit.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      userid: '',
      loading: false,
      promise_arr: [],
    };
  },
  components: {
    vMedit
  },
  mounted() {
    this.fetchList(1);
    this.PromiseList();
  },
  methods: {
    PromiseList: async function() {
      let url = this.api.promiseList;
      let data = {};
      const res = await this.$http.post(url, data);
      let PList = res.data.data;
      this.PromiseArr(PList);
    },
    PromiseArr(pList) {
      for (let i = 0; i < pList.length; i++) {
        var data = {
          name: pList[i].name,
          pid: pList[i].id
        };
        this.promise_arr.push(data);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.manageList;
      let data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var arr = res.data.data;
          this.tableData = [];
          for (let i = 0; i < arr.length; i++) {
            var manage = {
              username: arr[i].account,
              lastdate: arr[i].last_login_time,
              count: arr[i].login_count,
              promisename: arr[i].role_id,
              userid: arr[i].id,
              employee_id: arr[i].employee_id
            };
            this.tableData.push(manage);
          }
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
    showManageAdd() {
      this.$store.dispatch("manageEditOpen");
    },
    showManageEdit(scope) {
      this.$store.dispatch("manageEditOpen");
      this.userid = scope.employee_id;
    },
    clean() {
      this.userid = '';
    },
    ManageDel: async function(userid) {
      let url = this.api.userdel;
      var data = {
        userid: userid
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
        this.$alert(this.message.pleaseChoiceUser, "", {
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
              let uid = id_arr[k].userid;
              data.push(uid);
            }
            this.ManageDel(data);
          })
          .catch(() => {});
      }
    }
  }
};
</script>
<style scoped>
</style>
