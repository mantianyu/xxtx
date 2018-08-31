<template>
	<div class="addHLXMEdit" v-if="addHLXMEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>护理项目</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="100px" class="demo-ruleForm">
							<el-form-item label="项目名称:" prop="name">
								<el-input v-model="form.name"></el-input>
							</el-form-item>
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="所属类别:" prop="type_id">
									<el-select v-model="form.type_id" clearable placeholder="请选择所属类别">
										<el-option v-for="(type, key) in typeLists" :label="type.name" :value="type.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="nursId != 0" label="任务类型:" prop="task_type" label-width="160px">
									<el-select v-model="form.task_type" clearable placeholder="请选择所属类别">
										<el-option label="一般任务" :value="mode1"></el-option>
										<el-option label="关键任务" :value="mode2"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="收费方式:" prop="price_mode">
									<el-radio-group v-model="form.price_mode">
										<el-radio v-for="(mode, key) in modes" :key="key" :label="key">{{mode}}</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="项目收费:" prop="price">
									<el-input v-model="form.price" type="number" min="0">
										<template slot="append">元</template>
									</el-input>
								</el-form-item>
								<el-form-item label="所需时间:" prop="nursing_time">
									<el-input v-model="form.nursing_time" type="number" min="1">
										<template slot="append">分钟</template>
									</el-input>
								</el-form-item>
							</div>
							<el-form-item label="项目简介:" prop="introduction">
								<el-input v-model="form.introduction" type="textarea"></el-input>
							</el-form-item>
							<el-form-item label="积分:" prop="integral">
								<el-input v-model="form.integral" type="number" :min="1"></el-input>
							</el-form-item>
							<el-form-item label="图片:">
								<el-upload class="upload-demo" :action="this.api.uploadnursingitem" :with-credentials="true" :headers="{'Authorization': 'Bearer ' + token}" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList" style="width: 520px;" list-type="picture">
									<el-button size="small" type="primary">点击上传</el-button>
									<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
								</el-upload>
							</el-form-item>
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
import localEvent from '@/utils/local';
import { mapState } from 'vuex';

export default {
	props: ['nursId', 'typeLists'],
	data() {
		return {
			form: {
				name: '',
				type_id: '',
				task_type: '',
				price_mode: '',
				price: '',
				nursing_time: '',
				introduction: '',
				integral: '',
			},
			rules: {
				name: [{ required: true, message: this.message.pleaseInputProName, trigger: 'blur' }],
				type_id: [{ required: true, message: this.message.pleaseChoiceType, trigger: 'change' }],
				price_mode: [{ required: true, message: this.message.pleaseChoiceChargeType, trigger: 'change' }],
				price: [{ required: true, message: this.message.pleaseInputProMoney, trigger: 'blur' }],
				nursing_time: [{ required: true, message: this.message.pleaseInputNeedTime, trigger: 'blur' }],
			},
			modes: [this.message.times, this.message.days, this.message.weeks, this.message.months, this.message.years],
			mode1: 0,
			mode2: 1,
			types: [],
			loading: false,
			bLoading: false,
			fileList: [],
			token: localEvent.StorageGetter('accessToken'),
		};
	},
	watch: {
		nursId() {
			if (this.nursId == 0) {
			} else {
				this.fetchDetail(this.nursId);
			}
		},
		accessToken() {
			this.token = this.accessToken;
		},
	},
	mounted() {},
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
					if (this.nursId == 0) {
						var data = {
							name: this.form.name,
							type_id: this.form.type_id,
							price_mode: this.form.price_mode,
							price: this.form.price,
							nursing_time: this.form.nursing_time,
							introduction: this.form.introduction,
						};
						this.saveNursItem(data);
					} else {
						var data = {
							id: this.nursId,
							name: this.form.name,
							type_id: this.form.type_id,
							task_type: this.form.task_type,
							price_mode: this.form.price_mode,
							price: this.form.price,
							nursing_time: this.form.nursing_time,
							introduction: this.form.introduction,
						};
						this.saveNursItem(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addHLXMEditFalse');
			this.$parent.$parent.$parent.$parent.clean();
			this.$refs['form'].resetFields();
		},
		fetchDetail: async function(id) {
			this.loading = true;
			let url = this.api.nursingitemsdetail;
			var data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.form.name = res.data.data.name;
					this.form.type_id = res.data.data.type_id;
					this.form.task_type = res.data.data.task_type;
					this.form.price_mode = res.data.data.price_mode;
					this.form.price = res.data.data.price;
					this.form.nursing_time = res.data.data.nursing_time;
					this.form.introduction = res.data.data.introduction;
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
		saveNursItem: async function(data) {
			let url = this.api.addnursingitems;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (this.nursId == 0) {
						this.$notify({
							title: this.message.success,
							message: this.message.addNurseProSuccess,
							type: 'success',
						});
					} else {
						this.$notify({
							title: this.message.success,
							message: this.message.changeNurseProSuccess,
							type: 'success',
						});
					}
					this.$parent.$parent.$parent.$parent.fetchList(1);
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
	computed: mapState(['addHLXMEdit', 'accessToken']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
	height: 530px;
	margin: auto;
	z-index: 130;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 3px 18px #999;
	position: fixed;
	top: 50%;
	margin-top: -265px;
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
.addHLXMEdit {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}
.divflex {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>