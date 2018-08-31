<template>
	<div>
		<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	      <div style="display: flex;flex-wrap: wrap;">
	        <el-form-item label="视力:" prop="vision">
	          <el-select v-model="form.vision" clearable placeholder="请选择" style="width: 200px;">
	            <el-option v-for="(vision, key) in vision" :label="vision" :value="key * 1" :key="key"></el-option>
	          </el-select>
	        </el-form-item>
	        <el-form-item label="听力:" prop="hearing">
	          <el-select v-model="form.hearing" clearable placeholder="请选择" style="width: 200px;">
	            <el-option v-for="(hearing, key) in hearing" :label="hearing" :value="key * 1" :key="key"></el-option>
	          </el-select>
	        </el-form-item>
	          <el-form-item label="主治医院:" prop="major_hospital">
	            <el-input v-model="form.major_hospital" style="width: 200px;"></el-input>
	          </el-form-item>
	          <el-form-item label="主治医生:" prop="major_doctor">
	            <el-input v-model="form.major_doctor" style="width: 200px;"></el-input>
	          </el-form-item>
	          <el-form-item label="医院电话:" prop="hospital_phone">
	            <el-input v-model="form.hospital_phone" type="number" style="width: 200px;"></el-input>
	          </el-form-item>
	          <el-form-item label="过敏药物:" prop="allergy_medicines">
	            <el-input v-model="form.allergy_medicines" style="width: 200px;"></el-input>
	          </el-form-item>
	        </div>
          	<el-form-item label="病史:" prop="medical_history">
	            <el-input v-model="form.medical_history" type="textarea" style="width: 840px;"></el-input>
          	</el-form-item>
          	<!-- <el-form-item label="添加疾病:">
          	</el-form-item> -->
          	<el-form-item label="主要疾病:" prop="major_diseases">
	            <el-checkbox-group v-model="form.major_diseases">
                <el-checkbox v-for="(disease, key) in disease" :key="key" :label="key * 1" name="type">{{ disease }}</el-checkbox>
                <el-button type="danger" size="mini" @click="showZD" style="margin-left: 20px;">添加</el-button>
              </el-checkbox-group>
            </el-form-item>
	      	<div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	      		<el-button type="info" size="medium" @click="back">上一步</el-button>
	          	<el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">下一步</el-button>
	      	</div>
		</el-form>
    <v-addsjzd :name="name" :id="disId" :groupId="groupId"></v-addsjzd>
	</div>
</template>

<script>
import vAddsjzd from '../../system/addSJZD.vue';

export default {
  props: ["elderDetail", "id", "checkin", "noHealth"],
  data() {
    return {
      form: {
        vision: "",
        hearing: "",
        major_hospital: "",
        major_doctor: "",
        hospital_phone: "",
        allergy_medicines: "",
        medical_history: "",
        major_diseases: []
      },
      rules: {},
      vision: [],
      hearing: [],
      disease: [],
      elderid: 0,
      checkinId: 0,
      bLoading: false,
      name: '',
      disId: 0,
      groupId: 0
    };
  },
  components:{
    vAddsjzd
  },
  watch: {
    elderDetail() {
      if (this.elderDetail.length == 0) {
        this.$parent.$parent.$parent.$parent.loadingFalse();
      } else {
        if (this.noHealth) {
          this.elderid = this.elderDetail.elder_id;
          this.checkinId = this.elderDetail.checkinid;
          this.fetchDetail(this.elderDetail.elder_id);
        } else {
          this.elderid = this.elderDetail.elderid;
          this.checkinId = this.elderDetail.checkinid;
          this.fetchDetail(this.elderDetail.elderid);
        }
      }
    },
    id() {
      if (this.id != 0) {
        this.elderid = this.id;
        this.checkinId = this.checkin;
        this.fetchDetail(this.id);
      }
    }
  },
  mounted() {
    this.fetchVision();
    this.groupId = this.data.HEALTH_DISEASES;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elderid: this.elderid,
            visus: this.form.vision,
            audition: this.form.hearing,
            hospital: this.form.major_hospital,
            physician: this.form.major_doctor,
            hospitalphone: this.form.hospital_phone,
            anaphylaxis: this.form.allergy_medicines,
            medicalhistory: this.form.medical_history,
            diseases: this.form.major_diseases
          };
          this.saveHealth(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchDetail: async function(id) {
      let url = this.api.elderhealthinfo;
      var data = {
        ehid: id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.form.vision = res.data.data.vision;
        this.form.hearing = res.data.data.hearing;
        this.form.major_hospital = res.data.data.major_hospital;
        this.form.major_doctor = res.data.data.major_doctor;
        this.form.hospital_phone = res.data.data.hospital_phone;
        this.form.allergy_medicines = res.data.data.allergy_medicines;
        this.form.medical_history = res.data.data.medical_history;
        this.form.major_diseases = res.data.data.major_diseases;
        this.$nextTick(() => {
          this.$parent.$parent.$parent.$parent.loadingFalse();
        });
      } else {
        this.$parent.$parent.$parent.$parent.loadingFalse();
      }
    },
    saveHealth: async function(data) {
      let url = this.api.addelderhealth;
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        if (this.noHealth) {
          this.bLoading = false;
          this.$parent.$parent.$parent.$parent.showNewTijian();
          this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.JkpgManageList(
            1
          );
        } else {
          this.bLoading = false;
          this.$parent.$parent.$parent.$parent.showNewNurse();
        }
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    back() {
      if (this.noHealth) {
        this.$parent.$parent.$parent.$parent.showNewInfo();
      } else {
        this.$parent.$parent.$parent.$parent.showNewRelation();
      }
    },
    fetchVision: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.HEALTH_VISION,
          this.data.HEALTH_HEARING,
          this.data.HEALTH_DISEASES
        ]
      };
      const res = await this.$http.post(url, data);
      this.vision = res.data.data[this.data.HEALTH_VISION];
      this.hearing = res.data.data[this.data.HEALTH_HEARING];
      this.disease = res.data.data[this.data.HEALTH_DISEASES];
    },
    showZD(){
      this.$store.dispatch('addSJZDTrue');
    },
		clean() {
			this.name = '';
			this.disId = 0;
    },
    getDisId(id){
      this.form.major_diseases.push(id);
    }
  }
};
</script>
