<template>
	<div class="addGoHospital" v-show="addGoHospital">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>就医登记</h5>
					<span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="160px">
							<el-form-item label="老人姓名:" prop="elder_name">
								<el-select v-bind:disabled="addGoHospitalEdit" filterable v-model="form.elder_name" clearable placeholder="请选择老人">
									<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="就医时间:" prop="time">
								<el-date-picker v-bind:disabled="addGoHospitalEdit" type="date" placeholder="选择日期" v-model="form.time"></el-date-picker>
							</el-form-item>
							<el-form-item label="就医医师:" prop="doctor">
								<el-input v-bind:disabled="addGoHospitalEdit" v-model="form.doctor"></el-input>
							</el-form-item>
							<el-form-item label="就医医院:" prop="hospital">
								<el-input v-bind:disabled="addGoHospitalEdit" v-model="form.hospital"></el-input>
							</el-form-item>
							<el-form-item label="诊断结果:" prop="results">
								<el-input v-bind:disabled="addGoHospitalEdit" type="textarea" v-model="form.results"></el-input>
							</el-form-item>
							<el-form-item label="医嘱:" prop="doctors_advice">
								<el-input v-bind:disabled="addGoHospitalEdit" type="textarea" v-model="form.doctors_advice"></el-input>
							</el-form-item>
							<div v-if="!addGoHospitalEdit" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
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
  props: ["hospitalId", "elders"],
  data() {
    return {
      form: {
        elder_name: "",
        time: "" + new Date(),
        doctor: "",
        hospital: "",
        results: "",
        doctors_advice: ""
      },
      rules: {
        elder_name: [
          {
            required: true,
            message: this.message.pleaseInputElderName,
            trigger: "blur"
          }
        ],
        time: [
          {
            required: true,
            message: this.message.pleaseInputHospitalTime,
            trigger: "blur"
          }
        ]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    hospitalId() {
      if (this.hospitalId == 0) {
      } else {
        this.fetchDetail(this.hospitalId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.hospitalId == 0) {
            var data = {
              elder_id: this.form.elder_name,
              time: Date.parse(new Date(this.form.time)) / 1000,
              doctor: this.form.doctor,
              hospital: this.form.hospital,
              results: this.form.results,
              doctors_advice: this.form.doctors_advice
            };
            this.saveHospital(data);
          } else {
            var data = {
              id: this.hospitalId,
              elder_id: this.form.elder_name,
              time: Date.parse(new Date(this.form.time)) / 1000,
              doctor: this.form.doctor,
              hospital: this.form.hospital,
              results: this.form.results,
              doctors_advice: this.form.doctors_advice
            };
            this.saveHospital(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addGoHospitalFalse");
      this.$parent.clean();
      this.$refs["form"].resetFields();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.elderhealthhospitalizingdetail;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.elder_name = res.data.data.elder_id;
          this.form.time = res.data.data.time;
          this.form.doctor = res.data.data.doctor;
          this.form.hospital = res.data.data.hospital;
          this.form.results = res.data.data.results;
          this.form.doctors_advice = res.data.data.doctors_advice;
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
    saveHospital: async function(data) {
      let url = this.api.addelderhealthhospitalizings;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.hospitalId == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addGoHospitalSuccess,
              type: "success"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: this.message.changeGoHospitalSuccess,
              type: "success"
            });
          }
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
    }
  },
  computed: mapState(["addGoHospital", "addGoHospitalEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 576px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -288px;
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
.addGoHospital {
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