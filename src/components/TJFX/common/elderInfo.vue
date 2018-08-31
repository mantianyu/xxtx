<template>
    <div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">基础信息</p>
                <el-button v-if="!editInfo" type="danger" size="small" style="margin-right: 60px;" @click="editElderInfo">编辑</el-button>
                <el-button v-if="editInfo" type="danger" size="small" style="margin-right: 60px;" @click="submitForm('form')">保存</el-button>
            </div>
            <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
                <div style="display: flex;justify-content: flex-start;">
                    <div style="display: flex;flex-wrap: wrap;width: 650px;">
                        <el-form-item label="姓名:" prop="name">
                            <el-input v-bind:disabled="!editInfo" v-model="form.name" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号:" prop="id_number">
                            <el-input v-bind:disabled="!editInfo" v-model="form.id_number" style="width: 200px;" @blur="discriCard(form.id_number)"></el-input>
                        </el-form-item>
                        <el-form-item label="生日:" prop="birthday">
                            <el-date-picker v-bind:disabled="!editInfo" type="date" placeholder="选择日期" style="width: 200px;" v-model="form.birthday"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="是否公历:" prop="solar_calendar">
                            <el-select v-bind:disabled="!editInfo" v-model="form.solar_calendar" placeholder="请选择" style="width: 200px;">
                                <el-option label="公历" :value="int1"></el-option>
                                <el-option label="农历" :value="int0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="性别:" prop="gender">
                            <el-select v-bind:disabled="!editInfo" v-model="form.gender" placeholder="请选择性别" clearable style="width: 200px;">
                                <el-option label="男" :value="int1"></el-option>
                                <el-option label="女" :value="int2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联系电话:">
                            <el-input v-bind:disabled="!editInfo" v-model="form.phone" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item label="婚姻状况:">
                            <el-select v-bind:disabled="!editInfo" v-model="form.marital_status" clearable placeholder="请选择" style="width: 200px;">
                                <el-option v-for="(marital, key) in marital_status" :label="marital" :value="key * 1" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族:" prop="nationality">
                            <el-select v-bind:disabled="!editInfo" v-model="form.nationality" clearable placeholder="请选择" style="width: 200px;">
                                <el-option v-for="(nation, key) in nationality" :label="nation" :value="key * 1" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item label="头像信息:" label-width="110px">
                        <el-upload v-bind:disabled="!editInfo" class="avatar-uploader" :action="this.api.uploadelderimage" :headers="{'Authorization': 'Bearer ' + token}" :show-file-list="false" :on-success="handleAvatarSuccess">
                            <img v-if="photo" :src="photo" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </div>
                <div style="display: flex;flex-wrap: wrap;">
                    <el-form-item label="血型:">
                        <el-select v-bind:disabled="!editInfo" v-model="form.blood_group" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(blood, key) in blood_group" :label="blood" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="政治面貌:" prop="political_status">
                        <el-select v-bind:disabled="!editInfo" v-model="form.political_status" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(political, key) in political_status" :label="political" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="退休职业:">
                        <el-select v-bind:disabled="!editInfo" v-model="form.profession" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(profess, key) in profession" :label="profess" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否本地户籍:">
                        <el-select v-bind:disabled="!editInfo" v-model="form.is_resident" clearable placeholder="请选择" style="width: 200px;">
                            <el-option label="是" :value="int1"></el-option>
                            <el-option label="否" :value="int0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否外地迁入:">
                        <el-select v-bind:disabled="!editInfo" v-model="form.is_ingoing_resident" clearable placeholder="请选择" style="width: 200px;">
                            <el-option label="是" :value="int1"></el-option>
                            <el-option label="否" :value="int0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="原居住情况:" prop="living_status">
                        <el-select v-bind:disabled="!editInfo" v-model="form.living_status" clearable placeholder="请选择居住情况" style="width: 200px;">
                            <el-option v-for="(live, key) in living_status" :label="live" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="家庭人口:" prop="family_member_count">
                        <el-input v-bind:disabled="!editInfo" type="number" v-model="form.family_member_count" style="width: 200px;"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="家庭住址:" prop="address">
                    <el-input v-bind:disabled="!editInfo" v-model="form.address" style="width: 840px;"></el-input>
                </el-form-item>
                <el-form-item label="户籍地址:">
                    <el-input v-bind:disabled="!editInfo" v-model="form.census_register" style="width: 840px;"></el-input>
                </el-form-item>
                <div style="display: flex;flex-wrap: wrap;">
                    <el-form-item label="人员类型:" prop="elder_type">
                        <el-select v-bind:disabled="!editInfo" v-model="form.elder_type" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(eldert, key) in elder_type" :label="eldert" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宗教信仰:" prop="religion">
                        <el-select v-bind:disabled="!editInfo" v-model="form.religion" clearable placeholder="请选择宗教信仰" style="width: 200px;">
                            <el-option v-for="(relige, key) in religion" :label="relige" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="爱好:">
                        <el-input v-bind:disabled="!editInfo" v-model="form.hobbies" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="性格心理:">
                        <el-input v-bind:disabled="!editInfo" v-model="form.psychologies" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="饮食特点:">
                        <el-input v-bind:disabled="!editInfo" v-model="form.eating_habits" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="文化程度:">
                        <el-select v-bind:disabled="!editInfo" v-model="form.education" clearable placeholder="请选择文化程度" style="width: 200px;">
                            <el-option v-for="(educate, key) in education" :label="educate" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="劳动能力:" prop="labour_capacity">
                        <el-select v-bind:disabled="!editInfo" v-model="form.labour_capacity" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(labour, key) in labour_capacity" :label="labour" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自理能力:" prop="self_care">
                        <el-select v-bind:disabled="!editInfo" v-model="form.self_care" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(care, key) in care" :label="care" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="经济来源:" prop="income_source">
                        <el-select v-bind:disabled="!editInfo" v-model="form.income_source" clearable placeholder="请选择经济来源" style="width: 200px;">
                            <el-option v-for="(inco, key) in income_source" :label="inco" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="医疗保障:" prop="medical_security">
                        <el-select v-bind:disabled="!editInfo" v-model="form.medical_security" clearable placeholder="请选择医疗保障" style="width: 200px;">
                            <el-option v-for="(medice, key) in medical_security" :label="medice" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="医保卡号:">
                        <el-input v-bind:disabled="!editInfo" type="number" v-model="form.medicare_card" style="width: 200px;"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">家属信息</p>
                <el-button type="danger" size="small" style="margin-right: 60px;" @click="showAdd(0)">新增</el-button>
            </div>
            <el-table
                :data="tableDataQS"
                style="width: 100%"
                stripe>
                <el-table-column
                type="index"
                width="55">
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="gender"
                label="性别">
                </el-table-column>
                <el-table-column
                prop="phone"
                label="联系电话">
                </el-table-column>
                <el-table-column
                prop="is_guardian"
                label="是否监护人">
                <template slot-scope="scope">
                    <p>{{ scope.row.is_guardian == 0 ? '否' : '是' }}</p>
                </template>
                </el-table-column>
                <el-table-column
                prop="address"
                label="联系地址">
                </el-table-column>
                <el-table-column
                prop="active"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="delRelate(scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <v-relation :erid="erid" :elderId="elderId" :relation="relation"></v-relation>
    </div>
</template>

<script>
import localEvent from "@/utils/local";
import ChinaIdChecker from "@/utils/chinaId";
import { mapState } from "vuex";
import vRelation from "./addRelation.vue";

export default {
  props: [
    "marital_status",
    "nationality",
    "blood_group",
    "political_status",
    "profession",
    "living_status",
    "elder_type",
    "religion",
    "education",
    "labour_capacity",
    "income_source",
    "medical_security",
    "elderDetail",
    "care",
    "elderId",
    "relation"
  ],
  data() {
    return {
      form: {
        name: "",
        id_number: "",
        birthday: "",
        gender: "",
        phone: "",
        marital_status: "",
        nationality: "",
        blood_group: "",
        political_status: "",
        profession: "",
        is_resident: "",
        is_ingoing_resident: "",
        living_status: "",
        family_member_count: "",
        address: "",
        census_register: "",
        elder_type: "",
        religion: "",
        hobbies: "",
        psychologies: "",
        eating_habits: "",
        education: "",
        labour_capacity: "",
        income_source: "",
        medical_security: "",
        medicare_card: "",
        self_care: "",
        solar_calendar: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputElderName, trigger: "blur" }],
        id_number: [
          { required: true, message: this.message.pleaseInputElderIDcard, trigger: "blur" }
        ],
        birthday: [
          { required: true, message: this.message.pleaseChoiceElderBir, trigger: "change" }
        ],
        gender: [
          { required: true, message: this.message.pleaseChoiceElderSex, trigger: "change" }
        ],
        phone: [{ required: true, message: this.message.pleaseInputPhone, trigger: "blur" }],
        marital_status: [
          { required: true, message: this.message.pleaseChoiceMarryCondi, trigger: "change" }
        ],
        nationality: [
          { required: true, message: this.message.pleaseChoiceNation, trigger: "change" }
        ],
        blood_group: [
          { required: true, message: this.message.pleaseChoiceBloodType, trigger: "change" }
        ],
        political_status: [
          { required: true, message: this.message.pleaseChoicePolitice, trigger: "change" }
        ],
        profession: [
          { required: true, message: this.message.pleaseChoiceRetireJob, trigger: "change" }
        ],
        is_resident: [
          { required: true, message: this.message.pleaseChoiceWhetherLocal, trigger: "change" }
        ],
        is_ingoing_resident: [
          { required: true, message: this.message.pleaseChoiceWhetherNonlocal, trigger: "change" }
        ],
        living_status: [
          { required: true, message: this.message.pleaseChoiceOriLive, trigger: "change" }
        ],
        family_member_count: [
          { required: true, message: this.message.pleaseInputFamilyPopulation, trigger: "blur" }
        ],
        home_address: [
          { required: true, message: this.message.pleaseInputHomeAddress, trigger: "blur" }
        ],
        census_register: [
          { required: true, message: this.message.pleaseInputDomicileAddress, trigger: "blur" }
        ],
        elder_type: [
          { required: true, message: this.message.pleaseChoicePersonType, trigger: "change" }
        ],
        religion: [
          { required: true, message: this.message.pleaseChoiceReligiom, trigger: "change" }
        ],
        hobbies: [{ required: true, message: this.message.pleaseInputHobbies, trigger: "blur" }],
        psychologies: [
          { required: true, message: this.message.pleaseInoutPsychologies, trigger: "blur" }
        ],
        eating_habits: [
          { required: true, message: this.message.pleaseInputEatHabit, trigger: "blur" }
        ],
        education: [
          { required: true, message: this.message.pleaseChoiceEduDegree, trigger: "change" }
        ],
        labour_capacity: [
          { required: true, message: this.message.pleaseChoiceLaborAbility, trigger: "change" }
        ],
        income_source: [
          { required: true, message: this.message.pleaseChoiceEcoSource, trigger: "change" }
        ],
        medical_security: [
          { required: true, message: this.message.pleaseChoiceMedicare, trigger: "change" }
        ],
        medicare_card: [
          { required: true, message: this.message.pleaseInputMedicalCard, trigger: "blur" }
        ],
        self_care: [
          { required: true, message: this.message.pleaseChoiceSelfAbility, trigger: "change" }
        ],
        address: [
          { required: true, message: this.message.pleaseInputHomeAddress, trigger: "blur" }
        ]
      },
      int0: 0,
      int1: 1,
      int2: 2,
      token: localEvent.StorageGetter("accessToken"),
      photo: "",
      editInfo: false,
      tableDataQS: [],
      erid: 0,
    };
  },
  components: {
    vRelation
  },
  watch: {
    elderDetail() {
      if (this.elderDetail.length == 0) {
        this.form.name = "";
        this.form.id_number = "";
        this.form.birthday = "";
        this.form.gender = "";
        this.form.phone = "";
        this.form.marital_status = "";
        this.form.nationality = "";
        this.form.blood_group = "";
        this.form.political_status = "";
        this.form.profession = "";
        this.form.is_resident = "";
        this.form.is_ingoing_resident = "";
        this.form.living_status = "";
        this.form.family_member_count = "";
        this.form.address = "";
        this.form.census_register = "";
        this.form.elder_type = "";
        this.form.religion = "";
        this.form.hobbies = "";
        this.form.psychologies = "";
        this.form.eating_habits = "";
        this.form.education = "";
        this.form.labour_capacity = "";
        this.form.income_source = "";
        this.form.medical_security = "";
        this.form.medicare_card = "";
        this.photo = "";
        this.form.self_care = "";
        this.form.solar_calendar = "";
        this.tableDataQS = [];
        this.editInfo = false;
        this.$parent.$parent.$parent.$parent.loadingFalse();
      } else {
        this.form.name = this.elderDetail.name;
        this.form.id_number = this.elderDetail.id_number;
        this.form.birthday = this.elderDetail.birthday;
        this.form.gender = this.elderDetail.gender;
        this.form.phone = this.elderDetail.phone;
        this.form.marital_status = this.elderDetail.marital_status;
        this.form.nationality = this.elderDetail.nationality;
        this.form.blood_group = this.elderDetail.blood_group;
        this.form.political_status = this.elderDetail.political_status;
        this.form.profession = this.elderDetail.profession;
        this.form.is_resident = this.elderDetail.is_resident;
        this.form.is_ingoing_resident = this.elderDetail.is_ingoing_resident;
        this.form.living_status = this.elderDetail.living_status;
        this.form.family_member_count = this.elderDetail.family_member_count;
        this.form.address = this.elderDetail.address;
        this.form.census_register = this.elderDetail.census_register;
        this.form.elder_type = this.elderDetail.elder_type;
        this.form.religion = this.elderDetail.religion;
        this.form.hobbies = this.elderDetail.hobbies;
        this.form.psychologies = this.elderDetail.psychologies;
        this.form.eating_habits = this.elderDetail.eating_habits;
        this.form.education = this.elderDetail.education;
        this.form.labour_capacity = this.elderDetail.labour_capacity;
        this.form.income_source = this.elderDetail.income_source;
        this.form.medical_security = this.elderDetail.medical_security;
        this.form.medicare_card = this.elderDetail.medicare_card;
        this.photo = this.elderDetail.photo;
        this.form.self_care = this.elderDetail.self_care;
        this.form.solar_calendar = this.elderDetail.solar_calendar;
        this.tableDataQS = this.elderDetail.relative;
        this.$nextTick(() => {
          this.$parent.$parent.$parent.$parent.loadingFalse();
        });
      }
    },
    accessToken(){
      this.token = this.accessToken;
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.photo = res.data;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            name: this.form.name,
            elder_id: this.elderId,
            id_number: this.form.id_number,
            birthday: Date.parse(new Date(this.form.birthday)) / 1000,
            gender: this.form.gender,
            phone: this.form.phone,
            marital_status: this.form.marital_status,
            nationality: this.form.nationality,
            blood_group: this.form.blood_group,
            political_status: this.form.political_status,
            profession: this.form.profession,
            is_resident: this.form.is_resident,
            is_ingoing_resident: this.form.is_ingoing_resident,
            living_status: this.form.living_status,
            family_member_count: this.form.family_member_count,
            address: this.form.address,
            census_register: this.form.census_register,
            elder_type: this.form.elder_type,
            religion: this.form.religion,
            hobbies: this.form.hobbies,
            psychologies: this.form.psychologies,
            eating_habits: this.form.eating_habits,
            education: this.form.education,
            labour_capacity: this.form.labour_capacity,
            income_source: this.form.income_source,
            medical_security: this.form.medical_security,
            medicare_card: this.form.medicare_card,
            photo: this.photo,
            self_care: this.form.self_care,
            solar_calendar: this.form.solar_calendar
          };
          this.saveinfo(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    saveinfo: async function(data) {
      let url = this.api.modifiyelder;
      const res = await this.$http.post(url, data);
      console.log(res)
      if (res.data.status_code == 200) {
        this.editInfo = false;
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
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

      if (UUserCard.length == 18) {
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
        this.form.solar_calendar = this.int1;
      }
    },
    editElderInfo() {
      this.editInfo = true;
    },
    showAdd(scope) {
      this.$store.dispatch("addRelationTrue");
      if (scope == 0) {
        this.erid = 0;
      } else {
        this.erid = scope.id;
      }
    },
    delRelate: async function(scope) {
      let url = this.api.delelderrelative;
      var data = {
        erid: scope.id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.$parent.$parent.$parent.$parent.fetchDetail();
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    clean(){
      this.erid = 0;
    }
  },
  computed: mapState(["accessToken"])
};
</script>
