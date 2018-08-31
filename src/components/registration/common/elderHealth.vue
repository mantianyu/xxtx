<template>
    <div>
        <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
            <p style="margin-left: 60px;font-size: 20px;">基本健康登记</p>
            <el-button v-if="!editHealth" type="danger" size="small" style="margin-right: 60px;" @click="editElderHealth">编辑</el-button>
            <el-button v-if="editHealth" type="danger" size="small" style="margin-right: 60px;" @click="submitForm('form')">保存</el-button>
        </div>
        <el-form :rules="rules" ref="form" :model="form" label-width="120px">
            <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="老人姓名:" prop="elder_name">
                    <el-input disabled v-model="form.elder_name" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="体检时间:" prop="time">
                    <el-date-picker v-bind:disabled="!editHealth" type="date" placeholder="选择日期" v-model="form.time" style="width: 200px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="体检医院:" prop="hospital">
                    <el-input v-bind:disabled="!editHealth" v-model="form.hospital" style="width: 200px;"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="体检结果:" prop="result">
                <el-input v-bind:disabled="!editHealth" type="textarea" v-model="form.result" style="width: 840px;"></el-input>
            </el-form-item>
            <el-form-item label="图片:">
                <el-upload
                 v-bind:disabled="!editHealth"
                        class="upload-demo"
                        :action="this.api.uploadcareactivities"
                        :with-credentials="true"
                        :headers="{'Authorization': 'Bearer ' + token}"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :file-list="fileList"
                        list-type="picture"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        style="width: 840px;">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="身高:" prop="height">
                    <el-input v-bind:disabled="!editHealth" v-model="form.height" style="width: 200px;">
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="体重:" prop="weight">
                    <el-input v-bind:disabled="!editHealth" v-model="form.weight" style="width: 200px;">
                        <template slot="append">kg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="体温:" prop="temperature">
                    <el-input v-bind:disabled="!editHealth" v-model="form.temperature" style="width: 200px;">
                        <template slot="append">℃</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="高压:" prop="high_blood_pressure">
                    <el-input v-bind:disabled="!editHealth" v-model="form.high_blood_pressure" style="width: 200px;">
                        <template slot="append">mmHg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="低压:" prop="low_blood_pressure">
                    <el-input v-bind:disabled="!editHealth" v-model="form.low_blood_pressure" style="width: 200px;">
                        <template slot="append">mmKg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="脉搏:" prop="pulse">
                    <el-input v-bind:disabled="!editHealth" v-model="form.pulse" style="width: 200px;">
                        <template slot="append">次/分</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="血氧值:" prop="oxygen_saturation_value">
                    <el-input v-bind:disabled="!editHealth" v-model="form.oxygen_saturation_value" style="width: 200px;">
                        <template slot="append">℃</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="空腹血糖:" prop="fasting_glucose">
                    <el-input v-bind:disabled="!editHealth" v-model="form.fasting_glucose" style="width: 200px;">
                        <template slot="append">毫摩尔/升</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="餐后血糖:" prop="postprandial_glucose">
                    <el-input v-bind:disabled="!editHealth" v-model="form.postprandial_glucose" style="width: 200px;">
                        <template slot="append">毫摩尔/升</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="总胆固醇:" prop="cholesterol_total">
                    <el-input v-bind:disabled="!editHealth" v-model="form.cholesterol_total" style="width: 200px;">
                        <template slot="append">mmol/L</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="甘油三酯:" prop="triglycerides">
                    <el-input v-bind:disabled="!editHealth" v-model="form.triglycerides" style="width: 200px;">
                        <template slot="append">mmol/L</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="高密度脂蛋白胆固醇:" prop="hdlc">
                    <el-input v-bind:disabled="!editHealth" v-model="form.hdlc" style="width: 200px;">
                        <template slot="append">mmol/L</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="低密度脂蛋白胆固醇:" prop="cdlc">
                    <el-input v-bind:disabled="!editHealth" v-model="form.cdlc" style="width: 200px;">
                        <template slot="append">mmol/L</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="尿酸:" prop="uric_acid">
                    <el-input v-bind:disabled="!editHealth" v-model="form.uric_acid" style="width: 200px;">
                        <template slot="append">mmol/L</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="qrs间期:" prop="qrs_interval">
                    <el-input v-bind:disabled="!editHealth" v-model="form.qrs_interval" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="rr间期:" prop="rr_interval">
                    <el-input v-bind:disabled="!editHealth" v-model="form.rr_interval" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="心率:" prop="heart_rate">
                    <el-input v-bind:disabled="!editHealth" v-model="form.heart_rate" style="width: 200px;"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="全科医生批注:" prop="gp_comment">
                <el-input v-bind:disabled="!editHealth" type="textarea" v-model="form.gp_comment" style="width: 840px;"></el-input>
            </el-form-item>
            <el-form-item label="医生分析结果:" prop="analytic_result">
                <el-input v-bind:disabled="!editHealth" type="textarea" v-model="form.analytic_result" style="width: 840px;"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import localEvent from '@/utils/local';
import { mapState } from 'vuex';

export default {
	props: ['elderId'],
	data() {
		return {
			form: {
				elder_name: '',
				time: '',
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
			},
			fileList: [],
			token: '',
			elderid: 0,
			editHealth: false,
			eid: 0,
		};
	},
	watch: {
		accessToken() {
			this.token = this.accessToken;
		},
	},
	mounted() {
		this.token = this.accessToken;
		this.fetchDetail();
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
					var pics = [];
					for (let i = 0; i < this.fileList.length; i++) {
						var pic = {
							name: this.fileList[i].name,
							url: this.fileList[i].url,
						};
						pics.push(pic);
					}
					var data = {
						eid: this.eid,
						elder_id: this.elderId,
						time: Date.parse(new Date(this.form.time)) / 1000,
						employee_id: localEvent.StorageGetter('empId'),
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
					console.log('error submit!!');
					return false;
				}
			});
		},
		saveHealth: async function(data) {
			let url = this.api.addelderhealthexaminations;
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				this.editHealth = false;
			} else {
				this.$alert(res.data.data, this.message.wrong, {
					confirmButtonText: this.message.confirm,
					callback: action => {},
				});
			}
		},
		editElderHealth() {
			this.editHealth = true;
		},
		fetchDetail: async function() {
			this.$parent.$parent.$parent.$parent.loadingTrue();
			let url = this.api.elderhealthevaluations;
			let data = {
				elder_id: this.elderId,
			};
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				this.form.elder_name = res.data.data.name;
				this.form.time = res.data.data.time ? res.data.data.time : '';
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
				this.eid = res.data.data.eid;
				this.$parent.$parent.$parent.$parent.loadingFalse();
			} else {
				this.$parent.$parent.$parent.$parent.loadingFalse();
			}
		},
	},
	computed: mapState(['accessToken']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
	height: 80%;
	margin: auto;
	z-index: 130;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 3px 18px #999;
	overflow-y: auto;
}

.pop-top {
	border-bottom: 1px #e5e5e5 solid;
	padding: 0 20px;
	overflow: hidden;
	background: #f2f2f2;
	border-top-right-radius: 6px;
	border-top-left-radius: 6px;
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
}

.addHealth {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.2);
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.divflex {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>