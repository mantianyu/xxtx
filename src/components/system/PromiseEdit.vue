<template>
	<div class="promiseeditBG" v-show="promiseEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
      <div class="pop-top">
        <h5>添加权限组</h5>
        <span class="pop-close" style="margin-right: 15px;" @click="hidePromiseEdit"><i class="el-icon-close"></i></span>
      </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
      <div class="pop-content">
          <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="权限组名：" prop="promiseName">
                <el-input v-model="ruleForm.promiseName"></el-input>
            </el-form-item>
            <el-form-item label="首页" prop="type1">
              <el-checkbox-group v-model="ruleForm.type1">
                  <el-checkbox v-for="(promise, key) in promiseArr1" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="登记管理" prop="type2">
              <el-checkbox-group v-model="ruleForm.type2">
                  <el-checkbox v-for="(promise, key) in promiseArr2" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="服务管理" prop="type3">
              <el-checkbox-group v-model="ruleForm.type3">
                  <el-checkbox v-for="(promise, key) in promiseArr3" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="日常事务" prop="type4">
              <el-checkbox-group v-model="ruleForm.type4">
                  <el-checkbox v-for="(promise, key) in promiseArr4" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="护理管理" prop="type5">
              <el-checkbox-group v-model="ruleForm.type5">
                  <el-checkbox v-for="(promise, key) in promiseArr5" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="费用管理" prop="type6">
              <el-checkbox-group v-model="ruleForm.type6">
                  <el-checkbox v-for="(promise, key) in promiseArr6" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="统计分析" prop="type7">
              <el-checkbox-group v-model="ruleForm.type7">
                  <el-checkbox v-for="(promise, key) in promiseArr7" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="系统管理" prop="type8">
              <el-checkbox-group v-model="ruleForm.type8">
                  <el-checkbox v-for="(promise, key) in promiseArr8" :label="promise.id" name="type" :key="key">{{promise.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
              <el-button type="info" size="medium" @click="hidePromiseEdit">取消</el-button>
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('ruleForm')">确认</el-button>
            </div>
        </el-form>
      </div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	props: ['roleid'],
	data() {
		var validatepromiseName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error(this.message.pleaseInputLimitName));
			} else if (value.length < 4 || value.length > 50) {
				callback(new Error(this.message.limitNameWarning));
			} else {
				callback();
			}
		};
		return {
			ruleForm: {
				promiseName: '',
				type1: [],
				type2: [],
				type3: [],
				type4: [],
				type5: [],
				type6: [],
				type7: [],
				type8: [],
			},
			rules: {
				promiseName: [{ required: true, validator: validatepromiseName, trigger: 'blur' }],
			},
			promiseArr1: [],
			promiseArr2: [],
			promiseArr3: [],
			promiseArr4: [],
			promiseArr5: [],
			promiseArr6: [],
			promiseArr7: [],
			promiseArr8: [],
			typeId1: 0,
			typeId2: 0,
			typeId3: 0,
			typeId4: 0,
			typeId5: 0,
			typeId6: 0,
			typeId7: 0,
			typeId8: 0,
			bLoading: false,
			loading: false,
		};
	},
	watch: {
		roleid() {
			if (this.roleid != 0) {
				this.promiseInfo(this.roleid);
			}
		},
	},
	mounted() {
		this.fetchMenu();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					var menupermission = [
						{ id: this.typeId1, child: this.ruleForm.type1 },
						{ id: this.typeId2, child: this.ruleForm.type2 },
						{ id: this.typeId3, child: this.ruleForm.type3 },
						{ id: this.typeId4, child: this.ruleForm.type4 },
						{ id: this.typeId5, child: this.ruleForm.type5 },
						{ id: this.typeId6, child: this.ruleForm.type6 },
						{ id: this.typeId7, child: this.ruleForm.type7 },
						{ id: this.typeId8, child: this.ruleForm.type8 },
					];
					if (this.roleid == 0) {
						const data = {
							rolename: this.ruleForm.promiseName,
							menupermission: menupermission,
						};
						this.savePromise(data);
					} else {
						const data = {
							rolename: this.ruleForm.promiseName,
							menupermission: menupermission,
							roleid: this.roleid,
						};
						this.savePromise(data);
					}
				} else {
					return false;
				}
			});
		},
		savePromise: async function(data) {
			let url = this.api.userrole;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (this.roleid == 0) {
						this.$notify({
							title: this.message.success,
							message: this.message.addSuccess,
							type: 'success',
						});
					} else {
						this.$notify({
							title: this.message.success,
							message: this.message.changeSuccess,
							type: 'success',
						});
					}
					this.hidePromiseEdit();
					this.bLoading = false;
					this.$parent.PromiseList();
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
		hidePromiseEdit() {
			this.$store.dispatch('promiseEditClose');
			this.$refs['ruleForm'].resetFields();
			this.$parent.clean();
		},
		fetchMenu: async function() {
			let url = this.api.menu;
			const data = {};
			const res = await this.$http.post(url, data);
			var Arr = res.data.data;
			this.promiseArr1 = res.data.data[0].child;
			this.promiseArr2 = res.data.data[1].child;
			this.promiseArr3 = res.data.data[2].child;
			this.promiseArr4 = res.data.data[3].child;
			this.promiseArr5 = res.data.data[4].child;
			this.promiseArr6 = res.data.data[5].child;
			this.promiseArr7 = res.data.data[6].child;
			this.promiseArr8 = res.data.data[7].child;
			this.typeId1 = res.data.data[0].id;
			this.typeId2 = res.data.data[1].id;
			this.typeId3 = res.data.data[2].id;
			this.typeId4 = res.data.data[3].id;
			this.typeId5 = res.data.data[4].id;
			this.typeId6 = res.data.data[5].id;
			this.typeId7 = res.data.data[6].id;
			this.typeId8 = res.data.data[7].id;
		},
		promiseInfo: async function(roleid) {
			this.loading = true;
			let url = this.api.userroleinfo;
			var data = {
				roleid: roleid,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.ruleForm.promiseName = res.data.data.name;
					const permissions = res.data.data.permissions;
					if (permissions) {
						if (permissions[0].child) {
							this.ruleForm.type1 = permissions[0].child;
						}
						if (permissions[1].child) {
							this.ruleForm.type2 = permissions[1].child;
						}
						if (permissions[2].child) {
							this.ruleForm.type3 = permissions[2].child;
						}
						if (permissions[3].child) {
							this.ruleForm.type4 = permissions[3].child;
						}
						if (permissions[4].child) {
							this.ruleForm.type5 = permissions[4].child;
						}
						if (permissions[5].child) {
							this.ruleForm.type6 = permissions[5].child;
						}
						if (permissions[6].child) {
							this.ruleForm.type7 = permissions[6].child;
						}
						if (permissions[7].child) {
							this.ruleForm.type8 = permissions[7].child;
						}
					}
					this.$nextTick(() => {
						this.loading = false;
					});
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.loading = false;
						},
					});
				}
			} catch (error) {
				console.log(error);
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.loading = false;
					},
				});
			}
		},
	},
	computed: mapState(['promiseEdit']),
};
</script>

<style scoped>
.promiseeditBG {
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
.pop {
	display: block;
	width: 900px;
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
	margin-left: -450px;
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
.pop-foot {
	border-top: 1px #e5e5e5 solid;
	text-align: center;
}
.pop-cancel,
.pop-ok {
	margin: 20px 10px 0;
	border: none;
	border-radius: 4px;
	background-color: #ff8777;
	color: #fff;
	cursor: pointer;
	min-width: 90px;
	line-height: 40px;
}
.pop-cancel {
	background: #b5b5b5;
}
.pop-content {
	padding: 40px;
	margin-top: 25px;
	padding-top: 0;
}
</style>