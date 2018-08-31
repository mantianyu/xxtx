<template>
  <div class="checkInPay" v-show="checkInPay">
    <el-container class="pop" v-loading="loading">
      <el-header style="height: auto;">
          <div class="pop-top">
              <h5>缴费</h5>
              <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
          </div>
      </el-header>
      <el-main style="height: 91%;position: relative;">
        <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-table
              v-if="tableData2.length != 0"
              ref="multipleTable2"
              :data="tableData2"
              style="width: 100%;"
              @selection-change="handleSelectionChange2">
              <el-table-column
                type="selection"
                :selectable='checkboxInit'
                width="50">
              </el-table-column>
              <el-table-column
                prop="typename"
                label="月收">
              </el-table-column>
              <el-table-column
                prop="typeprice"
                label="收费标准(元)">
              </el-table-column>
          <el-table-column
            prop="amount"
            label="实际收费">
          </el-table-column>
              <el-table-column
                label="备注">
              </el-table-column>
            </el-table>
            <el-table
              v-if="tableData1.length != 0"
              ref="multipleTable1"
              :data="tableData1"
              style="width: 100%; margin-top: 20px;"
              @selection-change="handleSelectionChange1">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="typename"
                label="日常">
              </el-table-column>
              <el-table-column
                prop="typeprice"
                label="收费标准(元)">
              </el-table-column>
          <el-table-column
            prop="amount"
            label="实际收费">
          </el-table-column>
              <el-table-column
                label="备注">
              </el-table-column>
            </el-table>
            <el-table
              v-if="tableData3.length != 0"
              ref="multipleTable3"
              :data="tableData3"
              style="width: 100%; margin-top: 20px;"
              @selection-change="handleSelectionChange3">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="typename"
                label="年收">
              </el-table-column>
              <el-table-column
                prop="typeprice"
                label="收费标准(元)">
              </el-table-column>
          <el-table-column
            prop="amount"
            label="实际收费">
          </el-table-column>
              <el-table-column
                label="备注">
              </el-table-column>
            </el-table>
            <el-table
              v-if="tableData4.length != 0"
              ref="multipleTable4"
              :data="tableData4"
              style="width: 100%; margin-top: 20px;"
              @selection-change="handleSelectionChange4">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="typename"
                label="特殊">
              </el-table-column>
              <el-table-column
                prop="typeprice"
                label="收费标准(元)">
              </el-table-column>
          <el-table-column
            prop="amount"
            label="实际收费">
          </el-table-column>
              <el-table-column
                label="备注">
              </el-table-column>
            </el-table>
            <el-table
              v-if="tableData5.length != 0"
              ref="multipleTable5"
              :data="tableData5"
              style="width: 100%; margin-top: 20px;"
              @selection-change="handleSelectionChange5">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="typename"
                label="押金">
              </el-table-column>
              <el-table-column
                prop="typeprice"
                label="收费标准(元)">
              </el-table-column>
          <el-table-column
            prop="amount"
            label="实际收费">
          </el-table-column>
              <el-table-column
                label="备注">
              </el-table-column>
            </el-table>
            <el-table
              v-if="tableData6.length != 0"
              ref="multipleTable6"
              :data="tableData6"
              style="width: 100%; margin-top: 20px;"
              @selection-change="handleSelectionChange6">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="typename"
                label="阶段性收费">
              </el-table-column>
              <el-table-column
                prop="typeprice"
                label="收费标准(元)">
              </el-table-column>
          <el-table-column
            prop="amount"
            label="实际收费">
          </el-table-column>
              <el-table-column
                label="备注">
              </el-table-column>
            </el-table>
            <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm" style="margin-top: 30px;">
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="押金合计:" prop="deposits">
                  <el-input v-model="form.deposits" disabled style="width: 200px;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="应缴合计:" prop="arrearages">
                  <el-input v-model="form.arrearages" disabled style="width: 200px;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="减免费用:" prop="remissions">
                  <el-input v-model="form.remissions" style="width: 200px;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="预交费用:" prop="imprests">
                  <el-input v-model="form.imprests" disabled style="width: 200px;">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="实缴费用:" prop="finaldues">
                  <el-input v-model="form.finaldues" disabled style="width: 200px;">
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
  </div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["checkinid", "elderid", "checkintime"],
  data() {
    return {
      form: {
        deposits: 0,
        arrearages: 0,
        remissions: 0,
        imprests: 0,
        finaldues: 0
      },
      rules: {
        finaldues: [
          { required: true, message: "请输入实缴费用", trigger: "blur" }
        ]
      },
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      tableData6: [],
      multipleSelection1: [],
      multipleSelection2: [],
      multipleSelection3: [],
      multipleSelection4: [],
      multipleSelection5: [],
      multipleSelection6: [],
      loading: false,
      bLoading: false
    };
  },
  watch: {
    checkinid() {
      this.fetchDetail(this.checkinid);
    },
    "form.deposits"() {
      this.form.finaldues = (
        this.form.deposits * 1 +
        this.form.arrearages * 1 +
        this.form.imprests * 1
      ).toFixed(2);
    },
    "form.arrearages"() {
      this.form.finaldues = (
        this.form.deposits * 1 +
        this.form.arrearages * 1 +
        this.form.imprests * 1
      ).toFixed(2);
    },
    "form.imprests"() {
      this.form.finaldues = (
        this.form.deposits * 1 +
        this.form.arrearages * 1 +
        this.form.imprests * 1
      ).toFixed(2);
    }
  },
  methods: {
    hideEditFalse() {
      this.$store.dispatch("checkInPayFalse");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elderid: this.elderid,
            checkinid: this.checkinid,
            finaldues: this.form.finaldues,
            employeeid: localEvent.StorageGetter("empId"),
            type: 1,
            remissions: this.form.remissions,
            arrearages: this.form.arrearages,
            deposits: this.form.deposits,
            imprests: this.form.imprests,
            checkintime: this.checkintime,
            multipleSelection1: this.multipleSelection1,
            multipleSelection2: this.multipleSelection2,
            multipleSelection3: this.multipleSelection3,
            multipleSelection4: this.multipleSelection4,
            multipleSelection5: this.multipleSelection5,
            multipleSelection6: this.multipleSelection6
          };
          this.savePayIn(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    savePayIn: async function(data) {
      let url = this.api.addfeesettlement;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.$parent.RzjfManageList(1);
          this.bLoading = false;
          this.hideEditFalse();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: "确定",
            callback: action => {
              this.bLoading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: "确定",
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
      this.$nextTick(function() {
        var totalPrice1 = 0;
        for (let i = 0; i < this.multipleSelection1.length; i++) {
          totalPrice1 = totalPrice1 + this.multipleSelection1[i].amount * 1;
        }
        var totalPrice2 = 0;
        for (let i = 0; i < this.multipleSelection2.length; i++) {
          totalPrice2 = totalPrice2 + this.multipleSelection2[i].amount * 1;
        }
        var totalPrice3 = 0;
        for (let i = 0; i < this.multipleSelection3.length; i++) {
          totalPrice3 = totalPrice3 + this.multipleSelection3[i].amount * 1;
        }
        var totalPrice4 = 0;
        for (let i = 0; i < this.multipleSelection4.length; i++) {
          totalPrice4 = totalPrice4 + this.multipleSelection4[i].amount * 1;
        }
        var totalPrice6 = 0;
        for (let i = 0; i < this.multipleSelection6.length; i++) {
          totalPrice6 = totalPrice6 + this.multipleSelection6[i].amount * 1;
        }
        this.form.arrearages =
          totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6;
      });
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
      this.$nextTick(function() {
        var totalPrice1 = 0;
        for (let i = 0; i < this.multipleSelection1.length; i++) {
          totalPrice1 = totalPrice1 + this.multipleSelection1[i].amount * 1;
        }
        var totalPrice2 = 0;
        for (let i = 0; i < this.multipleSelection2.length; i++) {
          totalPrice2 = totalPrice2 + this.multipleSelection2[i].amount * 1;
        }
        var totalPrice3 = 0;
        for (let i = 0; i < this.multipleSelection3.length; i++) {
          totalPrice3 = totalPrice3 + this.multipleSelection3[i].amount * 1;
        }
        var totalPrice4 = 0;
        for (let i = 0; i < this.multipleSelection4.length; i++) {
          totalPrice4 = totalPrice4 + this.multipleSelection4[i].amount * 1;
        }
        var totalPrice6 = 0;
        for (let i = 0; i < this.multipleSelection6.length; i++) {
          totalPrice6 = totalPrice6 + this.multipleSelection6[i].amount * 1;
        }
        this.form.arrearages =
          totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6;
      });
    },
    handleSelectionChange3(val) {
      this.multipleSelection3 = val;
      this.$nextTick(function() {
        var totalPrice1 = 0;
        for (let i = 0; i < this.multipleSelection1.length; i++) {
          totalPrice1 = totalPrice1 + this.multipleSelection1[i].amount * 1;
        }
        var totalPrice2 = 0;
        for (let i = 0; i < this.multipleSelection2.length; i++) {
          totalPrice2 = totalPrice2 + this.multipleSelection2[i].amount * 1;
        }
        var totalPrice3 = 0;
        for (let i = 0; i < this.multipleSelection3.length; i++) {
          totalPrice3 = totalPrice3 + this.multipleSelection3[i].amount * 1;
        }
        var totalPrice4 = 0;
        for (let i = 0; i < this.multipleSelection4.length; i++) {
          totalPrice4 = totalPrice4 + this.multipleSelection4[i].amount * 1;
        }
        var totalPrice6 = 0;
        for (let i = 0; i < this.multipleSelection6.length; i++) {
          totalPrice6 = totalPrice6 + this.multipleSelection6[i].amount * 1;
        }
        this.form.arrearages =
          totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6;
      });
    },
    handleSelectionChange4(val) {
      this.multipleSelection4 = val;
      this.$nextTick(function() {
        var totalPrice1 = 0;
        for (let i = 0; i < this.multipleSelection1.length; i++) {
          totalPrice1 = totalPrice1 + this.multipleSelection1[i].amount * 1;
        }
        var totalPrice2 = 0;
        for (let i = 0; i < this.multipleSelection2.length; i++) {
          totalPrice2 = totalPrice2 + this.multipleSelection2[i].amount * 1;
        }
        var totalPrice3 = 0;
        for (let i = 0; i < this.multipleSelection3.length; i++) {
          totalPrice3 = totalPrice3 + this.multipleSelection3[i].amount * 1;
        }
        var totalPrice4 = 0;
        for (let i = 0; i < this.multipleSelection4.length; i++) {
          totalPrice4 = totalPrice4 + this.multipleSelection4[i].amount * 1;
        }
        var totalPrice6 = 0;
        for (let i = 0; i < this.multipleSelection6.length; i++) {
          totalPrice6 = totalPrice6 + this.multipleSelection6[i].amount * 1;
        }
        this.form.arrearages =
          totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6;
      });
    },
    handleSelectionChange5(val) {
      this.multipleSelection5 = val;
      var totalPrice5 = 0;
      for (let i = 0; i < val.length; i++) {
        totalPrice5 = totalPrice5 + val[i].amount * 1;
      }
      this.form.deposits = totalPrice5;
    },
    handleSelectionChange6(val) {
      this.multipleSelection6 = val;
      this.$nextTick(function() {
        var totalPrice1 = 0;
        for (let i = 0; i < this.multipleSelection1.length; i++) {
          totalPrice1 = totalPrice1 + this.multipleSelection1[i].amount * 1;
        }
        var totalPrice2 = 0;
        for (let i = 0; i < this.multipleSelection2.length; i++) {
          totalPrice2 = totalPrice2 + this.multipleSelection2[i].amount * 1;
        }
        var totalPrice3 = 0;
        for (let i = 0; i < this.multipleSelection3.length; i++) {
          totalPrice3 = totalPrice3 + this.multipleSelection3[i].amount * 1;
        }
        var totalPrice4 = 0;
        for (let i = 0; i < this.multipleSelection4.length; i++) {
          totalPrice4 = totalPrice4 + this.multipleSelection4[i].amount * 1;
        }
        var totalPrice6 = 0;
        for (let i = 0; i < this.multipleSelection6.length; i++) {
          totalPrice6 = totalPrice6 + this.multipleSelection6[i].amount * 1;
        }
        this.form.arrearages =
          totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6;
      });
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.getpricelist;
      var data = {
        checkinid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData2 = [];
          let checkprice = res.data.data.checkprice;
          for (var name in checkprice) {
            if (name == "levelprice") {
              var data = {
                typename: "护理费",
                typeprice: checkprice[name],
                amount:
                  checkprice["levelAmount"] == 0
                    ? "0.00"
                    : checkprice["levelAmount"],
                isChecked: true
              };
              this.tableData2.push(data);
            } else if (name == "recipetypeprice") {
              var data = {
                typename: "餐饮费",
                typeprice: checkprice[name],
                amount:
                  checkprice["recipetypeAmount"] == 0
                    ? "0.00"
                    : checkprice["recipetypeAmount"],
                isChecked: true
              };
              this.tableData2.push(data);
            } else if (name == "bedprice") {
              var data = {
                typename: "床位费",
                typeprice: checkprice[name],
                amount:
                  checkprice["bedAmount"] == 0
                    ? "0.00"
                    : checkprice["bedAmount"],
                isChecked: true
              };
              this.tableData2.push(data);
            } else if (name == "customprice") {
              var data = {
                typename: "定制护理费",
                typeprice: checkprice[name],
                amount:
                  checkprice["customAmount"] == 0
                    ? "0.00"
                    : checkprice["customAmount"],
                isChecked: true
              };
              this.tableData2.push(data);
            }
          }
          if (res.data.data.pricetype[2]) {
            for (let i = 0; i < res.data.data.pricetype[2].length; i++) {
              this.tableData2.push(res.data.data.pricetype[2][i]);
            }
          }
          this.tableData1 = [];
          this.tableData3 = [];
          this.tableData4 = [];
          this.tableData5 = [];
          this.tableData6 = [];
          if (res.data.data.pricetype[1]) {
            this.tableData1 = res.data.data.pricetype[1];
          }
          if (res.data.data.pricetype[3]) {
            this.tableData3 = res.data.data.pricetype[3];
          }
          if (res.data.data.pricetype[4]) {
            this.tableData4 = res.data.data.pricetype[4];
          }
          if (res.data.data.pricetype[5]) {
            this.tableData5 = res.data.data.pricetype[5];
          }
          if (res.data.data.pricetype[6]) {
            this.tableData6 = res.data.data.pricetype[6];
          }
          this.$nextTick(function() {
            this.tableData2.forEach(row => {
              this.$refs.multipleTable2.toggleRowSelection(row);
            });
            this.tableData1.forEach(row => {
              this.$refs.multipleTable1.toggleRowSelection(row);
            });
            this.tableData3.forEach(row => {
              this.$refs.multipleTable3.toggleRowSelection(row);
            });
            this.tableData4.forEach(row => {
              this.$refs.multipleTable4.toggleRowSelection(row);
            });
            this.tableData5.forEach(row => {
              this.$refs.multipleTable5.toggleRowSelection(row);
            });
            this.tableData6.forEach(row => {
              this.$refs.multipleTable6.toggleRowSelection(row);
            });
            this.$nextTick(() => {
              this.loading = false;
            });
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: "确定",
            callback: action => {
              this.loading = false;
              this.hideEditFalse();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: "确定",
          callback: action => {
            this.loading = false;
            this.hideEditFalse();
          }
        });
      }
    },
    checkboxInit(row, index) {
      if (row.isChecked) return 0;
      else return 1;
    }
  },
  computed: mapState(["checkInPay"])
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
}
.qxz {
  padding: 40px;
  margin-top: 25px;
  padding-top: 0;
}
.checkInPay {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1003;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>