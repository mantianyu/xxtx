<template>
	<div class="addNurse" v-if="addNurse">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>护工</h5>
					<span class="pop-close" @click="hideEditFalse">
						<i class="el-icon-close"></i>
					</span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="130px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<div style="width: 65%;display: flex;flex-wrap: wrap;">
									<el-form-item label="员工姓名:" prop="name">
										<el-input v-model="form.name" style="width: 200px;"></el-input>
									</el-form-item>
									<el-form-item label="身份证号:" prop="id_number">
										<el-input v-model="form.id_number" style="width: 200px;" @blur="discriCard(form.id_number)"></el-input>
									</el-form-item>
									<el-form-item label="性别:" prop="gender">
										<el-select v-model="form.gender" clearable placeholder="请选择性别" style="width: 200px;">
											<el-option label="男" :value="int1"></el-option>
											<el-option label="女" :value="int2"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="出生年月:" prop="birthday">
										<el-date-picker type="date" placeholder="选择出生年月" v-model="form.birthday" style="width: 200px;"></el-date-picker>
									</el-form-item>
                  <el-form-item label="民族:" prop="nationality">
                    <el-select v-model="form.nationality" clearable placeholder="请选择民族" style="width: 200px;">
                      <el-option v-for="(national, key) in national" :label="national" :value="key*1" :key="key"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="婚姻状况:" prop="marital_status">
                    <el-select v-model="form.marital_status" clearable placeholder="请选择婚姻状况" style="width: 200px;">
                      <el-option v-for="(marital, key) in marital" :label="marital" :value="key*1" :key="key"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" type="number" style="width: 200px;"></el-input>
                  </el-form-item>
                  <el-form-item label="紧急联系人电话:" prop="emergency_phone">
                    <el-input v-model="form.emergency_phone" style="width: 200px;"></el-input>
                  </el-form-item>
								</div>
								<el-form-item label="头像信息:">
									<el-upload class="avatar-uploader" :action="this.api.uploademployeeimage" :headers="{'Authorization': 'Bearer ' + token}" :show-file-list="false" :on-success="handleAvatarSuccess">
										<img v-if="photo" :src="photo" class="avatar">
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</el-form-item>
							</div>
							<el-form-item label="籍贯:" prop="native_place">
								<el-input v-model="form.native_place" style="width: 860px;"></el-input>
							</el-form-item>
							<el-form-item label="户籍地址:" prop="census_register">
								<el-input v-model="form.census_register" style="width: 860px;"></el-input>
							</el-form-item>
							<el-form-item label="家庭地址:" prop="residence">
								<el-input v-model="form.residence" style="width: 860px;"></el-input>
							</el-form-item>
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="文化程度:" prop="education">
									<el-select v-model="form.education" clearable placeholder="请选择文化程度" style="width: 200px;">
										<el-option v-for="(education, key) in education" :label="education" :value="key*1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="政治面貌:" prop="political_status">
									<el-select v-model="form.political_status" clearable placeholder="请选择政治面貌" style="width: 200px;">
										<el-option v-for="(political, key) in political" :label="political" :value="key*1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="职称级别:" prop="professional_qualification_level">
									<el-select v-model="form.professional_qualification_level" clearable placeholder="请选择职称级别" style="width: 200px;">
										<el-option v-for="(proQualification, key) in proQualification" :label="proQualification" :value="key*1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="职称:" prop="professional_qualification">
									<el-input v-model="form.professional_qualification" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="职务:" prop="position">
									<el-select v-model="form.position" clearable placeholder="请选择职务" style="width: 200px;">
										<el-option v-for="(position, key) in position" :label="position" :value="key*1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="专业类别:" prop="professional_category">
									<el-input v-model="form.professional_category" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="薪金范围:" prop="salary_range">
									<el-input v-model="form.salary_range" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="其他待遇:" prop="other_benefits">
									<el-input v-model="form.other_benefits" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="合同类型:" prop="contract_type">
									<el-input v-model="form.contract_type" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="合同编号:" prop="contract_number">
									<el-input v-model="form.contract_number" maxlength="20" type="number" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="合同开始时间:" prop="contract_start_date">
									<el-date-picker type="date" placeholder="选择合同开始时间" v-model="form.contract_start_date" style="width: 200px;"></el-date-picker>
								</el-form-item>
								<el-form-item label="合同结束时间:" prop="contract_end_date">
									<el-date-picker type="date" placeholder="选择合同结束时间" v-model="form.contract_end_date" style="width: 200px;"></el-date-picker>
								</el-form-item>
								<el-form-item label="入职时间:" prop="employment_date">
									<el-date-picker type="date" placeholder="选择入职时间" v-model="form.employment_date" style="width: 200px;"></el-date-picker>
								</el-form-item>
								<el-form-item label="人员类型:" prop="employment_type">
									<el-select v-bind:disabled="flag" v-model="form.employment_type" clearable placeholder="请选择人员类型" style="width: 200px;" @change="employment">
										<el-option v-for="(emp, key) in emp" :label="emp" :value="key*1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="工作岗位:" prop="job">
									<el-select v-model="form.job" clearable placeholder="请选择工作岗位" style="width: 200px;">
										<el-option v-for="(quarter, key) in quarter" :label="quarter" :value="key*1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="所属部门:" prop="department_id">
									<el-select v-model="form.department_id" clearable placeholder="请选择所属部门" style="width: 200px;">
										<el-option v-for="(department, key) in department" :label="department" :value="key*1" :key="key"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div>
								<el-form-item label="添加证书:">
									<el-button type="danger" size="mini" @click="adddiploma">添加</el-button>
								</el-form-item>
								<el-table ref="singleTable" :data="tableData" style="width: 100%">
									<el-table-column type="index" width="50">
									</el-table-column>
									<el-table-column property="type" label="证书类别" width="150">
										<template slot-scope="scope">
											<el-select v-model="scope.row.type" size="mini" clearable placeholder="请选择证书类别">
												<el-option v-for="(certificate, key) in certificate" :label="certificate" :value="key*1" :key="key"></el-option>
											</el-select>
										</template>
									</el-table-column>
									<el-table-column property="name" label="证书名称" width="150">
										<template slot-scope="scope">
											<el-input v-model="scope.row.name" size="mini" placeholder="请输入内容"></el-input>
										</template>
									</el-table-column>
									<el-table-column property="issue_date" label="发证时间" width="150">
										<template slot-scope="scope">
											<el-date-picker type="date" placeholder="发证时间" value-format="yyyy-MM-dd" v-model="scope.row.issue_date" size="mini" style="width: 130px;"></el-date-picker>
										</template>
									</el-table-column>
									<el-table-column property="number" label="证书编号" width="150">
										<template slot-scope="scope">
											<el-input v-model="scope.row.number" oninput="if(value.length>20)value=value.slice(0,20)" size="mini" placeholder="请输入内容" type="number"></el-input>
										</template>
									</el-table-column>
									<el-table-column property="expiry_date" label="有效期" width="150">
										<template slot-scope="scope">
											<el-date-picker type="date" placeholder="有效期" value-format="yyyy-MM-dd" v-model="scope.row.expiry_date" size="mini" style="width: 130px;"></el-date-picker>
										</template>
									</el-table-column>
									<el-table-column property="issue_unit" label="发证单位" width="140">
										<template slot-scope="scope">
											<el-input v-model="scope.row.issue_unit" size="mini" placeholder="请输入内容"></el-input>
										</template>
									</el-table-column>
									<el-table-column label="操作">
										<template slot-scope="scope">
											<el-button @click.native.prevent="deleteRow(scope.$index, tableData, scope)" type="text" size="small">
												移除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>
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
import ChinaIdChecker from "@/utils/chinaId";
import { mapState } from "vuex";

export default {
  props: [
    "nlid",
    "national",
    "marital",
    "education",
    "political",
    "proQualification",
    "position",
    "emp",
    "department",
    "certificate",
    "flag"
  ],
  data() {
    var validateNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseInputID));
      } else {
        if (!ChinaIdChecker(value)) {
          callback(new Error(this.message.IDError));
        }
        callback();
      }
    };
    var validateendDate = (rule, value, callback) => {
      if (
        Date.parse(new Date(value)) <
        Date.parse(new Date(this.form.contract_start_date))
      ) {
        callback(new Error(this.message.compactTimeWarning));
      }
      callback();
    };
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
        name: "",
        id_number: "",
        gender: "",
        birthday: "",
        nationality: "",
        marital_status: "",
        native_place: "",
        census_register: "",
        residence: "",
        phone: "",
        emergency_phone: "",
        education: "",
        political_status: "",
        professional_qualification_level: "",
        professional_qualification: "",
        position: "",
        professional_category: "",
        salary_range: "",
        other_benefits: "",
        contract_type: "",
        contract_number: "",
        contract_start_date: "" + new Date(),
        contract_end_date: "" + new Date(),
        employment_date: "" + new Date(),
        employment_type: this.flag ? 3 : "",
        job: "",
        department_id: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputStaffName, trigger: "blur" }],
        id_number: [
          { required: true, validator: validateNumber, trigger: "blur" }
        ],
        phone: [{ required: true, message: this.message.pleaseInputPhone, trigger: "blur" }],
        contract_end_date: [
          { required: true, validator: validateendDate, trigger: "change" }
        ]
      },
      int1: 1,
      int2: 2,
      token: "",
      photo: "",
      tableData: [],
      quarter: [],
      loading: false,
      bLoading: false
    };
  },
  watch: {
    nlid() {
      if (this.nlid == 0) {
        this.photo = "";
        this.tableData = [];
        if (this.flag) {
          this.quarter = [];
        }
      } else {
        this.fetchDetail(this.nlid);
      }
    },
    accessToken() {
      this.token = this.accessToken;
    }
  },
  mounted() {
		this.token = this.accessToken;
    if (this.flag) {
      this.employment(3);
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.photo = res.data;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              !this.tableData[i].type ||
              !this.tableData[i].name ||
              !this.tableData[i].number ||
              !this.tableData[i].expiry_date ||
              !this.tableData[i].issue_unit ||
              !this.tableData[i].issue_date
            ) {
              this.$alert(this.message.certificateComplate, "", {
                confirmButtonText: this.message.confirm,
                callback: action => {
                  this.bLoading = false;
                }
              });
              return;
            }
            if (
              Date.parse(new Date(this.tableData[i].expiry_date)) <
              Date.parse(new Date(this.tableData[i].issue_date))
            ) {
              this.$alert(this.message.certificateTime, "", {
                confirmButtonText: this.message.confirm,
                callback: action => {
                  this.bLoading = false;
                }
              });
              return;
            }
          }
          if (this.nlid == 0) {
            var data = {
              name: this.form.name,
              id_number: this.form.id_number,
              gender: this.form.gender,
              birthday: Date.parse(new Date(this.form.birthday)) / 1000,
              nationality: this.form.nationality,
              marital_status: this.form.marital_status,
              native_place: this.form.native_place,
              census_register: this.form.census_register,
              residence: this.form.residence,
              phone: this.form.phone,
              emergency_phone: this.form.emergency_phone,
              education: this.form.education,
              political_status: this.form.political_status,
              professional_qualification_level: this.form
                .professional_qualification_level,
              professional_qualification: this.form.professional_qualification,
              position: this.form.position,
              professional_category: this.form.professional_category,
              salary_range: this.form.salary_range,
              other_benefits: this.form.other_benefits,
              contract_type: this.form.contract_type,
              contract_number: this.form.contract_number,
              contract_start_date:
                Date.parse(new Date(this.form.contract_start_date)) / 1000,
              contract_end_date:
                Date.parse(new Date(this.form.contract_end_date)) / 1000,
              employment_date:
                Date.parse(new Date(this.form.employment_date)) / 1000,
              employment_type: this.form.employment_type,
              job: this.form.job,
              department_id: this.form.department_id,
              certificates: this.tableData,
              photo: this.photo
            };
            this.saveNurse(data);
          } else {
            var data = {
              id: this.nlid,
              name: this.form.name,
              id_number: this.form.id_number,
              gender: this.form.gender,
              birthday: Date.parse(new Date(this.form.birthday)) / 1000,
              nationality: this.form.nationality,
              marital_status: this.form.marital_status,
              native_place: this.form.native_place,
              census_register: this.form.census_register,
              residence: this.form.residence,
              phone: this.form.phone,
              emergency_phone: this.form.emergency_phone,
              education: this.form.education,
              political_status: this.form.political_status,
              professional_qualification_level: this.form
                .professional_qualification_level,
              professional_qualification: this.form.professional_qualification,
              position: this.form.position,
              professional_category: this.form.professional_category,
              salary_range: this.form.salary_range,
              other_benefits: this.form.other_benefits,
              contract_type: this.form.contract_type,
              contract_number: this.form.contract_number,
              contract_start_date:
                Date.parse(new Date(this.form.contract_start_date)) / 1000,
              contract_end_date:
                Date.parse(new Date(this.form.contract_end_date)) / 1000,
              employment_date:
                Date.parse(new Date(this.form.employment_date)) / 1000,
              employment_type: this.form.employment_type,
              job: this.form.job,
              department_id: this.form.department_id,
              certificates: this.tableData,
              photo: this.photo
            };
            this.saveNurse(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addNurseFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
      this.photo = "";
      this.tableData = [];
      // this.quarter = [];
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.employeesdetails;
      var data = {
        eid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.id_number = res.data.data.id_number;
          this.form.gender = res.data.data.gender ? res.data.data.gender : '';
          this.form.birthday = res.data.data.birthday;
          this.form.nationality = res.data.data.nationality;
          this.form.marital_status = res.data.data.marital_status;
          this.form.native_place = res.data.data.native_place;
          this.form.census_register = res.data.data.census_register;
          this.form.residence = res.data.data.residence;
          this.form.phone = res.data.data.phone;
          this.form.emergency_phone = res.data.data.emergency_phone;
          this.form.education = res.data.data.education;
          this.form.political_status = res.data.data.political_status;
          this.form.professional_qualification_level =
            res.data.data.professional_qualification_level;
          this.form.professional_qualification =
            res.data.data.professional_qualification;
          this.form.position = res.data.data.position;
          this.form.professional_category = res.data.data.professional_category;
          this.form.salary_range = res.data.data.salary_range;
          this.form.other_benefits = res.data.data.other_benefits;
          this.form.contract_type = res.data.data.contract_type;
          this.form.contract_number = res.data.data.contract_number;
          this.form.contract_start_date = res.data.data.contract_start_date;
          this.form.contract_end_date = res.data.data.contract_end_date;
          this.form.employment_date = res.data.data.employment_date;
          this.form.employment_type = res.data.data.employment_type;
          this.form.job = res.data.data.job;
          this.form.department_id = res.data.data.department_id;
          this.tableData = res.data.data.certificates;
          this.photo = res.data.data.photo;
          this.fetchQuarter(res.data.data.employment_type, 0);
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
    saveNurse: async function(data) {
      let url = this.api.addemployees;
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
    adddiploma() {
      var data = {
        type: "",
        name: "",
        number: "",
        expiry_date: "",
        issue_unit: "",
        issue_date: ""
      };
      this.tableData.push(data);
    },
    deleteRow: async function(index, rows, scope) {
      if (scope.row.id) {
        let url = this.api.employeecertificatesdel;
        var data = {
          id: scope.row.id
        };
        const res = await this.$http.post(url, data);
      }
      rows.splice(index, 1);
    },
    fetchQuarter: async function(val, index) {
      let url = this.api.getemployeetypelist;
      var data = {
        type: val
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.quarter = res.data.data;
        if (index === 1) {
          this.form.job = "";
        }
      } else {
        this.form.job = "";
        this.quarter = [];
      }
    },
    employment(val) {
      this.form.job = '';
      this.fetchQuarter(val, 1);
    },
    discriCard(UUserCard) {
      if (UUserCard === "") {
        return null;
      } else if (!ChinaIdChecker(UUserCard)) {
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
      }
    }
  },
  computed: mapState(["addNurse", "accessToken"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
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
  margin-left: -550px;
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
.addNurse {
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