<template>
	<div class="Edittslf" v-show="checkout">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>退住登记</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px">
							<el-form-item label="老人姓名:" prop="elder_name">
								<el-input disabled v-model="form.elder_name"></el-input>
							</el-form-item>
							<el-form-item label="身份证号:" prop="id_number">
								<el-input disabled v-model="form.id_number"></el-input>
							</el-form-item>
							<el-form-item label="出院登记人:" prop="employee_name">
								<el-input disabled v-model="form.employee_name"></el-input>
							</el-form-item>
							<el-form-item label="登记日期:" prop="check_out_register_date">
								<el-date-picker :disabled="isEdit" type="datetime" placeholder="选择日期" v-model="form.check_out_register_date"></el-date-picker>
							</el-form-item>
							<el-form-item label="出院形式:" prop="type">
								<el-select :disabled="isEdit" v-model="form.type" clearable placeholder="请选择">
									<el-option v-for="(check, key) in checkOut" :label="check" :value="key * 1" :key="key"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="对老人评价:" style="display: flex;align-items: center;" prop="eilder_rate">
								<div style="margin-left: -120px">
									<el-rate
										v-model="form.eilder_rate"
										:disabled="isEdit"
										:colors="['#99A9BF', '#F7BA2A', '#FF9900']">
									</el-rate>
								</div>
							</el-form-item>
							<el-form-item label="出院原因:" prop="reason">
								<el-input :disabled="isEdit" type="textarea" v-model="form.reason"></el-input>
							</el-form-item>
							<div v-if="!isEdit" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
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
  props: ["oldCheckOutId", "checkOut", "isEdit"],
  data() {
    return {
      form: {
        elder_name: "",
        id_number: "",
        check_out_date: "",
        employee_name: localEvent.StorageGetter("empName"),
        check_out_register_date: "",
        type: "",
        reason: "",
        eilder_rate: 0
      },
      rules: {
        type: [
          { required: true, message: this.message.pleaseChoiceLeaveForm, trigger: "change" }
        ],
        employee_name: [
          { required: true, message: this.message.pleaseInputRegister, trigger: "blur" }
        ],
        check_out_register_date: [
          { required: true, message: this.message.pleaseChoiceRegisterTime, trigger: "change" }
        ]
      },
      empId: localEvent.StorageGetter("empId"),
      check_in_id: 0,
      loading: false,
      bLoading: false
    };
  },
  watch: {
    oldCheckOutId() {
      if (this.oldCheckOutId != 0) {
        this.fetchDetailCheckOut(this.oldCheckOutId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            check_in_id: this.check_in_id,
            check_out_id: this.oldCheckOutId,
            check_out_date:
              Date.parse(new Date(this.form.check_out_register_date)) / 1000,
            elder_score: this.form.eilder_rate,
            type: this.form.type * 1,
            check_employee_id: this.empId,
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
      this.$store.dispatch("oldCheckOutFalse");
      this.$parent.clean();
      this.$refs["form"].resetFields();
    },
    saveEdit: async function(data) {
      let url = this.api.eldercheckoutstore;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.fetchList(1);
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
    fetchDetailCheckOut: async function(Id) {
      this.loading = true;
      let url = this.api.eldercheckoutdetail;
      var data = {
        check_out_id: Id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var detailVisit = res.data.data;
          this.form.elder_name = detailVisit.old_name;
          this.form.id_number = detailVisit.id_number;
          this.check_in_id = detailVisit.check_in_id;
          if (detailVisit.check_employee_id == "") {
            this.form.employee_name = localEvent.StorageGetter("empName");
          } else {
            this.form.employee_name = detailVisit.check_employee_id;
          }
          this.form.check_out_register_date = detailVisit.check_out_time;
          this.form.type = detailVisit.type;
          this.form.reason = detailVisit.reason;
          this.form.eilder_rate = detailVisit.elder_score;
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
    }
  },
  computed: mapState(["checkout"])
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
.Edittslf {
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