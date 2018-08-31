<template>
	<div>
		<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
		   	<!-- <el-form-item label="评估编号:" prop="number">
		    	<el-input v-model="form.number"></el-input>
		  	</el-form-item> -->
		  	<el-form-item label="评估基准日期:" prop="time">
		      	<el-date-picker type="datetime" placeholder="选择日期" v-model="form.time"></el-date-picker>
		  	</el-form-item>
		   	<el-form-item label="评估原因:" prop="reason">
		    	<el-input v-model="form.reason"></el-input>
		  	</el-form-item>
		   	<el-form-item label="老人姓名:" prop="name">
		    	<el-select v-model="form.name" clearable placeholder="请选择老人" filterable v-bind:disabled="elderDetail.length != 0" @change="selectElder">
			      	<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="身份证号:" prop="id_number">
		    	<el-input v-model="form.id_number" @blur="discriCard(form.id_number)"></el-input>
		  	</el-form-item>
		   	<el-form-item label="性别:" prop="gender">
		    	<el-select v-model="form.gender" clearable placeholder="请选择性别">
			      	<el-option label="男" :value="int1"></el-option>
			      	<el-option label="女" :value="int2"></el-option>
			    </el-select>
		  	</el-form-item>
		  	<el-form-item label="出生日期:" prop="birthday">
		      	<el-date-picker type="date" placeholder="选择日期" v-model="form.birthday"></el-date-picker>
		  	</el-form-item>
		   	<el-form-item label="社保卡号:" prop="medicare_card">
		    	<el-input type="number" v-model="form.medicare_card"></el-input>
		  	</el-form-item>
		   	<el-form-item label="民族:" prop="nationality">
		    	<el-select v-model="form.nationality" clearable placeholder="请选择民族">
			      	<el-option v-for="(nation, key) in national" :label="nation" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="文化程度:" prop="education">
		    	<el-select v-model="form.education" clearable placeholder="请选择文化程度">
			      	<el-option v-for="(educate, key) in education" :label="educate" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="宗教信仰:" prop="religion">
		    	<el-select v-model="form.religion" clearable placeholder="请选择宗教信仰">
			      	<el-option v-for="(relige, key) in religion" :label="relige" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="婚姻状况:" prop="marital_status">
		    	<el-select v-model="form.marital_status" clearable placeholder="请选择婚姻状况">
			      	<el-option v-for="(marite, key) in marital" :label="marite" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="居住情况:" prop="living_status">
		    	<el-select v-model="form.living_status" clearable placeholder="请选择居住情况">
			      	<el-option v-for="(live, key) in living" :label="live" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="医疗保障:" prop="medical_security">
		    	<el-select v-model="form.medical_security" clearable placeholder="请选择医疗保障">
			      	<el-option v-for="(medice, key) in medical" :label="medice" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="经济来源:" prop="income_source">
		    	<el-select v-model="form.income_source" clearable placeholder="请选择经济来源">
			      	<el-option v-for="(inco, key) in income" :label="inco" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="信息提供者姓名:" prop="provider_name">
		    	<el-input v-model="form.provider_name"></el-input>
		  	</el-form-item>
		   	<el-form-item label="与老人关系:" prop="provider_relation">
		    	<el-select v-model="form.provider_relation" clearable placeholder="请选择经济来源">
			      	<el-option v-for="(relate, key) in relation" :label="relate" :value="key * 1" :key="key"></el-option>
			    </el-select>
		  	</el-form-item>
		   	<el-form-item label="联系人姓名:" prop="contact_name">
		    	<el-input v-model="form.contact_name"></el-input>
		  	</el-form-item>
		   	<el-form-item label="联系人电话:" prop="contact_phone">
		    	<el-input v-model="form.contact_phone" type="number"></el-input>
		  	</el-form-item>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;" v-if="!main">
            	<el-button type="info" size="medium" @click="hideEdit">取消</el-button>
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">下一步</el-button>
            </div>
		</el-form>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: [
    "national",
    "education",
    "religion",
    "marital",
    "living",
    "medical",
    "income",
    "relation",
    "elderDetail",
    "elders",
    "listId",
    "main"
  ],
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
        number: "",
        reason: "",
        name: "",
        id_number: "",
        gender: "",
        birthday: "",
        medicare_card: "",
        nationality: "",
        education: "",
        religion: "",
        marital_status: "",
        living_status: "",
        medical_security: "",
        income_source: "",
        provider_name: "",
        provider_relation: "",
        contact_name: "",
        contact_phone: "",
        time: new Date()
      },
      rules: {
        name: [
          { required: true, message: this.message.pleaseChoiceElderName, trigger: "change" }
        ],
        number: [
          { required: true, message: this.message.pleaseInputAssessNumber, trigger: "blur" }
        ],
        time: [
          { required: true, message: this.message.pleaseInputAssessTime, trigger: "change" }
        ],
        birthday: [
          { required: true, message: this.message.pleaseInputBornDate, trigger: "change" }
        ],
        gender: [{ required: true, message: this.message.pleaseChoiceSex, trigger: "change" }],
        nationality: [
          { required: true, message: this.message.pleaseChoiceNation, trigger: "change" }
        ],
        religion: [
          { required: true, message: this.message.pleaseChoiceReligiom, trigger: "change" }
        ],
        living_status: [
          { required: true, message: this.message.pleaseChoiceLiveStatus, trigger: "change" }
        ],
        medical_security: [
          { required: true, message: this.message.pleaseChoiceMedicare, trigger: "change" }
        ],
        income_source: [
          { required: true, message: this.message.pleaseChoiceEcoSource, trigger: "change" }
        ],
        contact_phone: [ { required: true, validator: phoneCheck, trigger: "blur" } ]
      },
      int1: 1,
      int2: 2,
      bLoading: false
    };
  },
  watch: {
    listId() {
      if (this.listId == 0) {
        this.form.number = "";
        this.form.reason = "";
        this.form.name = "";
        this.form.id_number = "";
        this.form.gender = "";
        this.form.birthday = "";
        this.form.medicare_card = "";
        this.form.nationality = "";
        this.form.education = "";
        this.form.religion = "";
        this.form.marital_status = "";
        this.form.living_status = "";
        this.form.medical_security = "";
        this.form.income_source = "";
        this.form.provider_name = "";
        this.form.provider_relation = "";
        this.form.contact_name = "";
        this.form.contact_phone = "";
        this.form.time = new Date();
      } else {
        this.form.number = this.elderDetail.number;
        this.form.reason = this.elderDetail.reason;
        this.form.name = this.elderDetail.elder_id;
        this.form.id_number = this.elderDetail.id_number;
        this.form.gender = this.elderDetail.gender;
        this.form.birthday = this.elderDetail.birthday;
        this.form.medicare_card = this.elderDetail.medicare_card;
        this.form.nationality = this.elderDetail.nationality;
        this.form.education = this.elderDetail.education;
        this.form.religion = this.elderDetail.religion;
        this.form.marital_status = this.elderDetail.marital_status;
        this.form.living_status = this.elderDetail.living_status;
        this.form.medical_security = this.elderDetail.medical_security;
        this.form.income_source = this.elderDetail.income_source;
        this.form.provider_name = this.elderDetail.provider_name;
        this.form.provider_relation = this.elderDetail.provider_relation;
        this.form.contact_name = this.elderDetail.contact_name;
        this.form.contact_phone = this.elderDetail.contact_phone;
        this.form.time = this.elderDetail.time;
      }
    },
    elderDetail() {
      if (this.elderDetail == 0) {
        this.form.number = "";
        this.form.reason = "";
        this.form.name = "";
        this.form.id_number = "";
        this.form.gender = "";
        this.form.birthday = "";
        this.form.medicare_card = "";
        this.form.nationality = "";
        this.form.education = "";
        this.form.religion = "";
        this.form.marital_status = "";
        this.form.living_status = "";
        this.form.medical_security = "";
        this.form.income_source = "";
        this.form.provider_name = "";
        this.form.provider_relation = "";
        this.form.contact_name = "";
        this.form.contact_phone = "";
        this.form.time = new Date();
      } else {
        this.form.number = this.elderDetail.number;
        this.form.reason = this.elderDetail.reason;
        this.form.name = this.elderDetail.elder_id;
        this.form.id_number = this.elderDetail.id_number;
        this.form.gender = this.elderDetail.gender;
        this.form.birthday = this.elderDetail.birthday;
        this.form.medicare_card = this.elderDetail.medicare_card;
        this.form.nationality = this.elderDetail.nationality;
        this.form.education = this.elderDetail.education;
        this.form.religion = this.elderDetail.religion;
        this.form.marital_status = this.elderDetail.marital_status;
        this.form.living_status = this.elderDetail.living_status;
        this.form.medical_security = this.elderDetail.medical_security;
        this.form.income_source = this.elderDetail.income_source;
        this.form.provider_name = this.elderDetail.provider_name;
        this.form.provider_relation = this.elderDetail.provider_relation;
        this.form.contact_name = this.elderDetail.contact_name;
        this.form.contact_phone = this.elderDetail.contact_phone;
        this.form.time = this.elderDetail.time;
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.listId == 0) {
            var data = {
              elder_id: this.form.name,
              number: this.form.number,
              reason: this.form.reason,
              id_number: this.form.id_number,
              gender: this.form.gender,
              birthday:
                new Date(this.form.birthday).getFullYear() +
                "-" +
                (new Date(this.form.birthday).getMonth() + 1) +
                "-" +
                new Date(this.form.birthday).getDate(),
              medicare_card: this.form.medicare_card,
              nationality: this.form.nationality,
              education: this.form.education,
              religion: this.form.religion,
              marital_status: this.form.marital_status,
              living_status: this.form.living_status,
              medical_security: this.form.medical_security,
              income_source: this.form.income_source,
              provider_name: this.form.provider_name,
              provider_relation: this.form.provider_relation,
              contact_name: this.form.contact_name,
              contact_phone: this.form.contact_phone,
              time: Date.parse(new Date(this.form.time)) / 1000
            };
            this.saveinfo(data);
          } else {
            var data = {
              id: this.listId,
              elder_id: this.form.name,
              number: this.form.number,
              reason: this.form.reason,
              id_number: this.form.id_number,
              gender: this.form.gender,
              birthday:
                new Date(this.form.birthday).getFullYear() +
                "-" +
                (new Date(this.form.birthday).getMonth() + 1) +
                "-" +
                new Date(this.form.birthday).getDate(),
              medicare_card: this.form.medicare_card,
              nationality: this.form.nationality,
              education: this.form.education,
              religion: this.form.religion,
              marital_status: this.form.marital_status,
              living_status: this.form.living_status,
              medical_security: this.form.medical_security,
              income_source: this.form.income_source,
              provider_name: this.form.provider_name,
              provider_relation: this.form.provider_relation,
              contact_name: this.form.contact_name,
              contact_phone: this.form.contact_phone,
              time: Date.parse(new Date(this.form.time)) / 1000
            };
            this.saveinfo(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEdit() {
      this.$parent.$parent.$parent.$parent.detailEmpty();
      this.$store.dispatch("abilityEditFalse");
      this.$refs["form"].resetFields();
    },
    saveinfo: async function(data) {
      let url = this.api.addelderinfo;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.bLoading = false;
          this.$parent.$parent.$parent.$parent.showNewAbility();
          this.$parent.$parent.$parent.$parent.getElderId(this.form.name, res.data.data);
          this.$parent.$parent.$parent.$parent.$parent.fetchList(1);
        } else {
          var that = this;
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
    selectElder: async function(val) {
      let url = this.api.detailelders;
      var data = {
        id: val
      };
      const res = await this.$http.post(url, data);
      this.form.id_number = res.data.data.id_number;
      this.form.gender = res.data.data.gender;
      this.form.birthday = res.data.data.birthday;
      this.form.medicare_card = res.data.data.medicare_card;
      this.form.nationality = res.data.data.nationality;
      this.form.education = res.data.data.education;
      this.form.religion = res.data.data.religion;
      this.form.marital_status = res.data.data.marital_status;
      this.form.living_status = res.data.data.living_status;
      this.form.medical_security = res.data.data.medical_security;
      this.form.income_source = res.data.data.income_source;
    },
    discriCard(UUserCard) {
      var pat = /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/;
      if (UUserCard === "") {
        return null;
      } else if (!pat.test(UUserCard)) {
        this.$alert(this.message.IdWrong, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
        return null;
      }
      UUserCard.substring(6, 10) +
        "-" +
        UUserCard.substring(10, 12) +
        "-" +
        UUserCard.substring(12, 14);
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        this.form.gender = 1;
      } else {
        this.form.gender = 2;
      }
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (
        UUserCard.substring(10, 12) < month ||
        (UUserCard.substring(10, 12) == month &&
          UUserCard.substring(12, 14) <= day)
      ) {
        age++;
      }
      this.form.birthday =
        UUserCard.substring(6, 10) +
        "-" +
        UUserCard.substring(10, 12) +
        "-" +
        UUserCard.substring(12, 14);
    }
  }
};
</script>