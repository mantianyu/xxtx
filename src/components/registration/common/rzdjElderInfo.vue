<template>
    <div>

        <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
            <div style="display: flex;justify-content: flex-start;">
                <div style="display: flex;flex-wrap: wrap;width: 650px;">
                    <el-form-item label="姓名:" prop="name">
                      <el-autocomplete style="width: 200px;"
                        value-key="name"
                        popper-class="my-autocomplete"
                        v-model="form.name"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入或选择老人"
                        @select="handleSelect"
                        @clearable="clearElder"
                        clearable>
                        <i
                          class="el-icon-edit el-input__clear"
                          slot="suffix"
                          style="margin-right: 10px;"
                          @click="handleIconClick">
                        </i>
                        <template slot-scope="{ item }">
                            <div class="name">{{ item.name }}({{ item.bed_name }})</div>
                            <span class="addr">{{ item.id_number }}</span>
                        </template>
                      </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="身份证号:" prop="id_number">
                        <el-input v-model="form.id_number" style="width: 200px;" @blur="discriCard(form.id_number)"></el-input>
                    </el-form-item>
                    <el-form-item label="生日:" prop="birthday">
                        <el-date-picker type="date" placeholder="选择日期" style="width: 200px;" v-model="form.birthday"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否公历:" prop="solar_calendar">
                        <el-select v-model="form.solar_calendar" placeholder="请选择" style="width: 200px;">
                            <el-option label="公历" :value="int1"></el-option>
                            <el-option label="农历" :value="int0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="性别:" prop="gender">
                        <el-select v-model="form.gender" placeholder="请选择性别" clearable style="width: 200px;">
                            <el-option label="男" :value="int1"></el-option>
                            <el-option label="女" :value="int2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="phone">
                        <el-input v-model="form.phone" style="width: 200px;" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="婚姻状况:">
                        <el-select v-model="form.marital_status" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(marital, key) in marital_status" :label="marital" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="民族:" prop="nationality">
                        <el-select v-model="form.nationality" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="(nation, key) in nationality" :label="nation" :value="key * 1" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="头像信息:" label-width="110px">
                    <el-upload class="avatar-uploader" :action="this.api.uploadelderimage" :headers="{'Authorization': 'Bearer ' + token}" :show-file-list="false" :on-success="handleAvatarSuccess">
                        <img v-if="photo" :src="photo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="自理能力:" prop="self_care">
                    <el-select v-model="form.self_care" clearable placeholder="请选择" style="width: 200px;">
                        <el-option v-for="(care, key) in care" :label="care" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="血型:">
                    <el-select v-model="form.blood_group" clearable placeholder="请选择" style="width: 200px;">
                        <el-option v-for="(blood, key) in blood_group" :label="blood" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="政治面貌:" prop="political_status">
                    <el-select v-model="form.political_status" clearable placeholder="请选择" style="width: 200px;">
                        <el-option v-for="(political, key) in political_status" :label="political" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退休职业:">
                    <el-select v-model="form.profession" clearable placeholder="请选择" style="width: 200px;">
                        <el-option v-for="(profess, key) in profession" :label="profess" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否本地户籍:">
                    <el-select v-model="form.is_resident" clearable placeholder="请选择" style="width: 200px;">
                        <el-option label="是" :value="int1"></el-option>
                        <el-option label="否" :value="int0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否外地迁入:">
                    <el-select v-model="form.is_ingoing_resident" clearable placeholder="请选择" style="width: 200px;">
                        <el-option label="是" :value="int1"></el-option>
                        <el-option label="否" :value="int0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原居住情况:" prop="living_status">
                    <el-select v-model="form.living_status" clearable placeholder="请选择居住情况" style="width: 200px;">
                        <el-option v-for="(live, key) in living_status" :label="live" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="家庭人口:" prop="family_member_count">
                    <el-input type="number" v-model="form.family_member_count" style="width: 200px;" min="0"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="家庭住址:" prop="address">
                <el-input v-model="form.address" style="width: 840px;"></el-input>
            </el-form-item>
            <el-form-item label="户籍地址:">
                <el-input v-model="form.census_register" style="width: 840px;"></el-input>
            </el-form-item>
            <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="人员类型:" prop="elder_type">
                    <el-select v-model="form.elder_type" clearable placeholder="请选择" style="width: 200px;">
                        <el-option v-for="(eldert, key) in elder_type" :label="eldert" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="宗教信仰:" prop="religion">
                    <el-select v-model="form.religion" clearable placeholder="请选择宗教信仰" style="width: 200px;">
                        <el-option v-for="(relige, key) in religion" :label="relige" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="爱好:">
                    <el-input v-model="form.hobbies" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="性格心理:">
                    <el-input v-model="form.psychologies" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="饮食特点:">
                    <el-input v-model="form.eating_habits" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="文化程度:">
                    <el-select v-model="form.education" clearable placeholder="请选择文化程度" style="width: 200px;">
                        <el-option v-for="(educate, key) in education" :label="educate" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="劳动能力:" prop="labour_capacity">
                    <el-select v-model="form.labour_capacity" clearable placeholder="请选择" style="width: 200px;">
                        <el-option v-for="(labour, key) in labour_capacity" :label="labour" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="经济来源:" prop="income_source">
                    <el-select v-model="form.income_source" clearable placeholder="请选择经济来源" style="width: 200px;">
                        <el-option v-for="(inco, key) in income_source" :label="inco" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="医疗保障:" prop="medical_security">
                    <el-select v-model="form.medical_security" clearable placeholder="请选择医疗保障" style="width: 200px;">
                        <el-option v-for="(medice, key) in medical_security" :label="medice" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="医保卡号:">
                    <el-input type="number" v-model="form.medicare_card" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="签订合同日期:" prop="contract_start_date">
                    <el-date-picker @change="contract" type="date" placeholder="选择日期" v-model="form.contract_start_date" style="width: 200px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="登记入住时间:" prop="check_in_time">
                    <el-date-picker @change="checkIn" type="date" placeholder="选择日期" v-model="form.check_in_time" style="width: 200px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="经办人:" prop="employee_id">
                    <el-input v-model="form.employee_id" disabled style="width: 200px;"></el-input>
                </el-form-item>
            </div>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="info" size="medium" @click="hideEdit">取消</el-button>
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import localEvent from '@/utils/local';
import ChinaIdChecker from '@/utils/chinaId';
import { mapState } from 'vuex';

export default {
	props: [
		'marital_status',
		'nationality',
		'blood_group',
		'political_status',
		'profession',
		'living_status',
		'elder_type',
		'religion',
		'education',
		'labour_capacity',
		'income_source',
		'medical_security',
		'elderDetail',
		'care',
		'elderList',
		'rzdjEdit',
	],
	data() {
		var validateNumber = (rule, value, callback) => {
			if (value === '') {
				callback(new Error(this.message.pleaseInputID));
			} else {
				if (!ChinaIdChecker(value)) {
					callback(new Error(this.message.IdWrong));
				}
				callback();
			}
		};
		return {
			form: {
				name: '',
				id_number: '',
				birthday: '',
				gender: '',
				phone: '',
				marital_status: '',
				nationality: '',
				blood_group: '',
				political_status: '',
				profession: '',
				is_resident: '',
				is_ingoing_resident: '',
				living_status: '',
				family_member_count: '',
				address: '',
				census_register: '',
				elder_type: '',
				religion: '',
				hobbies: '',
				psychologies: '',
				eating_habits: '',
				education: '',
				labour_capacity: '',
				income_source: '',
				medical_security: '',
				medicare_card: '',
				contract_start_date: '' + new Date(),
				check_in_time: '' + new Date(),
				employee_id: localEvent.StorageGetter('empName'),
				self_care: '',
				solar_calendar: '',
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入老人姓名',
						trigger: ['blur', 'change'],
					},
				],
				id_number: [{ required: true, validator: validateNumber, trigger: 'blur' }],
				check_in_time: [
					{
						required: true,
						message: this.message.pleaseChoiceCheckinDate,
						trigger: 'change',
					},
				],
				self_care: [
					{
						required: true,
						message: this.message.pleaseChoiceSelfAbility,
						trigger: 'change',
					},
				],
			},
			int0: 0,
			int1: 1,
			int2: 2,
			token: '',
			empId: localEvent.StorageGetter('empId'),
			photo: '',
			bLoading: false,
				old_check_in_time: '' + new Date(),
		};
	},
	watch: {
		elderDetail() {
			if (this.elderDetail.length == 0) {
				this.form.elder_id = 0;
				this.form.name = '';
				this.form.id_number = '';
				this.form.birthday = '';
				this.form.gender = '';
				this.form.phone = '';
				this.form.marital_status = '';
				this.form.nationality = '';
				this.form.blood_group = '';
				this.form.political_status = '';
				this.form.profession = '';
				this.form.is_resident = '';
				this.form.is_ingoing_resident = '';
				this.form.living_status = '';
				this.form.family_member_count = '';
				this.form.address = '';
				this.form.census_register = '';
				this.form.elder_type = '';
				this.form.religion = '';
				this.form.hobbies = '';
				this.form.psychologies = '';
				this.form.eating_habits = '';
				this.form.education = '';
				this.form.labour_capacity = '';
				this.form.income_source = '';
				this.form.medical_security = '';
				this.form.medicare_card = '';
				this.form.contract_start_date = '' + new Date();
				this.form.check_in_time = '' + new Date();
				this.form.employee_id = localEvent.StorageGetter('empName');
				this.photo = '';
				this.form.self_care = '';
				this.form.solar_calendar = '';
				this.$parent.$parent.$parent.$parent.loadingFalse();
			} else {
				this.form.elder_id = this.elderDetail.elder_id ? this.elderDetail.elder_id : this.elderDetail.id;
				this.form.name = this.elderDetail.eldername;
				this.form.id_number = this.elderDetail.eldercard;
				this.form.birthday = this.elderDetail.birthday;
				this.form.gender = this.elderDetail.eldergender;
				this.form.phone = this.elderDetail.elderphone;
				this.form.marital_status = this.elderDetail.maritalstatus;
				this.form.nationality = this.elderDetail.nationality;
				this.form.blood_group = this.elderDetail.bloodgroup;
				this.form.political_status = this.elderDetail.politicalstatus;
				this.form.profession = this.elderDetail.profession;
				this.form.is_resident = this.elderDetail.isresident;
				this.form.is_ingoing_resident = this.elderDetail.isingoingresident;
				this.form.living_status = this.elderDetail.livingstatus;
				this.form.family_member_count = this.elderDetail.familymembercount;
				this.form.address = this.elderDetail.address;
				this.form.census_register = this.elderDetail.censusregister;
				this.form.elder_type = this.elderDetail.eldertype;
				this.form.religion = this.elderDetail.religion;
				this.form.hobbies = this.elderDetail.hobbies;
				this.form.psychologies = this.elderDetail.psychologies;
				this.form.eating_habits = this.elderDetail.eatinghabits;
				this.form.education = this.elderDetail.education;
				this.form.labour_capacity = this.elderDetail.labourcapacity;
				this.form.income_source = this.elderDetail.incomesource;
				this.form.medical_security = this.elderDetail.medicalsecurity;
				this.form.medicare_card = this.elderDetail.medicarecard;
				this.form.contract_start_date = this.elderDetail.contractstartdate;
				this.form.check_in_time = this.elderDetail.checkintime;
				this.old_check_in_time = this.elderDetail.checkintime;
				this.form.employee_id = this.elderDetail.employeename;
				this.photo = this.elderDetail.photo;
				this.form.self_care = this.elderDetail.selfcare;
				this.form.solar_calendar = this.elderDetail.solarcalendar;
				if (this.form.id_number) {
					if (!this.form.birthday) {
						this.discriCard(this.form.id_number, this.form.gender ? false : true);
					}
				}
				this.$nextTick(() => {
					this.$parent.$parent.$parent.$parent.loadingFalse();
				});
			}
		},
		accessToken() {
			this.token = this.accessToken;
		},
		rzdjEdit() {
			if (!this.rzdjEdit) {
				this.$refs['form'].resetFields();
			}
		},
	},
	mounted() {
		this.token = this.accessToken;
	},
	methods: {
		handleAvatarSuccess(res, file) {
			this.photo = res.data;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// this.$notify({
					// 	title: this.message.success,
					// 	message: this.message.addCheckinSuccess,
					// 	type: "success"
					// });
					this.bLoading = true;
					if (this.elderDetail.length == 0) {
						var data = {
							name: this.form.name,
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
							contract_start_date: Date.parse(new Date(this.form.contract_start_date)) / 1000,
							check_in_time: Date.parse(new Date(this.form.check_in_time)) / 1000,
							employee_id: this.empId,
							photo: this.photo,
							self_care: this.form.self_care,
							solar_calendar: this.form.solar_calendar,
						};
						this.saveinfo(data);
					} else {
						var data = {
							elderid: this.form.elder_id,
							name: this.form.name,
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
							contract_start_date: Date.parse(new Date(this.form.contract_start_date)) / 1000,
							check_in_time: Date.parse(new Date(this.form.check_in_time)) / 1000,
							employee_id: this.empId,
							photo: this.photo,
							self_care: this.form.self_care,
							solar_calendar: this.form.solar_calendar,
						};
						this.saveinfo(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEdit() {
			this.$refs['form'].resetFields();
			this.$parent.$parent.$parent.$parent.detailEmpty();
			this.$parent.$parent.$parent.$parent.hideEdit();
			this.$store.dispatch('rzdjEditFalse');
		},
		saveinfo: async function(data) {
			let url = this.api.addelders;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.$parent.$parent.$parent.$parent.getId(
						res.data.data.id,
						res.data.data.checkin,
						res.data.data.selfcare
					);
					this.bLoading = false;
					this.$parent.$parent.$parent.$parent.$parent.ManageList(1);
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.bLoading = false;
						},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.bLoading = false;
					},
				});
			}
		},
		discriCard(UUserCard) {
			if (UUserCard === '') {
				return null;
			} else if (!ChinaIdChecker(UUserCard)) {
				// this.$alert("身份证错误！", "", {
				//   confirmButtonText: "确定",
				//   callback: action => {}
				// });
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
					(UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day)
				) {
					age++;
				}
				this.form.birthday =
					UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14);
				this.form.solar_calendar = this.int1;
				this.$refs['form'].clearValidate();
			}
		},
		doFecthElder: async function(elderId) {
			let url = this.api.elderdetail;
			var data = {
				elder_id: elderId,
			};
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				this.form.id_number = res.data.data.id_number;
				this.form.birthday = res.data.data.birthday;
				this.form.gender = res.data.data.gender;
				this.form.phone = res.data.data.phone;
				this.form.marital_status = res.data.data.marital_status;
				this.form.nationality = res.data.data.nationality;
				this.form.blood_group = res.data.data.blood_group;
				this.form.political_status = res.data.data.political_status;
				this.form.profession = res.data.data.profession;
				this.form.is_resident = res.data.data.is_resident;
				this.form.is_ingoing_resident = res.data.data.is_ingoing_resident;
				this.form.living_status = res.data.data.living_status;
				this.form.family_member_count = res.data.data.family_member_count;
				this.form.address = res.data.data.address;
				this.form.census_register = res.data.data.census_register;
				this.form.elder_type = res.data.data.elder_type;
				this.form.religion = res.data.data.religion;
				this.form.hobbies = res.data.data.hobbies;
				this.form.psychologies = res.data.data.psychologies;
				this.form.eating_habits = res.data.data.eating_habits;
				this.form.education = res.data.data.education;
				this.form.labour_capacity = res.data.data.labour_capacity;
				this.form.income_source = res.data.data.income_source;
				this.form.medical_security = res.data.data.medical_security;
				this.form.medicare_card = res.data.data.medicare_card;
				this.photo = res.data.data.photo;
				this.form.self_care = res.data.data.self_care;
				this.form.solar_calendar = res.data.data.solar_calendar;
			} else {
				this.clearElder();
			}
		},
		clearElder() {
			this.form.elder_id = 0;
			this.form.name = '';
			this.form.id_number = '';
			this.form.birthday = '';
			this.form.gender = '';
			this.form.phone = '';
			this.form.marital_status = '';
			this.form.nationality = '';
			this.form.blood_group = '';
			this.form.political_status = '';
			this.form.profession = '';
			this.form.is_resident = '';
			this.form.is_ingoing_resident = '';
			this.form.living_status = '';
			this.form.family_member_count = '';
			this.form.address = '';
			this.form.census_register = '';
			this.form.elder_type = '';
			this.form.religion = '';
			this.form.hobbies = '';
			this.form.psychologies = '';
			this.form.eating_habits = '';
			this.form.education = '';
			this.form.labour_capacity = '';
			this.form.income_source = '';
			this.form.medical_security = '';
			this.form.medicare_card = '';
			this.form.contract_start_date = '' + new Date();
			this.form.check_in_time = '' + new Date();
			this.form.employee_id = localEvent.StorageGetter('empName');
			this.photo = '';
			this.form.self_care = '';
			this.form.solar_calendar = '';
			this.$refs['form'].clearValidate();
		},
		querySearch(queryString, cb) {
			if (this.elderDetail.length == 0) {
				var elders = this.elderList;
				var results = queryString ? elders.filter(this.createFilter(queryString)) : elders;
				cb(elders);
			} else {
				cb([]);
			}
		},
		createFilter(queryString) {
			return elder => {
				return elder.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
			};
		},
		handleSelect(item) {
			this.form.name = item.name;
			if (this.form.elder_id != item.id) {
				this.form.elder_id = item.id;
				this.doFecthElder(item.id);
			}
		},
		handleIconClick(ev) {
			if (this.elderDetail.length == 0) {
				if (this.form.elder_id != 0) {
					this.clearElder();
				}
			} else {
				this.form.name = '';
			}
		},
		contract(val) {
			if (!this.form.check_in_time) {
				this.form.check_in_time = val;
			}
		},
		checkIn(val) {
			if(!this.form.contract_start_date){
				this.form.contract_start_date = val;
			}
			if (this.old_check_in_time === this.form.contract_start_date) {
				this.form.contract_start_date = val;
				this.old_check_in_time = val;
			}
		},
	},
	computed: mapState(['addNurse', 'accessToken']),
};
</script>
<style type="text/css" scoped>
.my-autocomplete li {
	line-height: normal;
	padding: 7px;
}

.my-autocomplete li .name {
	text-overflow: ellipsis;
	overflow: hidden;
}

.my-autocomplete li .addr {
	font-size: 12px;
	color: #b4b4b4;
}

.my-autocomplete li .highlighted .addr {
	color: #ddd;
}
</style>