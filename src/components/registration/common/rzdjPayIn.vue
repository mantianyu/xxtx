<template>
	<div style="width: 1005px;">
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
            	<el-button type="info" size="medium" @click="back">上一步</el-button>
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
            </div>
		</el-form>
	</div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["elderDetail", "id", "checkin"],
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
          { required: true, message: this.message.pleaseInputRealCost, trigger: "blur" }
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
      bLoading: false
    };
  },
  watch: {
    elderDetail() {
      if (this.elderDetail.length == 0) {
        this.$parent.$parent.$parent.$parent.loadingFalse();
      } else {
        this.elderid = this.elderDetail.elderid;
        this.checkinId = this.elderDetail.checkinid;
        this.fetchDetail(this.elderDetail.checkinid);
      }
    },
    id() {
      if (this.id != 0) {
        this.elderid = this.id;
        this.checkinId = this.checkin;
        this.fetchDetail(this.checkin);
      }
    },
    "form.deposits"() {
      this.form.finaldues = (
        this.form.deposits * 1 +
        this.form.arrearages * 1 +
        this.form.imprests * 1 -
        this.form.remissions * 1
      ).toFixed(2);
    },
    "form.arrearages"() {
      this.form.finaldues = (
        this.form.deposits * 1 +
        this.form.arrearages * 1 +
        this.form.imprests * 1 -
        this.form.remissions * 1
      ).toFixed(2);
    },
    "form.imprests"() {
      this.form.finaldues = (
        this.form.deposits * 1 +
        this.form.arrearages * 1 +
        this.form.imprests * 1 -
        this.form.remissions * 1
      ).toFixed(2);
    },
    "form.remissions"() {
      this.form.finaldues = (
        this.form.deposits * 1 +
        this.form.arrearages * 1 +
        this.form.imprests * 1 -
        this.form.remissions * 1
      ).toFixed(2);
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elderid: this.elderid,
            checkinid: this.checkinId,
            finaldues: this.form.finaldues,
            checkintime: this.elderDetail.checkintime,
            employeeid: localEvent.StorageGetter("empId"),
            type: 1,
            remissions: this.form.remissions,
            arrearages: this.form.arrearages,
            deposits: this.form.deposits,
            imprests: this.form.imprests,
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
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.$parent.$parent.$parent.$parent.detailEmpty();
        this.$parent.$parent.$parent.$parent.hideEdit();
        this.$parent.$parent.$parent.$parent.$parent.ManageList();
        this.bLoading = false;
        this.$store.dispatch("rzdjEditFalse");
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
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
          (totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6).toFixed(2);
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
          (totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6).toFixed(2);
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
          (totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6).toFixed(2);
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
          (totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6).toFixed(2);
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
          (totalPrice1 + totalPrice2 + totalPrice3 + totalPrice4 + totalPrice6).toFixed(2);
      });
    },
    back() {
      this.$parent.$parent.$parent.$parent.showNewFoodBed();
    },
    fetchDetail: async function(id) {
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
          for (let i = 0; i < res.data.data.pricetype[2].length; i++) {
            this.tableData2.push(res.data.data.pricetype[2][i]);
          }
          this.tableData1 = [];
          this.tableData3 = [];
          this.tableData4 = [];
          this.tableData5 = [];
          this.tableData6 = [];
          this.tableData1 = res.data.data.pricetype[1];
          this.tableData3 = res.data.data.pricetype[3];
          this.tableData4 = res.data.data.pricetype[4];
          this.tableData5 = res.data.data.pricetype[5];
          this.tableData6 = res.data.data.pricetype[6];
          if (this.tableData2.length != 0) {
            this.$nextTick(function() {
              this.tableData2.forEach(row => {
                this.$refs.multipleTable2.toggleRowSelection(row);
              });
            });
          }
          this.$nextTick(() => {
            console.log(this.tableData1);
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
            this.$parent.$parent.$parent.$parent.loadingFalse();
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: "确定",
            callback: action => {
              this.$parent.$parent.$parent.$parent.loadingFalse();
              this.$parent.$parent.$parent.$parent.detailEmpty();
              this.$parent.$parent.$parent.$parent.hideEdit();
              this.$store.dispatch("rzdjEditFalse");
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: "确定",
          callback: action => {
            this.$parent.$parent.$parent.$parent.loadingFalse();
            this.$parent.$parent.$parent.$parent.detailEmpty();
            this.$parent.$parent.$parent.$parent.hideEdit();
            this.$store.dispatch("rzdjEditFalse");
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