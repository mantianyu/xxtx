<template>
	<div class="addStaff">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>员工</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="140px" class="demo-ruleForm">
              <div style="display: flex;flex-wrap: wrap;">
                <div>
                  <el-form-item label="员工姓名:" prop="name">
                    <el-select v-bind:disabled="this.scope !== 0" v-model="form.name" style="width: 200px" placeholder="请选择员工" @change="changeEmp">
                      <el-option v-for="(emp, key) in empArr" :key="key" :label="emp.name" :value="emp.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="展示名称:" prop="nickname">
                    <el-input v-model="form.nickname" style="width: 200px"></el-input>
                  </el-form-item>
                  <el-form-item label="展示职位:" prop="position">
                    <el-select v-model="form.position" style="width: 200px" placeholder="请选择展示职位">
                      <el-option label="护工" :value="int0"></el-option>
                      <el-option label="院长" :value="int1"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
								<el-form-item label="展示头像:">
									<el-upload class="avatar-uploader" :action="this.api.uploadhotelimage" :headers="{'Authorization': 'Bearer ' + token}" :show-file-list="false" :on-success="handleAvatarSuccess">
										<img v-if="photo" :src="photo" class="avatar">
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
								</el-form-item>
                <el-form-item label="员工简介:" prop="brief_intro">
                <el-input v-model="form.brief_intro" type="textarea" style="width: 540px;"></el-input>
                </el-form-item>
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
import localEvent from '@/utils/local';
import { mapState } from 'vuex';

export default {
	props: ['scope', 'empArr'],
	data() {
		return {
			form: {
				name: '',
				nickname: '',
				position: '',
				brief_intro: '',
			},
			rules: {
				name: [{ required: true, message: '请选择员工', trigger: 'change' }],
				nickname: [{ required: true, message: '请输入展示名称', trigger: 'blur' }],
				position: [{ required: true, message: '请选择展示职位', trigger: 'change' }],
				brief_intro: [{ required: true, message: '请输入员工简介', trigger: 'blur' }],
			},
			loading: false,
			bLoading: false,
			token: localEvent.StorageGetter('accessToken'),
			photo: '',
			int0: 0,
			int1: 1,
		};
	},
	watch: {
		accessToken() {
			this.token = this.accessToken;
		},
	},
	mounted() {
		if (this.scope !== 0) {
			this.form.name = this.scope.name;
			this.form.nickname = this.scope.nickname;
			this.form.position = this.scope.position;
			this.form.brief_intro = this.scope.brief_intro;
			this.photo = this.scope.head;
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
					if (this.scope !== 0) {
						var data = {
							id: this.scope.id,
							nickname: this.form.nickname,
							position: this.form.position,
							brief_intro: this.form.brief_intro,
							head: this.photo,
						};
						this.editStaff(data);
					} else {
						var data = {
							user_id: this.form.name,
							nickname: this.form.nickname,
							position: this.form.position,
							brief_intro: this.form.brief_intro,
							head: this.photo,
						};
						this.saveStaff(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$parent.showAddStaff = false;
		},
		saveStaff: async function(data) {
			let url = this.api.storenursingworker;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.$parent.fetchList(1);
					this.$parent.fetchEmp();
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
		editStaff: async function(data) {
			let url = this.api.nursingworkerstore;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.$parent.fetchList(1);
					this.$parent.fetchEmp();
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
		changeEmp(val) {
			this.fetchFlag(val);
		},
		fetchFlag: async function(val) {},
	},
	computed: mapState(['accessToken']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
	height: 500px;
	margin: auto;
	z-index: 130;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 3px 18px #999;
	position: fixed;
	top: 50%;
	margin-top: -250px;
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
.addStaff {
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