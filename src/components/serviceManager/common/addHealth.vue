<template>
	<div class="addHealth" v-show="addHealth">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>体检登记</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="160px">
							<el-form-item label="老人姓名:" prop="elder_name">
								<el-select v-bind:disabled="this.healthId != 0" v-model="form.elder_name" filterable clearable placeholder="请选择老人">
									<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="体检时间:" prop="time">
								<el-date-picker v-bind:disabled="addHealthEdit" type="date" placeholder="选择日期" v-model="form.time"></el-date-picker>
							</el-form-item>
							<el-form-item label="登记人:" prop="employee_name">
								<el-input disabled v-model="form.employee_name"></el-input>
							</el-form-item>
							<el-form-item label="体检医院:" prop="hospital">
								<el-input v-bind:disabled="addHealthEdit" v-model="form.hospital"></el-input>
							</el-form-item>
							<el-form-item label="体检结果:" prop="result">
								<el-input v-bind:disabled="addHealthEdit" type="textarea" v-model="form.result"></el-input>
							</el-form-item>
							<el-form-item label="图片:">
								<el-upload
								class="upload-demo"
								:action="this.api.uploadelderhealthexaminationimage"
								:with-credentials="true"
								:headers="{'Authorization': 'Bearer ' + token}"
								:on-preview="handlePreview"
								:on-remove="handleRemove"
								:on-success="handleSuccess"
								:file-list="fileList"
								list-type="picture">
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
								</el-upload>
							</el-form-item>
							<el-form-item label="身高:" prop="height">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.height">
									<template slot="append">cm</template>
								</el-input>
							</el-form-item>
							<el-form-item label="体重:" prop="weight">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.weight">
									<template slot="append">kg</template>
								</el-input>
							</el-form-item>
							<el-form-item label="体温:" prop="temperature">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.temperature">
									<template slot="append">℃</template>
								</el-input>
							</el-form-item>
							<el-form-item label="高压:" prop="high_blood_pressure">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.high_blood_pressure">
									<template slot="append">mmHg</template>
								</el-input>
							</el-form-item>
							<el-form-item label="低压:" prop="low_blood_pressure">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.low_blood_pressure">
									<template slot="append">mmKg</template>
								</el-input>
							</el-form-item>
							<el-form-item label="脉搏:" prop="pulse">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.pulse">
									<template slot="append">次/分</template>
								</el-input>
							</el-form-item>
							<el-form-item label="血氧值:" prop="oxygen_saturation_value">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.oxygen_saturation_value">
									<template slot="append">℃</template>
								</el-input>
							</el-form-item>
							<el-form-item label="空腹血糖:" prop="fasting_glucose">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.fasting_glucose">
									<template slot="append">毫摩尔/升</template>
								</el-input>
							</el-form-item>
							<el-form-item label="餐后血糖:" prop="postprandial_glucose">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.postprandial_glucose">
									<template slot="append">毫摩尔/升</template>
								</el-input>
							</el-form-item>
							<el-form-item label="总胆固醇:" prop="cholesterol_total">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.cholesterol_total">
									<template slot="append">mmol/L</template>
								</el-input>
							</el-form-item>
							<el-form-item label="甘油三酯:" prop="triglycerides">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.triglycerides">
									<template slot="append">mmol/L</template>
								</el-input>
							</el-form-item>
							<el-form-item label="高密度脂蛋白胆固醇:" prop="hdlc">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.hdlc">
									<template slot="append">mmol/L</template>
								</el-input>
							</el-form-item>
							<el-form-item label="低密度脂蛋白胆固醇:" prop="cdlc">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.cdlc">
									<template slot="append">mmol/L</template>
								</el-input>
							</el-form-item>
							<el-form-item label="尿酸:" prop="uric_acid">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.uric_acid">
									<template slot="append">mmol/L</template>
								</el-input>
							</el-form-item>
							<el-form-item label="qrs间期:" prop="qrs_interval">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.qrs_interval"></el-input>
							</el-form-item>
							<el-form-item label="rr间期:" prop="rr_interval">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.rr_interval"></el-input>
							</el-form-item>
							<el-form-item label="心率:" prop="heart_rate">
								<el-input type="number" v-bind:disabled="addHealthEdit" v-model="form.heart_rate"></el-input>
							</el-form-item>
							<el-form-item label="全科医生批注:" prop="gp_comment">
								<el-input v-bind:disabled="addHealthEdit" type="textarea" v-model="form.gp_comment"></el-input>
							</el-form-item>
							<el-form-item label="医生分析结果:" prop="analytic_result">
								<el-input v-bind:disabled="addHealthEdit" type="textarea" v-model="form.analytic_result"></el-input>
							</el-form-item>
							<div v-if="!addHealthEdit" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
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
import localEvent from '@/utils/local';
import { mapState } from 'vuex';

export default {
	props: ['healthId', 'elders'],
	data() {
		let heightCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (isNaN(value)) {
				callback(new Error('请输入数字值'));
			} else {
				if (value < 0) {
					callback(new Error('不能输入负数'));
				} else if (value < 50 || value > 250) {
					callback(new Error('身高不符'));
				} else {
					callback();
				}
			}
		};
		let temperatureCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 36 || value > 41) {
				callback(new Error('体温不符'));
			} else {
				callback();
			}
		};
		let highCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 90 || value > 140) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let lowCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 60 || value > 90) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let pluseCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 60 || value > 100) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let fastingCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 3.89 || value > 6.1) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let postprandialCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 6.7 || value > 9.4) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let cholesterolCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 3 || value > 5.2) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let triglyceridesCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value > 1.7 || value == 1.7) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let hdlcCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 1.16 || value > 1.55) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let cdlcCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 0 || value > 10) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let uric_acidCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 89 || value > 416) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let rrCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 60 || value > 100) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		let heart_rateCheck = (rule, value, callback) => {
			if (value === '') {
				callback();
			} else if (value < 60 || value > 100) {
				callback(new Error('请输入正确数值'));
			} else {
				callback();
			}
		};
		return {
			form: {
				elder_name: '',
				time: '' + new Date(),
				employee_name: localEvent.StorageGetter('empName'),
				employee_id: localEvent.StorageGetter('empId'),
				hospital: '',
				result: '',
				height: '',
				weight: '',
				temperature: '',
				high_blood_pressure: '',
				low_blood_pressure: '',
				pulse: '',
				oxygen_saturation_value: '',
				fasting_glucose: '',
				postprandial_glucose: '',
				cholesterol_total: '',
				triglycerides: '',
				hdlc: '',
				cdlc: '',
				uric_acid: '',
				qrs_interval: '',
				rr_interval: '',
				heart_rate: '',
				gp_comment: '',
				analytic_result: '',
			},
			rules: {
				elder_name: [
					{
						required: true,
						message: this.message.pleaseChoiceElderName,
						trigger: 'change',
					},
				],
				hospital: [
					{
						required: true,
						message: this.message.pleaseInputHospitalName,
						trigger: 'blur',
					},
				],
				time: [
					{
						required: true,
						message: this.message.pleaseInputExamineTime,
						trigger: 'change',
					},
				],
				height: [
					{
						required: false,
						validator: heightCheck,
						trigger: 'blur',
					},
				],
				temperature: [
					{
						required: false,
						validator: temperatureCheck,
						trigger: 'blur',
					},
				],
				high_blood_pressure: [
					{
						required: false,
						validator: highCheck,
						trigger: 'blur',
					},
				],
				low_blood_pressure: [
					{
						required: false,
						validator: lowCheck,
						trigger: 'blur',
					},
				],
				pulse: [
					{
						required: false,
						validator: pluseCheck,
						trigger: 'blur',
					},
				],
				fasting_glucose: [
					{
						required: false,
						validator: fastingCheck,
						trigger: 'blur',
					},
				],
				postprandial_glucose: [
					{
						required: false,
						validator: postprandialCheck,
						trigger: 'blur',
					},
				],
				cholesterol_total: [
					{
						required: false,
						validator: cholesterolCheck,
						trigger: 'blur',
					},
				],
				triglycerides: [
					{
						required: false,
						validator: triglyceridesCheck,
						trigger: 'blur',
					},
				],
				hdlc: [
					{
						required: false,
						validator: hdlcCheck,
						trigger: 'blur',
					},
				],
				cdlc: [
					{
						required: false,
						validator: cdlcCheck,
						trigger: 'blur',
					},
				],
				uric_acid: [
					{
						required: false,
						validator: uric_acidCheck,
						trigger: 'blur',
					},
				],
				rr_interval: [
					{
						required: false,
						validator: rrCheck,
						trigger: 'blur',
					},
				],
				heart_rate: [
					{
						required: false,
						validator: heart_rateCheck,
						trigger: 'blur',
					},
				],
			},
			fileList: [],
			token: '',
			loading: false,
			bLoading: false,
		};
	},
	watch: {
		healthId() {
			if (this.healthId == 0) {
				this.fileList = [];
			} else {
				this.fetchDetail(this.healthId);
			}
		},
		accessToken() {
			this.token = this.accessToken;
		},
	},
	mounted() {
		this.token = this.accessToken;
	},
	methods: {
		handleSuccess(response, file, fileList) {
			var image = {
				name: file.name,
				url: response.data,
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
					if (this.healthId == 0) {
						var pics = [];
						for (let i = 0; i < this.fileList.length; i++) {
							var pic = {
								name: this.fileList[i].name,
								url: this.fileList[i].url,
							};
							pics.push(pic);
						}
						var data = {
							eid: '',
							elder_id: this.form.elder_name,
							time: Date.parse(new Date(this.form.time)) / 1000,
							employee_id: this.form.employee_id,
							hospital: this.form.hospital,
							result: this.form.result,
							pic: pics,
							height: this.form.height,
							weight: this.form.weight,
							temperature: this.form.temperature,
							high_blood_pressure: this.form.high_blood_pressure,
							low_blood_pressure: this.form.low_blood_pressure,
							pulse: this.form.pulse,
							oxygen_saturation_value: this.form.oxygen_saturation_value,
							fasting_glucose: this.form.fasting_glucose,
							postprandial_glucose: this.form.postprandial_glucose,
							cholesterol_total: this.form.cholesterol_total,
							triglycerides: this.form.triglycerides,
							hdlc: this.form.hdlc,
							cdlc: this.form.cdlc,
							uric_acid: this.form.uric_acid,
							qrs_interval: this.form.qrs_interval,
							rr_interval: this.form.rr_interval,
							heart_rate: this.form.heart_rate,
							gp_comment: this.form.gp_comment,
							analytic_result: this.form.analytic_result,
						};
						this.saveHealth(data);
					} else {
						var pics = [];
						for (let i = 0; i < this.fileList.length; i++) {
							var pic = {
								name: this.fileList[i].name,
								url: this.fileList[i].url,
							};
							pics.push(pic);
						}
						var data = {
							eid: this.healthId,
							elder_id: this.form.elder_name,
							time: Date.parse(new Date(this.form.time)) / 1000,
							employee_id: this.form.employee_id,
							hospital: this.form.hospital,
							result: this.form.result,
							pic: pics,
							height: this.form.height,
							weight: this.form.weight,
							temperature: this.form.temperature,
							high_blood_pressure: this.form.high_blood_pressure,
							low_blood_pressure: this.form.low_blood_pressure,
							pulse: this.form.pulse,
							oxygen_saturation_value: this.form.oxygen_saturation_value,
							fasting_glucose: this.form.fasting_glucose,
							postprandial_glucose: this.form.postprandial_glucose,
							cholesterol_total: this.form.cholesterol_total,
							triglycerides: this.form.triglycerides,
							hdlc: this.form.hdlc,
							cdlc: this.form.cdlc,
							uric_acid: this.form.uric_acid,
							qrs_interval: this.form.qrs_interval,
							rr_interval: this.form.rr_interval,
							heart_rate: this.form.heart_rate,
							gp_comment: this.form.gp_comment,
							analytic_result: this.form.analytic_result,
						};
						this.saveHealth(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addHealthFalse');
			this.$parent.infoEmpty();
			this.$refs['form'].resetFields();
			this.fileList = [];
		},
		fetchDetail: async function(id) {
			this.loading = true;
			let url = this.api.elderhealthexaminationsdetail;
			var data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.form.elder_name = res.data.data.elder_id;
					this.form.time = res.data.data.time * 1000;
					this.form.employee_name = res.data.data.employee_name;
					this.form.employee_id = res.data.data.employee_id;
					this.form.hospital = res.data.data.hospital;
					this.form.result = res.data.data.result;
					this.form.height = res.data.data.height;
					this.form.weight = res.data.data.weight;
					this.form.temperature = res.data.data.temperature;
					this.form.high_blood_pressure = res.data.data.high_blood_pressure;
					this.form.low_blood_pressure = res.data.data.low_blood_pressure;
					this.form.pulse = res.data.data.pulse;
					this.form.oxygen_saturation_value = res.data.data.oxygen_saturation_value;
					this.form.fasting_glucose = res.data.data.fasting_glucose;
					this.form.postprandial_glucose = res.data.data.postprandial_glucose;
					this.form.cholesterol_total = res.data.data.cholesterol_total;
					this.form.triglycerides = res.data.data.triglycerides;
					this.form.hdlc = res.data.data.hdlc;
					this.form.cdlc = res.data.data.cdlc;
					this.form.uric_acid = res.data.data.uric_acid;
					this.form.qrs_interval = res.data.data.qrs_interval;
					this.form.rr_interval = res.data.data.rr_interval;
					this.form.heart_rate = res.data.data.heart_rate;
					this.form.gp_comment = res.data.data.gp_comment;
					this.form.analytic_result = res.data.data.analytic_result;
					this.fileList = res.data.data.pics;
					this.$nextTick(() => {
						this.loading = false;
					});
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.loading = false;
							this.hideEditFalse();
						},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.loading = false;
						this.hideEditFalse();
					},
				});
			}
		},
		saveHealth: async function(data) {
			let url = this.api.addelderhealthexaminations;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (this.healthId == 0) {
						this.$notify({
							title: this.message.success,
							message: this.message.addPhyExaRegisterSuccess,
							type: 'success',
						});
					} else {
						this.$notify({
							title: this.message.success,
							message: this.message.changePhyExaRegisterSuccess,
							type: 'success',
						});
					}
					this.$parent.fetchList(1);
					this.bLoading = false;
					this.hideEditFalse();
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
	},
	computed: mapState(['addHealth', 'addHealthEdit', 'accessToken']),
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
.addHealth {
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