<template>
  <div  class="Editqfgl" v-show="qfglcheckout">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
        <div class="pop-top">
          <h5>欠费详情</h5>
          <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
        </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-form :rules="rules" ref="form" :model="form" label-width="100px">
              <div style="display: flex;justify-content: space-around;">
                <el-form-item label="老人姓名:" prop="elder_name">
                  <el-input disabled v-model="form.elder_name"></el-input>
                </el-form-item>
                <el-form-item label="床位号:" prop="beds_name">
                  <el-input disabled v-model="form.beds_name"></el-input>
                </el-form-item>
                <el-form-item label="护理等级:" prop="level_name">
                  <el-input disabled v-model="form.level_name"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="账单情况:">
                <el-table
                  :data="tableData"
                  max-height="250"
                  style="width: 100%">
                  <el-table-column
                    prop="month"
                    label="年月">
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    label="合计(元)">
                  </el-table-column>
                  <el-table-column
                    prop="discount"
                    label="折扣(元)">
                  </el-table-column>
                  <el-table-column
                    prop="account_paid"
                    label="已交(元)">
                  </el-table-column>
                  <el-table-column
                    prop="arrearage"
                    label="欠费(元)">
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="showZDXQ(scope.row)">账单详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="欠费合计:" prop="arrearage">
                  <el-input disabled v-model="form.arrearage">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="需交押金:" prop="deposits">
                  <el-input disabled v-model="form.deposits">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="老人钱包余额:" prop="imprests">
                  <el-input disabled v-model="form.imprests">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="应交:" prop="total">
                  <el-input disabled v-model="form.total">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="实交:" prop="fee">
                  <el-input v-model="form.fee" type="number">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="缴费人:" prop="payer">
                  <el-input v-model="form.payer"></el-input>
                </el-form-item>
              </div>
              <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
                <el-button type="danger" size="medium" style="margin-left: 30px;" @click="submitForm('form')">交费</el-button>
              </div>
            </el-form>
          </div>
				</el-scrollbar>
			</el-main>
		</el-container>
    <v-zdxq :ZDXQId="ZDXQId"></v-zdxq>
  </div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";
import vZdxq from "./ZDXQTable.vue";

export default {
  props: ["checkInId"],
  data() {
    return {
      form: {
        elder_name: "",
        beds_name: "",
        level_name: "",
        arrearage: "",
        deposits: "",
        imprests: "",
        total: "",
        payer: "",
        fee: ""
      },
      rules: {
        fee: [{ required: true, message: this.message.pleaseInputMoney, trigger: "blur" }],
        payer: [{ required: true, message: this.message.pleaseInputPayer, trigger: "blur" }]
      },
      tableData: [],
      ZDXQId: 0,
      loading: false
    };
  },
  components: {
    vZdxq
  },
  watch: {
    checkInId() {
      if (this.checkInId != 0) {
        this.fetchDetail(this.checkInId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.fee < this.form.total) {
            this.$alert(this.message.payMoneyNoLessDebt, "", {
              confirmButtonText: this.message.confirm,
              callback: action => {}
            });
          } else {
            var data = {
              id: this.checkInId,
              fee: this.form.fee,
              payer: this.form.payer,
              employee_id: localEvent.StorageGetter("empId")
            };
            this.saveEdit(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("qfglCheckOutFalse");
      this.$refs["form"].resetFields();
      this.$parent.$parent.clean();
    },
    saveEdit: async function(data) {
      let url = this.api.feemanagestore;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.$parent.fetchList();
          this.hideEditFalse();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    fetchDetail: async function(Id) {
      this.loading = true;
      let url = this.api.feemanagedetail;
      var data = {
        check_in_id: Id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.elder_name = res.data.data.old_name;
          this.form.beds_name = res.data.data.bed_name;
          this.form.level_name = res.data.data.level_name;
          this.form.arrearage = res.data.data.total;
          this.form.deposits = res.data.data.deposits;
          this.form.imprests = res.data.data.imprests;
          this.form.total = res.data.data.total_amount;
          this.tableData = res.data.data.bill;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(this.message.timeOut, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hideEditFalse();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEditFalse();
          }
        });
      }
    },
    showZDXQ(scope) {
      this.$store.dispatch("isZDXQTrue");
      this.ZDXQId = scope.id;
    },
    clean() {
      this.ZDXQId = 0;
    }
  },
  computed: mapState(["qfglcheckout"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -400px;
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
.Editqfgl {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
