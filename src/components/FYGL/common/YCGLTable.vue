<template>
  <div class="table">
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="index"
        width="55">
      </el-table-column>
      <el-table-column
        prop="old_name"
        label="老人姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="id_number"
        label="身份证号">
      </el-table-column>
      <el-table-column
        prop="bed_name"
        label="床位号">
      </el-table-column>
      <el-table-column
        prop="imprests"
        label="账户余额">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
      <div>
        <el-button type="success" @click="showEdit">预存</el-button>
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
    <v-ycgldetail :imprests="imprests" :checkinId="checkinId" :methods="methods"></v-ycgldetail>
  </div>
</template>

<script>
import vYcgle from "./ycglEdit.vue";
import vYcgldetail from "./ycglDetail.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      total: 0,
      last_page: 0,
      elders: [],
      methods: [],
      imprests: 0,
      loading: false,
      checkinId: 0,
      currentPage: 1
    };
  },
  components: {
    vYcgle,
    vYcgldetail
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.imprestrecordlist + "?page=" + val;
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
      this.$store.dispatch("YcglEditOpen");
    },
    showDetail(scope) {
      this.$store.dispatch("ycglDetailTrue");
      this.imprests = scope.imprests;
      this.checkinId = scope.check_in_id;
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
    },
    clean(){
      this.checkinId = 0;
      this.imprests = 0;
    }
  }
};
</script>

<style scoped>
</style>
