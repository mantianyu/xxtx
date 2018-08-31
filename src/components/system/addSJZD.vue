<template>
	<div class="addSJZD" v-show="addSJZD">
		<div class="pop">
	        <div class="pop-top">
	            <h5>添加字典项</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" @submit.native.prevent>
        		   	<el-form-item label="字典项名称:" prop="name">
				    	<el-input v-model="form.name"></el-input>
				  	</el-form-item>
	                <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	                	<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
	                    <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
	                </div>
				</el-form>
	        </div>
	    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	props: ['name', 'id', 'groupId'],
	data() {
		return {
			form: {
				name: '',
			},
			rules: {
				name: [{ required: true, message: this.message.pleaseInputDictionary, trigger: 'blur' }],
			},
			bLoading: false,
		};
	},
	watch: {
		name() {
			this.form.name = this.name;
		},
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					if (this.groupId) {
						var data = {
							group: this.groupId,
							name: this.form.name,
						};
						this.save(data);
						return;
					}
					if (this.name == '') {
						var data = {
							group: this.$route.params.group,
							name: this.form.name,
						};
						this.save(data);
					} else {
						var data = {
							id: this.id,
							name: this.form.name,
						};
						this.update(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addSJZDFalse');
			this.$refs['form'].resetFields();
			this.$parent.clean();
		},
		save: async function(data) {
			let url = this.api.save;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (this.groupId) {
            this.$parent.fetchVision();
            this.$parent.getDisId(res.data.data.id);
						this.bLoading = false;
						this.hideEditFalse();
					} else {
						this.$parent.fetchList();
						this.bLoading = false;
						this.hideEditFalse();
					}
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
		update: async function(data) {
			let url = this.api.update;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.$parent.fetchList();
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
	computed: mapState(['addSJZD']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 600px;
	height: 265px;
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
.addSJZD {
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