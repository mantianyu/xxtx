<template>
  <div class="table">
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
        prop="beds_name"
        label="床位号">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="交费金额">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="交费时间">
      </el-table-column>
      <el-table-column
        prop="payer"
        label="交费人">
      </el-table-column>
      <el-table-column
        prop="method"
        label="支付方式">
      </el-table-column>
      <el-table-column
        prop="employees_name"
        label="登记人">
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="备注">
      </el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
      <div>
        <el-button type="success" @click="showEdit">新增交费</el-button>
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
    <v-ycgle :elders="elders" :methods="methods"></v-ycgle>
  </div>
</template>

<script>
import vYcgle from "./ycglEdit.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      total: 0,
      last_page: 0,
      elders: [],
      methods: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vYcgle
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchElders();
    this.fetchMethod();
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getImpredetaillist + "?page=" + val;
      var data = this.searchData;
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
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    showEdit() {
      this.$store.dispatch("YcglEditOpen");
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    },
    fetchMethod: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_PAY_METHOD
      };
      const res = await this.$http.post(url, data);
      this.methods = res.data.data;
    }
  }
};
</script>

<style scoped>
</style>
