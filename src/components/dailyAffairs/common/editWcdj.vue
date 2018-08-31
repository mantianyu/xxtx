<template>
	<div class="Editwcdj" v-show="oldOutEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>外出登记</h5>
					<span class="pop-close" @click="hideEditFalse">
						<i class="el-icon-close"></i>
					</span>
				</div>
			</el-header>
		<el-main style="height: 91%;position: relative;">
			<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
				<div class="qxz">
					<el-form :rules="rules" ref="form" :model="form" label-width="120px">
						<el-form-item label="老人姓名:" prop="name">
							<el-select v-bind:disabled="this.oldOutId != 0" filterable v-model="form.name" clearable placeholder="请选择老人">
								<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="外出登记人:" prop="entourage_name">
							<el-input disabled v-model="form.out_register_user_name"></el-input>
						</el-form-item>
						<el-form-item label="陪同人员类型:" prop="entourage_type">
							<el-select v-bind:disabled="old_out_flag" v-model="form.entourage_type" clearable placeholder="请选择" @change="entourage">
								<el-option v-for="(relate, key) in relation" :label="relate" :value="key * 1" :key="key"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-if="isEMP" label="选择护理人员:" prop="entourage_id">
							<el-select v-bind:disabled="old_out_flag" v-model="form.entourage_id" clearable placeholder="请选择">
								<el-option v-for="(emp, key) in emps" :label="emp.name" :value="emp.id" :key="key"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-if="!isEMP" label="陪同人员姓名:" prop="entourage_name">
							<el-input v-bind:disabled="old_out_flag" v-model="form.entourage_name"></el-input>
						</el-form-item>
						<el-form-item v-if="!isEMP" label="陪同人员电话:" prop="entourage_phone">
							<el-input v-bind:disabled="old_out_flag" v-model="form.entourage_phone" type="number"></el-input>
						</el-form-item>
						<el-form-item v-if="!isEMP" label="陪同人员身份证:" prop="entourage_id_number">
							<el-input v-bind:disabled="old_out_flag" v-model="form.entourage_id_number" @blur="discriCard(form.entourage_id_number)"></el-input>
						</el-form-item>
						<el-form-item v-if="!isEMP" label="陪同人员地址:" prop="entourage_address">
							<el-input v-bind:disabled="old_out_flag" v-model="form.entourage_address"></el-input>
						</el-form-item>
						<el-form-item label="外出时间:" prop="out_time">
							<el-date-picker v-bind:disabled="old_out_flag" type="datetime" placeholder="选择日期" v-model="form.out_time"></el-date-picker>
						</el-form-item>
						<el-form-item label="计划返回时间:" prop="plan_back_time">
							<el-date-picker v-bind:disabled="old_out_flag" type="datetime" placeholder="选择日期" v-model="form.plan_back_time"></el-date-picker>
						</el-form-item>
						<el-form-item label="外出原因:" prop="reason">
							<el-input v-bind:disabled="old_out_flag" type="textarea" v-model="form.reason"></el-input>
						</el-form-item>
						<el-form-item label="返回登记人:" v-if="oldOutEditFalse" prop="back_register_user_name">
							<el-input disabled v-model="form.back_register_user_name"></el-input>
						</el-form-item>
						<el-form-item label="实际返回时间:" v-if="oldOutEditFalse" prop="back_time">
							<el-date-picker v-bind:disabled="old_out_flag" type="datetime" placeholder="选择日期" v-model="form.back_time"></el-date-picker>
						</el-form-item>
						<div v-show="!old_out_flag" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
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
import ChinaIdChecker from "@/utils/chinaId";
import { mapState } from "vuex";

export default {
  props: ["oldOutId", "elders", "emps", "elderId"],
  data() {
    var validatePlanTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseChoicePlanTime));
      } else if (
        Date.parse(new Date(value)) < Date.parse(new Date(this.form.out_time))
      ) {
        callback(new Error(this.message.planTimeWarning));
      } else {
        callback();
      }
    };
    var validateBackTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseChoiceRealTime));
      } else if (
        Date.parse(new Date(value)) <= Date.parse(new Date(this.form.out_time))
      ) {
        callback(new Error(this.message.realTimeWarning));
      } else {
        callback();
      }
    };
    var phoneCheck = (rule, value, callback) => {
      if(value === ""){
        return callback(new Error(this.message.pleaseInputPhone));
      } else if (value < 0) {
         callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        out_register_user_name: localEvent.StorageGetter("empName"),
        entourage_type: "",
        entourage_id: "",
        entourage_name: "",
        entourage_phone: "",
        entourage_id_number: "",
        entourage_address: "",
        out_time: "" + new Date(),
        plan_back_time: "",
        reason: "",
        back_register_user_name: localEvent.StorageGetter("empName"),
        back_time: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: this.message.pleaseChoiceElderName,
            trigger: "change"
          }
        ],
        entourage_type: [
          {
            required: true,
            message: this.message.pleaseChoiceAscortType,
            trigger: "change"
          }
        ],
        out_time: [
          {
            required: true,
            message: this.message.pleaseChoiceOutTime,
            trigger: "change"
          }
        ],
        plan_back_time: [
          { required: true, validator: validatePlanTime, trigger: "change" }
        ],
        back_time: [
          { required: true, validator: validateBackTime, trigger: "change" }
        ],
        reason: [
          {
            required: true,
            message: this.message.pleaseInputOutReason,
            trigger: "blur"
          }
        ],
        entourage_phone: [{ required: true, validator: phoneCheck, trigger: "blur" }]
      },
      empId: localEvent.StorageGetter("empId"),
      out_register_user_id: 0,
      back_register_user_id: 0,
      relation: {
        "0": this.message.others,
        "1": this.message.relatives,
        "2": this.message.nurse
      },
      isEMP: false,
      loading: false,
      bLoading: false
    };
  },
  watch: {
    oldOutId() {
      if (this.oldOutId == 0) {
        this.form.entourage_id = "";
        this.form.entourage_name = "";
        this.form.entourage_phone = "";
        this.form.entourage_id_number = "";
      } else {
        this.fetchDetailOut(this.oldOutId);
      }
    },
    elderId() {
      if (this.elderId !== 0) {
        this.form.name = this.elderId;
      }
    }
  },
  methods: {
    entourage(val) {
      if (val == 2) {
        this.isEMP = true;
      } else {
        this.isEMP = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elder_id: this.form.name,
            entourage_id: this.form.entourage_id,
            out_register_user_id: this.empId,
            back_register_user_id: this.back_register_user_id,
            entourage_type: this.form.entourage_type * 1,
            entourage_name: this.form.entourage_name,
            entourage_phone: this.form.entourage_phone,
            entourage_id_number: this.form.entourage_id_number,
            entourage_address: this.form.entourage_address,
            out_time: Date.parse(new Date(this.form.out_time)) / 1000,
            plan_back_time:
              Date.parse(new Date(this.form.plan_back_time)) / 1000,
            reason: this.form.reason
          };
          this.saveEdit(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("oldOutEditFalse");
      this.$parent.clean();
      this.$refs["form"].resetFields();
    },
    saveEdit: async function(data) {
      let url = this.api.addoutregistrations;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
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
    fetchDetailOut: async function(oldOutId) {
      this.loading = true;
      let url = this.api.outregistrationsdetail;
      var data = {
        id: oldOutId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var detailOut = res.data.data;
          this.form.name = detailOut.elder_id;
          this.form.out_register_user_name = detailOut.out_register_user_name;
          this.out_register_user_id = detailOut.out_register_user_id;
          this.form.entourage_type = detailOut.entourage_type;
          if (detailOut.entourage_type == 2) {
            this.isEMP = true;
          } else {
            this.isEMP = false;
          }
          this.form.entourage_id = detailOut.entourage_id;
          this.form.entourage_name = detailOut.entourage_name;
          this.form.entourage_phone = detailOut.entourage_phone;
          this.form.entourage_id_number = detailOut.entourage_id_number;
          this.form.entourage_address = detailOut.entourage_address;
          this.form.out_time = new Date(detailOut.out_time * 1000);
          this.form.plan_back_time = new Date(detailOut.plan_back_time * 1000);
          this.form.reason = detailOut.reason;
          if (detailOut.back_register_user_id == 0) {
            this.form.back_register_user_name = localEvent.StorageGetter(
              "empName"
            );
          } else {
            this.back_register_user_id = detailOut.back_register_user_id;
            this.form.back_register_user_name =
              detailOut.back_register_user_name;
          }
          if (detailOut.back_time) {
            this.form.back_time = new Date(detailOut.back_time * 1000);
          }
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
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
    discriCard(UUserCard) {
      if (UUserCard === "") {
        return null;
      } else if (!ChinaIdChecker(UUserCard)) {
        this.$alert(this.message.IdWrong, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
        return null;
      }
    }
  },
  computed: mapState(["old_out_flag", "oldOutEdit", "oldOutEditFalse"])
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
.Editwcdj {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
