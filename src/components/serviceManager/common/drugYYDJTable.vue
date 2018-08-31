<template>
  <div class="table">
    <el-button @click="goback" type="danger" size="small" style="margin-top: 10px;margin-right: 30px;float: right;z-index: 99;">
      <i class="el-icon-arrow-left el-icon--left">返回</i>
    </el-button>
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="drugname"
          label="药品名">
        </el-table-column>
        <el-table-column
          prop="mtime"
          label="用药时间">
        </el-table-column>
        <el-table-column
          prop="isprovisionality"
          label="用药方式">
          <template slot-scope="scope">
            <p>{{scope.row.isprovisionality == 0 ? '常规用药' : scope.row.isprovisionality == 1 ? '临时用药' : ''}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="meal_id"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="marcount"
          label="数量">
        </el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: flex-end;">
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
      total: 0,
      last_page: 0,
      multipleSelection: [],
      loading: false,
      currentPage: 1
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
      let url = this.api.medicationrecordlist + "?page=" + val;
      var data = {
        elderid: this.$route.params.elderid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
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
          callback: action => {}
        });
      }
    },
    goback: async function() {
      this.$router.go(-1);
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