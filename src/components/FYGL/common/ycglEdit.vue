<template>
  <div class="ycglEdit" v-show="ycglEdit">
		<el-container class="pop">
			<el-header style="height: auto;">
          <div class="pop-top">
              <h5>预存/交费</h5>
              <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
          </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-form :rules="rules" ref="form" :model="form" label-width="120px">
              <el-form-item label="老人姓名:" prop="check_in_id">
                <el-select v-bind:disabled="Number.isInteger(checkin_id)" v-model="form.check_in_id" clearable placeholder="请选择老人" @change="changeElder">
                    <el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.checkin_id" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账户余额:" prop="balance">
                <el-input disabled v-model="form.balance"></el-input>
              </el-form-item>
              <el-form-item label="预存时间:" prop="time">
                  <el-date-picker disabled type="datetime" placeholder="选择日期" v-model="form.time"></el-date-picker>
              </el-form-item>
              <el-form-item label="预存金额:" prop="amount">
                <el-input v-model="form.amount" type="number"></el-input>
              </el-form-item>
              <el-form-item label="交费方式:" prop="method">
                <el-select v-model="form.method" clearable placeholder="请选择交费方式">
                    <el-option v-for="(method, key) in methods" :label="method" :value="key * 1" :key="key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="交费人:" prop="payer">
                <el-input v-model="form.payer"></el-input>
              </el-form-item>
              <el-form-item label="收费员:" prop="employee_name">
                <el-input disabled v-model="form.employee_name"></el-input>
              </el-form-item>
              <el-form-item label="备注:" prop="remarks">
                <el-input type="textarea" v-model="form.remarks"></el-input>
              </el-form-item>
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
  props: ["elders", "methods", "checkin_id"],
  data() {
    var amount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.message.pleaseInputPayment));
      } else {
        if (value < 0) {
          callback(new Error(this.message.payMonyMoreZero));
        }
        callback();
      }
    };
    return {
      form: {
        check_in_id: "",
        balance: "",
        time: new Date(),
        amount: "",
        method: "",
        payer: "",
        employee_name: localEvent.StorageGetter("empName"),
        remarks: ""
      },
      rules: {
        check_in_id: [
          {
            required: true,
            message: this.message.pleaseChoiceElder,
            trigger: "change"
          }
        ],
        amount: [
          { required: true, validator: amount, trigger: "blur" }
        ],
        method: [
          {
            required: true,
            message: this.message.pleaseChoicePayWay,
            trigger: "change"
          }
        ]
      },
      bLoading: false
    };
  },
  watch: {
    ycglEdit() {
      this.form.check_in_id = "";
      this.form.balance = "";
      this.form.time = new Date();
      this.form.amount = "";
      this.form.method = "";
      this.form.payer = "";
      this.form.employee_name = localEvent.StorageGetter("empName");
      this.form.remarks = "";
    }
  },
  mounted() {
    if (this.checkin_id) {
      this.form.check_in_id = this.checkin_id;
      this.changeElder(this.checkin_id);
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            check_in_id: this.form.check_in_id,
            balance: this.form.balance,
            amount: this.form.amount,
            method: this.form.method,
            payer: this.form.payer,
            employee_id: localEvent.StorageGetter("empId"),
            remarks: this.form.remarks
          };
          this.saveEdit(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("YcglEditClose");
      this.$refs["form"].resetFields();
    },
    saveEdit: async function(data) {
      let url = this.api.addimprestrecord;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
            title: this.message.success,
            message: this.message.addPrestoreSuccess,
            type: "success"
          });
          if (Number.isInteger(this.checkin_id)) {
            this.$parent.fetchJFJL(1);
            this.$parent.fetchFYLS(1);
            this.$parent.$parent.$parent.$parent.$parent.$parent.fetchList(1);
          } else {
            this.$parent.fetchList(1);
            this.$parent.fetchElders();
          }
          this.bLoading = false;
          this.hideEditFalse();
        } else if(res.data.status_code == 5) {
          this.$alert("保存失败！", "", {
            confirmButtonText: "确定",
            callback: action => {
              this.bLoading = false;
            }
          });
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
          this.form.balance = this.elders[i].imprests;
          break;
        }
      }
    }
  },
  computed: mapState(["ycglEdit"])
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
  overflow-y: auto;
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
.ycglEdit {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>