<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="55">
      </el-table-column>
      <el-table-column
        prop="elder_name"
        label="老人姓名">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别">
        <template slot-scope="scope">
          <p>{{scope.row.gender == 1 ? '男' : '女'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="id_number"
        label="身份证号">
      </el-table-column>
      <el-table-column
        prop="address"
        label="家庭地址">
      </el-table-column>
      <el-table-column
        prop="check_in_time_date"
        label="入院时间">
      </el-table-column>
      <el-table-column
        prop="settlement_time_date"
        label="结算时间">
      </el-table-column>
      <el-table-column
        label="结算状态">
        <template slot-scope="scope">
          <p>已结算</p>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
      <div>
        <el-button type="success" @click="showEdit">新增</el-button>
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
    <v-checkoutpay :elders="elders"></v-checkoutpay>
  </div>
</template>

<script>
import vCheckoutpay from "./checkOutPay.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      total: 0,
      last_page: 0,
      elders: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vCheckoutpay
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchElders();
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getretreatsettlement + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.data.length == 0) {
            this.$notify({
              title: this.message.hint,
              message: this.message.informationNoExist,
              type: "warning"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: `为您搜索到${res.data.data.total}条信息`,
              type: "success"
            });
          }
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
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    showEdit() {
      this.$store.dispatch("checkOutPayTrue");
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    }
  }
};
</script>

<style scoped>
</style>
