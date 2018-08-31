<template>
    <div class="table">
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column type="index" width="55">
            </el-table-column>
            <el-table-column
              prop="order_id"
              label="记录编号">
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="记录日期">
            </el-table-column>
            <el-table-column
              prop="in_repo"
              label="申请仓库名称">
            </el-table-column>
            <el-table-column
              prop="out_repo"
              label="调拨仓库名称">
            </el-table-column>
            <el-table-column
              prop="operator"
              label="是否审核">
              <template slot-scope="scope">
                  <p>{{ scope.row.status === 2 ? '未同意' : scope.row.status === 1 ? '同意' : '未审核' }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status === 0" type="text" size="small" @click="approve(scope.row)">调拨审核</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
            <el-button type="success" @click="showAdd">调拨申请</el-button>
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
        <v-wzdb :in_repo="in_repo" :out_repo="out_repo"></v-wzdb>
        <v-wzdbapp :Id="Id"></v-wzdbapp>
    </div>
</template>

<script>
import vWzdb from "./addWZDB.vue";
import vWzdbapp from "./WZDBApprove.vue";

export default {
  props: ["searchData", "in_repo", "out_repo"],
  data() {
    return {
      tableData: [],
      Id: 0,
      total: 0,
      last_page: 0,
      elders: [],
      loading: false,
      currentPage: 1,
    };
  },
  components: {
    vWzdb, vWzdbapp
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
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getallotapplylist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.page_count;
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
    showAdd() {
      this.Id = 0;
      this.$store.dispatch("addWZDBTrue");
    },
    approve(scope) {
      this.Id = scope.id;
      this.$store.dispatch("WZDBApproveTrue");
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
