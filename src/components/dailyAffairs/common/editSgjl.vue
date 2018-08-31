<template>
	<div class="Editwcdj" v-show="oldAccident">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>事故记录</h5>
					<span class="pop-close" @click="hideEditFalse">
						<i class="el-icon-close"></i>
					</span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="老人姓名:" prop="name">
									<el-select v-bind:disabled="this.oldAccidentId !== 0" filterable v-model="form.name" clearable placeholder="请选择老人" @change="changeElder" style="width: 200px;">
										<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="床位号:" prop="number">
									<el-input disabled v-model="form.number" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="发生时间:" prop="time">
									<el-date-picker v-bind:disabled="oldAccidentEdit" type="datetime" placeholder="选择日期" v-model="form.time" style="width: 200px;"></el-date-picker>
								</el-form-item>
								<el-form-item label="护工小组:" prop="nursingworker_name">
									<el-select v-bind:disabled="oldAccidentEdit" v-model="form.nursingworker_name" clearable placeholder="请选择小组" style="width: 200px;" @change="selectTeam">
										<el-option v-for="(team, key) in nursesTeam" :label="team.name" :value="team.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="事故类型:" prop="accident_type_id">
									<el-select v-bind:disabled="oldAccidentEdit" v-model="form.accident_type_id" clearable placeholder="请选择" @change="accidentChange" style="width: 200px;">
										<el-option v-for="(accident, key) in accidentList" :label="accident.name" :value="accident.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="事故等级:" prop="accidentlevel">
									<el-select disabled v-model="form.accidentlevel" clearable placeholder="请选择" style="width: 200px;">
										<el-option v-for="(accide, key) in accident" :label="accide" :value="key * 1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="负责人:" prop="person_responsible">
									<el-select v-bind:disabled="oldAccidentEdit" v-model="form.person_responsible" clearable placeholder="请选择负责人" style="width: 200px;">
										<el-option v-for="(nurs, key) in nurses" :label="nurs.name" :value="nurs.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<el-form-item label="事故原因:" prop="reason">
								<el-input v-bind:disabled="oldAccidentEdit" type="textarea" v-model="form.reason" style="width: 520px;"></el-input>
							</el-form-item>
							<el-form-item label="事故描述:" prop="introduction">
								<el-input v-bind:disabled="oldAccidentEdit" type="textarea" v-model="form.introduction" style="width: 520px;"></el-input>
							</el-form-item>
							<el-form-item label="图片:">
								<el-upload class="upload-demo" :action="this.api.uploadcareactivities" :with-credentials="true" :headers="{'Authorization': 'Bearer ' + token}" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList" v-bind:disabled="oldAccidentEdit" style="width: 520px;" list-type="picture">
									<el-button size="small" type="primary">点击上传</el-button>
									<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
								</el-upload>
							</el-form-item>
							<div v-show="!oldAccidentEdit" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
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
  props: ["oldAccidentId", "accident", "accidentList", "elders", "nursesTeam"],
  data() {
    var validateTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseInputTime));
      } else {
        if (Date.parse(new Date(value)) >= Date.parse(new Date())) {
          callback(new Error(this.message.timeWarning));
        }
        callback();
      }
    };
    return {
      form: {
        name: "",
        number: "",
        time: new Date(),
        nursingworker_name: "",
        accident_type_id: "",
        accidentlevel: "",
        person_responsible: "",
        reason: "",
        introduction: ""
      },
      rules: {
        name: [{ required: true, message: "请输入老人姓名", trigger: "change" }],
        time: [{ required: true, validator: validateTime, trigger: "blur" }],
        nursingworker_name: [
          { required: true, message: "请输入护工小组", trigger: "change" }
        ],
        accident_type_id: [
          { required: true, message: this.message.pleaseChoiceAccidentType, trigger: "change" }
        ],
        person_responsible: [
          { required: true, message: "请输入负责人", trigger: "change" }
        ],
        reason: [
          { required: true, message: this.message.pleaseInputAccidentReason, trigger: "blur" }
        ],
        introduction: [
          { required: true, message: this.message.pleaseInputAccidentDes, trigger: "blur" }
        ]
      },
      elder_id: 38,
      fileList: [],
      token: "",
      nursTeamId: 0,
      leaderId: 0,
      bedId: 0,
      loading: false,
      nurses: [],
      bLoading: false
    };
  },
  watch: {
    oldAccidentId() {
      if (this.oldAccidentId == 0) {
      } else {
        this.fetchDetailOut(this.oldAccidentId);
      }
    },
    accessToken(){
      this.token = this.accessToken;
    }
  },
  mounted(){
		this.token = this.accessToken;
  },
  methods: {
    handleSuccess(response, file, fileList) {
      var image = {
        name: file.name,
        url: response.data
      };
      this.fileList.push(image);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.oldAccidentId == 0) {
            var pics = [];
            for (let i = 0; i < this.fileList.length; i++) {
              var pic = {
                name: this.fileList[i].name,
                url: this.fileList[i].url
              };
              pics.push(pic);
            }
            var data = {
              elderid: this.form.name,
              typeid: this.form.accident_type_id,
              nursingworkerid: this.form.nursingworker_name,
              starttime: Date.parse(new Date(this.form.time)) / 1000,
              responsiblename: this.form.person_responsible,
              introduction: this.form.introduction,
              accidentreason: this.form.reason,
              number: this.bedId,
              accidentpics: pics
            };
            this.saveEdit(data);
          } else {
            var pics = [];
            for (let i = 0; i < this.fileList.length; i++) {
              var pic = {
                name: this.fileList[i].name,
                url: this.fileList[i].url
              };
              pics.push(pic);
            }
            var data = {
              typeid: this.form.accident_type_id,
              nursingworkerid: this.form.nursingworker_name,
              starttime: Date.parse(new Date(this.form.time)) / 1000,
              responsiblename: this.form.person_responsible,
              introduction: this.form.introduction,
              accidentreason: this.form.reason,
              number: this.bedId,
              accidentid: this.oldAccidentId,
              accidentpics: pics
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
      this.$store.dispatch("oldAccidentFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
      this.fileList = [];
    },
    accidentChange(val) {
      let accList = this.accidentList;
      for (let i = 0; i < accList.length; i++) {
        if (val == accList[i].id) {
          this.form.accidentlevel = accList[i].level;
        }
      }
    },
    saveEdit: async function(data) {
      let url = this.api.accident;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.oldAccidentId == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addSuccess,
              type: "success"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: this.message.changeSuccess,
              type: "success"
            });}
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
    fetchDetailOut: async function(oldAccidentId) {
      this.loading = true;
      let url = this.api.accidentinfo;
      var data = {
        accidentid: oldAccidentId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.elderid;
          this.form.number = res.data.data.bedname;
          this.form.time = res.data.data.accidenttime;
          this.form.nursingworker_name = res.data.data.group_id;
          this.form.accident_type_id = res.data.data.typeid;
          this.form.accidentlevel = res.data.data.accidentlevel;
          this.form.person_responsible = res.data.data.personresponsible;
          this.leaderId = res.data.data.personresponsible;
          this.form.reason = res.data.data.accidentreason;
          this.form.introduction = res.data.data.accidentintroduction;
          this.elder_id = res.data.data.elderid;
          this.fileList = res.data.data.accidentpics
            ? res.data.data.accidentpics
            : [];
          this.bedId = res.data.data.bednumber;
          this.$nextTick(() => {
            this.loading = false;
            this.selectTeams(res.data.data.group_id, 0);
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
    changeElder(val) {
      for (let i = 0; i < this.elders.length; i++) {
        if (this.elders[i].elder_id == val) {
          this.form.number = this.elders[i].bed_name;
          break;
        }
      }
    },
    selectTeam(val){
      this.selectTeams(val, 1);
    },
    selectTeams: async function(val, status){
      if(status === 1){
        this.form.person_responsible = '';
      }
      let url = this.api.getgroupnurses;
      let data = {
        group_id: val
      }
      const res = await this.$http.post(url, data);
      this.nurses = res.data.data;
    },
  },
  computed: mapState(["oldAccident", "oldAccidentEdit", "accessToken"])
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