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
              prop="repo"
              label="仓库名称">
            </el-table-column>
            <el-table-column
              prop="manager"
              label="管理员姓名">
            </el-table-column>
            <el-table-column
              prop="checker"
              label="登记人姓名">
            </el-table-column>
            <el-table-column
              prop="check_date"
              label="登记日期">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showEdit(scope.row)">详情</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
            <el-button type="success" @click="showAdd">新增</el-button>
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
        <v-kcpd :repo="repo"></v-kcpd>
        <v-pdrepo v-if="PDRepo"></v-pdrepo>
        <v-pdchoose v-if="PDChoose"></v-pdchoose>
        <v-pdedit :Id="Id" :repo="repo_name" :check_date="check_date" :manager="manager"></v-pdedit>
    </div>
</template>

<script>
import vKcpd from "./addKCPD.vue";
import vPdrepo from "./PDRepo.vue";
import vPdchoose from "./PDChoose.vue";
import vPdedit from "./PDEdit.vue";
import { mapState } from "vuex";

export default {
  props: ["searchData", "repo"],
  data() {
    return {
      tableData: [],
      Id: 0,
      total: 0,
      last_page: 0,
      elders: [],
      loading: false,
      currentPage: 1,
      repo_name: "",
      check_date: "",
      manager: ""
    };
  },
  components: {
    vKcpd, vPdrepo, vPdchoose, vPdedit
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
      let url = this.api.getinventorychecklist + "?page=" + val;
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
      this.$store.dispatch("addKCPDTrue");
    },
    showEdit(scope) {
      this.Id = scope.id;
      this.repo_name = scope.repo;
      this.check_date = scope.check_date;
      this.manager = scope.manager;
      this.$store.dispatch("PDEditTrue");
    },
    clean() {
      this.Id = 0;
    }
  },
  computed: mapState(["PDRepo", "PDChoose"])
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
</style>
