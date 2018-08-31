<template>
    <div class="table">
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%">
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
                            prop="specification"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="物资单价(元)">
                        </el-table-column>
                        <el-table-column
                            prop="num"
                            label="库存数量">
                        </el-table-column>
                        <el-table-column
                            prop="value"
                            label="总金额(元)">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="仓库名称">
            </el-table-column>
            <el-table-column
              prop="goods_value"
              label="仓库资产总金额(元)">
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div></div>
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
    </div>
</template>

<script>
export default {
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
      flow: [],
    };
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
      let url = this.api.getrepositorymoneylist + "?page=" + val;
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
