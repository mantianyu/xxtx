<template>
    <div class="table">
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="仓库名称">
            </el-table-column>
            <el-table-column
              prop="location"
              label="仓库位置">
            </el-table-column>
            <el-table-column
              prop="manager"
              label="管理员">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showEdit(scope.row)">修改</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
            <el-button type="danger" @click="delMore">删除</el-button>
            <el-button type="success" @click="showEdit(0)">新增</el-button>
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
        <v-ecksz :Id="Id" :manage="manage"></v-ecksz>
    </div>
</template>

<script>
import vEcksz from "./ckszEdit.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      Id: 0,
      total: 0,
      last_page: 0,
      elders: [],
      loading: false,
      emps: [],
      currentPage: 1,
      manage: []
    };
  },
  components: {
    vEcksz
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchManage();
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
      let url = this.api.getrepositorylist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.page_count;
          this.oldOutId = 0;
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
    fetchManage: async function() {
      let url = this.api.getrepokv;
      let data = {};
      const res = await this.$http.post(url, data);
      this.manage = res.data.data;
    },
    delList: async function(id) {
      let url = this.api.delrepository;
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
        this.$alert(this.message.pleaseChoiceDelete, "", {
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
            this.delList(data);
          })
          .catch(() => {});
      }
    },
    showEdit(scope) {
      if (scope === 0) {
        this.Id = 0;
      } else {
        this.Id = scope.id;
      }
      this.$store.dispatch("ckszEditTrue");
    },
    clean() {
      this.Id = 0;
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
