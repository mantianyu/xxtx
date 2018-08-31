<template>
    <div class="changebed">
        <el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>床位类型</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="140px" class="demo-ruleForm">
                            <div style="display: flex;flex-wrap: wrap;">
                                <el-form-item label="促销价:" prop="market_price">
                                    <el-input v-model="form.market_price" type="number" style="width: 200px"></el-input>
                                </el-form-item>
                                <el-form-item label="库存:" prop="rest_count">
                                    <el-input v-model="form.rest_count" type="number" style="width: 200px"></el-input>   
                                </el-form-item>
                                <el-form-item label="图片:">
                                    <el-upload class="upload-demo" :action="this.api.uploadhotelimage" :limit="1" :with-credentials="true" :headers="{'Authorization': 'Bearer ' + token}" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList" style="width: 520px;" list-type="picture">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
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
	props: ['scope'],
	data() {
		let limitPrice = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入价格'));
			} else {
				if (value <= 0) {
					callback(new Error('价格不能小于0'));
				}
				callback();
			}
		};
		let limitCount = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入库存'));
			} else {
				if (value < 0) {
					callback(new Error('库存不能小于0'));
				}
				callback();
			}
		};
		return {
			form: {
				market_price: '',
				rest_count: '',
			},
			rules: {
				market_price: [{ validator: limitPrice, trigger: 'blur' }],
				rest_count: [{ validator: limitCount, trigger: 'blur' }],
			},
			loading: false,
			bLoading: false,
			type: [],
			fileList: [],
			token: "",
		};
	},
	watch: {
		accessToken() {
			this.token = this.accessToken;
		},
	},
	mounted() {
		this.token = this.accessToken;
		if (this.scope !== 0) {
			this.form.id = this.scope.id;
			this.form.market_price = this.scope.bed_monthly_market_price;
			this.form.rest_count = this.scope.rest_count;
			this.fileList = [{
				name: this.scope.name,
				url: this.scope.img
			}]
		}
	},
	methods: {
		handleSuccess(response, file, fileList) {
			var image = {
				name: this.scope.name,
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
					var data = {
						id: this.form.id,
						market_price: this.form.market_price,
						rest_count: this.form.rest_count,
						img: this.fileList[0].url
					};
					this.savebedtype(data);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$parent.showChangeBed = false;
		},
		savebedtype: async function(data) {
			let url = this.api.updatebedtype;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
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
.changebed {
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
