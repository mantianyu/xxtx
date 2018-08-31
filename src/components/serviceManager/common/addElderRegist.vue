<template>
	<div class="addElderRegist" v-show="addElderRegist">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>评估登记</h5>
	            <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	        		<div style="display: flex;flex-wrap: wrap;">
	        		   	<el-form-item label="老人姓名:" prop="elder_name">
	        		   		<el-select v-bind:disabled="addElderRegistEdit" filterable v-model="form.elder_name" clearable placeholder="请选择老人" style="width: 200px;">
						      	<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
						    </el-select>
					  	</el-form-item>
					  	<el-form-item label="评估日期:" prop="date">
					      	<el-date-picker v-bind:disabled="addElderRegistEdit" type="date" placeholder="选择日期" v-model="form.date" style="width: 200px;"></el-date-picker>
					  	</el-form-item>
						<el-form-item label="评估类型" prop="type">
						    <el-select v-bind:disabled="addElderRegistEdit" v-model="form.type" clearable placeholder="请选择评估类型" style="width: 200px;">
						    	<el-option v-for="(type, key) in evaluateType" :label="type" :value="key * 1" :key="key"></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="评估人" prop="evaluated_by">
						    <el-select v-bind:disabled="addElderRegistEdit" v-model="form.evaluated_by" clearable filterable allow-create default-first-option placeholder="请选择评估人" style="width: 200px;">
						    	<el-option v-for="(person, key) in evaluatePerson" :label="person" :value="key * 1" :key="key"></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="评估地点" prop="evaluated_at">
						    <el-select v-bind:disabled="addElderRegistEdit" v-model="form.evaluated_at" clearable filterable allow-create default-first-option placeholder="请选择评估地点" style="width: 200px;">
						    	<el-option v-for="(position, key) in evaluatePosition" :label="position" :value="key * 1" :key="key"></el-option>
						    </el-select>
						</el-form-item>
					  	<el-form-item label="登记时间:" prop="registration_time">
					      	<el-date-picker v-bind:disabled="addElderRegistEdit" type="datetime" placeholder="选择日期" v-model="form.registration_time" style="width: 200px;"></el-date-picker>
					  	</el-form-item>
				  	</div>
        		   	<el-form-item label="登记人:" prop="employee_name">
				    	<el-input disabled v-model="form.employee_name" style="width: 530px;"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="评估结果:" prop="results">
				    	<el-input v-bind:disabled="addElderRegistEdit" type="textarea" v-model="form.results" style="width: 530px;"></el-input>
				  	</el-form-item>
	                <div v-if="!addElderRegistEdit" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	                	<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
	                    <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
	                </div>
				</el-form>
	        </div>
	    </div>
	</div>
</template>

<script>
import localEvent from '@/utils/local';
import { mapState } from 'vuex';

export default {
	props: ['elderRegistId', 'evaluateType', 'evaluatePerson', 'evaluatePosition', 'elders'],
	data() {
		return {
			form: {
				elder_name: '',
				date: '' + new Date(),
				type: '',
				evaluated_by: '',
				evaluated_at: '',
				registration_time: '' + new Date(),
				employee_name: localEvent.StorageGetter('empName'),
				results: '',
			},
			rules: {
				elder_name: [{ required: true, message: this.message.pleaseChoiceElderName, trigger: 'change' }],
				date: [{ required: true, message: this.message.pleaseChoiceAssessData, trigger: 'change' }],
				type: [{ required: true, message: this.message.pleaseChoiceAssessType, trigger: 'change' }],
				evaluated_by: [{ required: true, message: this.message.pleaseChoiceAssessMan, trigger: 'change' }],
				evaluated_at: [{ required: true, message: this.message.pleaseChoiceAssessPlace, trigger: 'change' }],
				registration_time: [
					{ required: true, message: this.message.pleaseChoiceRegisterTime, trigger: 'change' },
				],
			},
			empId: localEvent.StorageGetter('empId'),
			loading: false,
			bLoading: false,
		};
	},
	watch: {
		elderRegistId() {
			if (this.elderRegistId == 0) {
			} else {
				this.fetchDetail(this.elderRegistId);
			}
		},
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					if (this.elderRegistId == 0) {
						var data = {
							elder_id: this.form.elder_name,
							employee_id: this.empId,
							date: Date.parse(new Date(this.form.date)) / 1000,
							type: this.form.type * 1,
							evaluated_by: this.form.evaluated_by,
							evaluated_at: this.form.evaluated_at,
							registration_time: Date.parse(new Date(this.form.registration_time)) / 1000,
							results: this.form.results,
							status_by: typeof(this.form.evaluated_by) == 'number' ? 0 : 1,
							status_at: typeof(this.form.evaluated_at) == 'number' ? 0 : 1,
						};
						this.saveRegist(data);
					} else {
						var date = new Date(this.form.date);
						var data = {
							id: this.elderRegistId,
							elder_id: this.form.elder_name,
							employee_id: this.empId,
							date: Date.parse(new Date(this.form.date)) / 1000,
							type: this.form.type * 1,
							evaluated_by: this.form.evaluated_by,
							evaluated_at: this.form.evaluated_at,
							registration_time: Date.parse(new Date(this.form.registration_time)) / 1000,
							results: this.form.results,
							status_by: typeof(this.form.evaluated_by) == 'number' ? 0 : 1,
							status_at: typeof(this.form.evaluated_at) == 'number' ? 0 : 1,
						};
						this.saveRegist(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addElderRegistFalse');
			this.$refs['form'].resetFields();
			this.$parent.clean();
		},
		fetchDetail: async function(id) {
			this.loading = true;
			let url = this.api.detailelderregistration;
			var data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.form.elder_name = res.data.data.elder_id;
					this.form.date = res.data.data.date;
					this.form.type = res.data.data.type;
					this.form.evaluated_by = res.data.data.evaluated_by;
					this.form.evaluated_at = res.data.data.evaluated_at;
					this.form.registration_time = res.data.data.registration_time * 1000;
					this.form.employee_name = res.data.data.employee_name;
					this.form.results = res.data.data.results;
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
		saveRegist: async function(data) {
			let url = this.api.addelderregistration;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (this.elderRegistId == 0) {
						this.$notify({
							title: this.message.success,
							message: this.message.addAssessRegistSuccess,
							type: 'success',
						});
					} else {
						this.$notify({
							title: this.message.success,
							message: this.message.changeAssessRegistSuccess,
							type: 'success',
						});
					}
					this.$parent.fetchList(1);
					this.$parent.fetchEvaluatePerson();
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
	computed: mapState(['addElderRegist', 'addElderRegistEdit']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
	height: 510px;
	margin: auto;
	z-index: 130;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 3px 18px #999;
	overflow-y: auto;
	position: fixed;
	top: 50%;
	margin-top: -255px;
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
	position: fixed;
	width: 770px;
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
}
.addElderRegist {
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