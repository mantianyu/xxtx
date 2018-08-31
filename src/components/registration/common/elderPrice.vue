<template>
    <div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">账户余额</p>
                <el-button type="danger" size="small" style="margin-right: 60px;" @click="prestore">预存</el-button>
            </div>
            <div style="display: flex;">
                <div style="width: 510px;height: 30px;border: 1px solid #ddd;box-sizing: border-box;text-align: center;font-size: 14px;color: #333;line-height: 30px;">账户余额</div>
                <div style="width: 510px;height: 30px;border: 1px solid #ddd;box-sizing: border-box;border-left: 0;text-align: center;font-size: 14px;color: #333;line-height: 30px;">{{ imprests }}（元）</div>
            </div>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">押金总额</p>
                <div></div>
            </div>
            <div style="display: flex;">
                <div style="width: 510px;height: 30px;border: 1px solid #ddd;box-sizing: border-box;text-align: center;font-size: 14px;color: #333;line-height: 30px;">账户余额</div>
                <div style="width: 510px;height: 30px;border: 1px solid #ddd;box-sizing: border-box;border-left: 0;text-align: center;font-size: 14px;color: #333;line-height: 30px;">{{ deposits }}（元）</div>
            </div>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">月消费总额</p>
                <div></div>
            </div>
            <el-table
                :data="tableDataYXF"
                stripe
                style="width: 100%">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                    prop="fee_name"
                    label="费用类别">
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="金额(元)">
                </el-table-column>
                <el-table-column
                    prop="discount"
                    label="折扣(元)">
                </el-table-column>
            </el-table>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">账单信息</p>
                <div></div>
            </div>
            <el-table
                :data="tableDataZDXX"
                style="width: 100%">
                <el-table-column
                prop="month"
                label="年月">
                </el-table-column>
                <el-table-column
                prop="amount"
                label="合计">
                </el-table-column>
                <el-table-column
                prop="discount"
                label="折扣">
                </el-table-column>
                <el-table-column
                prop="account_paid"
                label="已交">
                </el-table-column>
                <el-table-column
                prop="arrearage"
                label="欠费">
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div></div>
                <div style="display: flex;margin-right: 20px;">
                    <el-button type="primary" size="small" @click="fetchZDXX(1)">首页</el-button>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange3"
                        :current-page="currentPage3"
                        :page-size="5"
                        layout="prev, pager, next"
                        :total="total3">
                    </el-pagination>
                    <el-button type="primary" size="small" @click="fetchZDXX(last_page3)">末页</el-button>
                </div>
            </div>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">交费记录</p>
                <div></div>
            </div>
            <el-table
                :data="tableDataJFJL"
                style="width: 100%"
                stripe>
                <el-table-column
                prop="created_at"
                label="交费时间">
                </el-table-column>
                <el-table-column
                prop="amount"
                label="交费金额（元）">
                </el-table-column>
                <el-table-column
                prop="method"
                label="支付方式">
                </el-table-column>
                <el-table-column
                prop="remarks"
                label="备注">
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div></div>
                <div style="display: flex;margin-right: 20px;">
                    <el-button type="primary" size="small" @click="fetchJFJL(1)">首页</el-button>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange1"
                        :current-page="currentPage1"
                        :page-size="5"
                        layout="prev, pager, next"
                        :total="total1">
                    </el-pagination>
                    <el-button type="primary" size="small" @click="fetchJFJL(last_page1)">末页</el-button>
                </div>
            </div>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">费用流水</p>
            </div>
            <el-table
                :data="tableDataFYLS"
                style="width: 100%"
                stripe>
                <el-table-column
                prop="date_time"
                label="费用时间">
                </el-table-column>
                <el-table-column
                prop="amount"
                label="金额（元）">
                </el-table-column>
                <el-table-column
                prop="price_type_name"
                label="费用类别">
                </el-table-column>
                <el-table-column
                prop="remarks"
                label="备注">
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div></div>
                <div style="display: flex;margin-right: 20px;">
                    <el-button type="primary" size="small" @click="fetchFYLS(1)">首页</el-button>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange2"
                        :current-page="currentPage2"
                        :page-size="5"
                        layout="prev, pager, next"
                        :total="total2">
                    </el-pagination>
                    <el-button type="primary" size="small" @click="fetchFYLS(last_page2)">末页</el-button>
                </div>
            </div>
        </div>
        <v-ycgle v-if="ycglEdit" :elders="elders" :methods="methods" :checkin_id="checkin_id"></v-ycgle>
    </div>
</template>

<script>
import vYcgle from "../../FYGL/common/ycglEdit.vue";
import { mapState } from "vuex";

export default {
  props: ["elderId", "imprests", "deposits", "checkin_id"],
  data() {
    return {
      tableDataYXF: [],
      tableDataZDXX: [],
      tableDataJFJL: [],
      total1: 0,
      last_page1: 0,
      currentPage1: 1,
      tableDataFYLS: [],
      total2: 0,
      last_page2: 0,
      currentPage2: 1,
      methods: [],
      elders: [],
      total3: 0,
      last_page3: 0,
      currentPage3: 1,
    };
  },
  components: {
    vYcgle
  },
  mounted() {
    this.fetchZDXX(1);
    this.fetchJFJL(1);
    this.fetchFYLS(1);
    this.fetchMethod();
    this.fetchElders();
  },
  methods: {
    handleCurrentChange1(val) {
      this.fetchJFJL(val);
    },
    handleCurrentChange2(val) {
      this.fetchFYLS(val);
    },
    handleCurrentChange3(val) {
      this.fetchZDXX(val);
    },
    showDetail(scope) {},
    fetchYXF: async function(id) {
      let url = this.api.checkoutfeelist;
      var data = {
        monthlybillid: id
      };
      const res = await this.$http.post(url, data);
      this.tableDataYXF = res.data.data;
    },
    fetchZDXX: async function(val) {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.monthBills + "?page=" + val;
      var data = {
        check_in_id: this.checkin_id,
        page_size: 5
      };
      const res = await this.$http.post(url, data);
      this.tableDataZDXX = res.data.data.list;
      this.total3 = res.data.data.total;
      this.last_page3 = res.data.data.last_page;
      if (res.data.data.list.length !== 0) {
        this.fetchYXF(res.data.data.list[0].id);
      }
      this.$nextTick(() => {
        this.$parent.$parent.$parent.$parent.loadingFalse();
        this.currentPage3 = val;
      });
    },
    fetchJFJL: async function(val) {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.getImpredetaillist + "?page=" + val;
      let data = {
        elder_id: this.elderId,
        amount: 5
      };
      const res = await this.$http.post(url, data);
      this.tableDataJFJL = res.data.data.data;
      this.total1 = res.data.data.total;
      this.last_page1 = res.data.data.last_page;
      this.$nextTick(() => {
        this.currentPage1 = val;
        this.$parent.$parent.$parent.$parent.loadingFalse();
      });
    },
    fetchFYLS: async function(val) {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.paymentrecordslist + "?page=" + val;
      let data = {
        elder_id: this.elderId,
        amount: 5
      };
      const res = await this.$http.post(url, data);
      this.tableDataFYLS = res.data.data.data;
      this.total2 = res.data.data.total;
      this.last_page2 = res.data.data.last_page;
      this.$nextTick(() => {
        this.currentPage2 = val;
        this.$parent.$parent.$parent.$parent.loadingFalse();
      });
    },
    fetchMethod: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_PAY_METHOD
      };
      const res = await this.$http.post(url, data);
      this.methods = res.data.data;
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    },
    prestore() {
      this.$store.dispatch("YcglEditOpen");
    }
  },
  computed: mapState(["ycglEdit"])
};
</script>

<style>
</style>
