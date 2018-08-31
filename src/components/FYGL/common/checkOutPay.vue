<template>
  <div class="checkOutPay" v-show="checkOutPay">
		<el-container class="pop">
			<el-header style="height: auto;">
          <div class="pop-top">
              <h5>退住结算</h5>
              <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
          </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-form :rules="rules" ref="form" :model="form" label-width="120px">
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="老人姓名:" prop="elder_id">
                  <el-select v-model="form.elder_id" filterable clearable placeholder="请选择老人" @change="changeElder">
                      <el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.checkin_id" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="结算时间:" prop="time">
                    <el-date-picker disabled type="datetime" placeholder="选择日期" v-model="form.time"></el-date-picker>
                </el-form-item>
              </div>
              <el-form-item v-if="isShow" label="账单情况:">
                <el-table
                  :data="bills"
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
                  <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="editConsume(scope.row)">修改出院账单</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <!-- <el-form-item v-if="isShow" label="押金及预存情况:">
                <el-table
                  :data="deposits"
                  style="width: 100%">
                  <el-table-column
                    prop="date"
                    label="类别名称">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="金额(元)">
                  </el-table-column>
                </el-table>
              </el-form-item> -->
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="其他退费:" prop="remissions">
                  <el-input v-model="form.remissions" @blur="totalPay" type="number">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="欠费合计:" prop="arrearages">
                  <el-input disabled v-model="form.arrearages" type="number">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="押金合计:" prop="deposit">
                  <el-input disabled v-model="form.deposit" type="number">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="预存合计:" prop="imprest">
                  <el-input disabled v-model="form.imprest" type="number">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="应交:" prop="payIn">
                  <el-input disabled v-model="form.payIn" type="number">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="应退:" prop="payOut">
                  <el-input disabled v-model="form.payOut" type="number">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
                  <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
              </div>
            </el-form>
          </div>
				</el-scrollbar>
			</el-main>
		</el-container>
      <v-consume :consumeId="consumeId" :checkinid="check_in_id"></v-consume>
  </div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";
import vConsume from "./consume.vue";

export default {
  props: ["elders"],
  data() {
    var remissions = (rule, value, callback) => {
      if (value) {
        if (value < 0 || value > (this.form.amount - this.form.deposit)) {
          callback(new Error(this.message.payNotGood));
        }
        callback();
      }else{
        callback();
      }
    };
    return {
      form: {
        elder_id: "",
        time: new Date(),
        remissions: 0,
        arrearages: 0,
        deposit: 0,
        imprest: 0,
        payIn: 0,
        payOut: 0,
        amount: 0
      },
      rules: {
        elder_id: [
          { required: true, message: this.message.pleaseChoiceElder, trigger: "change" }
        ],
        remissions: [{ required: true, validator: remissions, trigger: "blur" }]
      },
      bills: [],
      deposits: [],
      check_in_id: 0,
      employee_id: localEvent.StorageGetter("empId"),
      isShow: false,
      consumeId: 0,
      bLoading: false,
    };
  },
  components: {
    vConsume
  },
  watch: {
    checkOutPay() {
      this.form.elder_id = "";
      this.form.time = new Date();
      this.form.remissions = 0;
      this.form.arrearages = 0;
      this.form.deposit = 0;
      this.form.imprest = 0;
      this.form.amount = 0;
      (this.form.payIn = 0), (this.form.payOut = 0);
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elder_id: this.elder_id,
            check_in_id: this.check_in_id,
            remissions: this.form.remissions,
            employee_id: this.employee_id,
            imprest: this.form.imprest,
            deposit: this.form.deposit
          };
          this.saveEdit(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("checkOutPayFalse");
      this.$refs["form"].resetFields();
      this.isShow = false;
      this.bills = [];
      this.form.amount = 0;
    },
    saveEdit: async function(data) {
      let url = this.api.addretreatsettlement;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.addCheckoutSuccess,
              type: "success"
            });
          this.$parent.fetchList(1);
          this.$parent.fetchElders();
          this.bLoading = false;
          this.hideEditFalse();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    changeElder(val) {
      for (let i = 0; i < this.elders.length; i++) {
        if (this.elders[i].checkin_id == val) {
          this.check_in_id = this.elders[i].checkin_id;
          this.elder_id = this.elders[i].elder_id;
          this.isShow = true;
          this.fetchBills(val);
          this.fetchTotal(val);
          break;
        }
      }
    },
    fetchBills: async function(id) {
      let url = this.api.getretreatsettlementdetail;
      var data = {
        checkinid: id
      };
      const res = await this.$http.post(url, data);
      this.bills = res.data.data;
      var total = 0;
      var amount = 0;
      for (let i = 0; i < res.data.data.length; i++) {
        total = total + res.data.data[i].arrearage * 1;
        amount = amount + (res.data.data[i].amount * 1 - res.data.data[i].discount * 1);
      }
      this.form.arrearages = total;
      this.form.amount = amount;
      this.totalPay();
    },
    fetchTotal: async function(id) {
      let url = this.api.imprestdeposit;
      var data = {
        checkinid: id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.form.deposit = res.data.data.deposit;
        this.form.imprest = res.data.data.imprest;
        this.totalPay();
      }
    },
    totalPay() {
      this.form.payIn =
        this.form.arrearages * 1 -
          (this.form.deposit * 1 +
            this.form.imprest * 1 +
            this.form.remissions * 1) <=
        0
          ? 0
          : (this.form.arrearages * 1 -
            (this.form.deposit * 1 +
              this.form.imprest * 1 +
              this.form.remissions * 1)).toFixed(2);
      this.form.payOut =
        this.form.deposit * 1 +
          this.form.imprest * 1 +
          this.form.remissions * 1 -
          this.form.arrearages * 1 <=
        0
          ? 0
          : (this.form.deposit * 1 +
            this.form.imprest * 1 +
            this.form.remissions * 1 -
            this.form.arrearages * 1).toFixed(2);
    },
    editConsume(scope) {
      this.$store.dispatch("consumeTrue");
      this.consumeId = scope.id;
    },
    clean() {
      this.consumeId = 0;
    }
  },
  computed: mapState(["checkOutPay"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 805px;
  height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -402px;
}
.pop-top {
  border-bottom: 1px #e5e5e5 solid;
  padding: 0 20px;
  overflow: hidden;
  background: #f2f2f2;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  z-index: 99;
}
.pop-top h5 {
  float: left;
  font-weight: normal;
  font-size: 16px;
  line-height: 50px;
  margin: 0;
}
.pop-top span {
  float: right;
  cursor: pointer;
  display: block;
  width: 12px;
  height: 12px;
  margin-top: 20px;
}
.qxz {
  padding: 40px;
  margin-top: 25px;
  padding-top: 0;
}
.checkOutPay {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2001;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>