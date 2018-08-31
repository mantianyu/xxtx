<template>
	<div class="Edittslf" v-show="oldVisitEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>探视来访</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px">
							<el-form-item label="来访人姓名:" prop="visitor">
								<el-input v-model="form.visitor"></el-input>
							</el-form-item>
							<el-form-item label="老人姓名:" prop="elder_name">
								<el-select v-model="form.elder_name" filterable clearable placeholder="请选择老人">
									<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="联系电话:" prop="visitor_phone">
								<el-input v-model="form.visitor_phone" type="number"></el-input>
							</el-form-item>
							<el-form-item label="与老人关系:" prop="relation">
								<el-select v-model="form.relation" clearable placeholder="请选择">
									<el-option v-for="(relate, key) in relation" :label="relate" :value="key * 1" :key="key"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="来访时间:" prop="visit_time">
								<el-date-picker type="datetime" placeholder="选择日期" v-model="form.visit_time"></el-date-picker>
							</el-form-item>
							<el-form-item label="登记人:" prop="employee_name">
								<el-input disabled v-model="form.employee_name"></el-input>
							</el-form-item>
							<el-form-item label="来访缘由:" prop="reason">
								<el-input type="textarea" v-model="form.reason"></el-input>
							</el-form-item>
							<el-form-item label="备注:" prop="remarks">
								<el-input type="textarea" v-model="form.remarks"></el-input>
							</el-form-item>
							<el-form-item label="离开时间:" v-if="oldVisitEditFalse" prop="leave_time">
								<el-date-picker type="datetime" placeholder="选择日期" v-model="form.leave_time"></el-date-picker>
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
  props: ["oldVisitId", "relation", "elders"],
  data() {
    let phoneCheck = (rule, value, callback) => {
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
        visitor: "",
        elder_name: "",
        visitor_phone: "",
        relation: "",
        visit_time: "" + new Date(),
        employee_name: localEvent.StorageGetter("empName"),
        reason: "",
        remarks: "",
        leave_time: ""
      },
      rules: {
        visitor: [
          { required: true, message: this.message.pleaseInputVisitor, trigger: "blur" }
        ],
        elder_name: [
          { required: true, message: this.message.pleaseChoiceElderName, trigger: "change" }
        ],
        visitor_phone: [
          { required: true, validator: phoneCheck, trigger: "blur" }
        ],
        relation: [
          { required: true, message: this.message.pleaseChoiceOldRelation, trigger: "change" }
        ],
        visit_time: [
          { required: true, message: this.message.pleaseChoiceVisitTime, trigger: "change" }
        ],
        employee_name: [
          { required: true, message: this.message.pleaseInputRegister, trigger: "blur" }
        ],
        reason: [
          { required: true, message: this.message.pleaseInputVisitReason, trigger: "blur" }
        ],
      },
      empId: localEvent.StorageGetter("empId"),
      elder_id: 0,
      loading: false,
      bLoading: false
    };
  },
  watch: {
    oldVisitId() {
      if (this.oldVisitId == 0) {
      } else {
        this.fetchDetailVisit(this.oldVisitId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.oldVisitId == 0) {
            var data = {
              elder_id: this.form.elder_name,
              visitor: this.form.visitor,
              visitor_phone: this.form.visitor_phone,
              relation: this.form.relation * 1,
              visit_time: Date.parse(new Date(this.form.visit_time)) / 1000,
              employee_id: localEvent.StorageGetter("empId"),
              reason: this.form.reason,
              remarks: this.form.remarks
            };
            this.saveEdit(data);
          } else {
            if (this.form.leave_time == "") {
              var data = {
                elder_id: this.elder_id,
                visitor: this.form.visitor,
                visitor_phone: this.form.visitor_phone,
                relation: this.form.relation * 1,
                visit_time: Date.parse(new Date(this.form.visit_time)) / 1000,
                reason: this.form.reason,
                remarks: this.form.remarks,
                employee_id: this.empId,
                id: this.oldVisitId
              };
              this.saveEdit(data);
            } else {
              var data = {
                elder_id: this.elder_id,
                visitor: this.form.visitor,
                visitor_phone: this.form.visitor_phone,
                relation: this.form.relation * 1,
                visit_time: Date.parse(new Date(this.form.visit_time)) / 1000,
                reason: this.form.reason,
                remarks: this.form.remarks,
                leave_time: Date.parse(new Date(this.form.leave_time)) / 1000,
                employee_id: this.empId,
                id: this.oldVisitId
              };
              this.saveEdit(data);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("oldVisitEditFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    saveEdit: async function(data) {
      let url = this.api.addvisits;
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
    fetchDetailVisit: async function(oldVisitId) {
      this.loading = true;
      let url = this.api.visitsdetail;
      var data = {
        id: oldVisitId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var detailVisit = res.data.data;
          this.form.visitor = res.data.data.visitor;
          this.elder_id = res.data.data.elder_id;
          this.form.elder_name = res.data.data.elder_name;
          this.form.visitor_phone = res.data.data.visitor_phone;
          this.form.relation = res.data.data.relation;
          this.form.visit_time = new Date(res.data.data.visit_time);
          this.form.employee_name = res.data.data.employee_name;
          this.empId = res.data.data.employee_id;
          this.form.reason = res.data.data.reason;
          this.form.remarks = res.data.data.remarks;
          this.form.leave_time = res.data.data.leave_time
            ? new Date(res.data.data.leave_time)
            : "";
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
  computed: mapState(["oldVisitEdit", "oldVisitEditFalse"])
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