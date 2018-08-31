<template>
    <el-scrollbar class="scrollbar" style="height: 100%">
      <div class="arrearage">
        <h6 class="main_Top_tit">欠费列表</h6>      
        <el-table :data="tableData" v-loading="loading">
            <el-table-column label="姓名" prop="old_name"></el-table-column>
            <el-table-column label="床位号" prop="bed_name"></el-table-column>
            <el-table-column label="欠费时间" prop="month"></el-table-column>
            <el-table-column label="欠费金额（元）" prop="arrearage">
              <template slot-scope="scope">
                  <p v-bind:style="{ color: scope.row.arrearage < 0 ? 'green' : 'red' }">{{ scope.row.arrearage }}</p>
              </template>
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
    </el-scrollbar>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      last_page: 0,
      loading: false,
      currentPage: 1
    };
  },
  watch: {},
  mounted() {
    this.fetchList(1);
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val){
      this.loading = true;
      let url = this.api.getfeemanagelists + '?page=' + val;
      let data = {};
      const res = await this.$http.post(url, data);
      this.tableData = res.data.data.data;
      this.total = res.data.data.total;
      this.last_page = res.data.data.last_page;
      this.$nextTick(function() {
        this.loading = false;
        this.currentPage = val;
      });
    }
  }
};
</script>

<style scoped>
.main_Top_tit {
  height: 15px;
  font-size: 16px;
  line-height: 16px;
  margin-left: 1%;
  color: #666666;
  padding-left: 20px;
  margin-top: 20px;
  border-left: 4px solid #f56c6c;
}
.arrearage {
  background-color: #fff;
  height: 700px;
  width: 97%;
  float: left;
  margin: 20px;
}
</style>
