<template>
    <div class="table">
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="index" width="55">
            </el-table-column>
            <el-table-column type="expand">
            <template slot-scope="scope">
                <el-table
                    :data="scope.row.goods_list"
                    stripe
                    style="width: 100%">
                    <el-table-column type="index" width="55">
                    </el-table-column>
                    <el-table-column
                        prop="goods"
                        label="物资名称">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="物资单价(元)">
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量">
                    </el-table-column>
                    <el-table-column
                        prop="user"
                        label="使用人">
                    </el-table-column>
                </el-table>
            </template>
            </el-table-column>
            <el-table-column
              prop="repo"
              label="仓库名称">
            </el-table-column>
            <el-table-column
              prop="order_id"
              label="出库单号">
            </el-table-column>
            <el-table-column
              prop="flow_type"
              label="物资来源">
            </el-table-column>
            <el-table-column
              prop="date"
              label="出库时间">
            </el-table-column>
            <el-table-column
              prop="operator"
              label="经办人">
            </el-table-column>
            <el-table-column
              prop="checker"
              label="登记人">
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
            <el-button type="success" @click="showEdit">出库登记</el-button>
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
        <v-ckgl :flow="flow" :repo="repo" :operator="operator"></v-ckgl>
    </div>
</template>

<script>
import vCkgl from "./addCKGL.vue";

export default {
  props: ["searchData", "repo", "operator"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      total: 0,
      last_page: 0,
      elders: [],
      loading: false,
      emps: [],
      currentPage: 1,
      flow: [],
    };
  },
  components: {
    vCkgl
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchData();
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
      let url = this.api.getinventoryoutcomelist + "?page=" + val;
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
    fetchData: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.GOODS_FLOW_TO,
        ]
      };
      const res = await this.$http.post(url, data);
      this.flow = res.data.data;
    },
    showEdit() {
      this.$store.dispatch("addCKGLTrue");
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
