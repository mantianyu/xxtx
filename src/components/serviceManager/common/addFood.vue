<template>
	<div class="addFood">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>食物</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="140px" class="demo-ruleForm">
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="食物名称:" prop="fname">
                  <el-input v-model="form.fname" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="食物价格:" prop="fprice">
                  <el-input v-model="form.fprice" type="number" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="食物说明:" prop="describe">
                  <el-input v-model="form.describe" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="食物类别:" prop="fyid">
                  <el-select v-model="form.fyid" clearable placeholder="请选择食物类别" style="width: 200px">
                    <el-option v-for="(food, key) in foodType" :label="food.name" :value="food.id" :key="key"></el-option>
                  </el-select>
                </el-form-item>
              </div>
							<el-form-item label="食物禁忌症" prop="contraindications">
								<el-checkbox-group v-model="form.contraindications">
									<el-checkbox v-for="(disease, key) in diseases" :label="key * 1" :key="key" name="contraindications">{{ disease }}</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="辣味:" prop="spicylevel">
                  <el-select v-model="form.spicylevel" clearable placeholder="请选择辣味" style="width: 200px">
                    <el-option v-for="(spicy, key) in spicys" :label="spicy" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="口感:" prop="texture">
                  <el-select v-model="form.texture" clearable placeholder="请选择口感" style="width: 200px">
                    <el-option v-for="(texture, key) in textures" :label="texture" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="口味:" prop="taste">
                  <el-select v-model="form.taste" clearable placeholder="请选择口味" style="width: 200px">
                    <el-option v-for="(taste, key) in tastes" :label="taste" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否可点:" prop="isdot">
                  <el-select v-model="form.isdot" clearable placeholder="请选择是否可点" style="width: 200px">
                    <el-option label="不可" :value="int0"></el-option>
                    <el-option label="可以" :value="int1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="可点餐开始日期:" prop="orderstartdate">
                  <el-date-picker type="date" placeholder="选择日期" v-model="form.orderstartdate" style="width: 200px"></el-date-picker>
                </el-form-item>
                <el-form-item label="可点餐截至日期:" prop="orderenddate">
                  <el-date-picker type="date" placeholder="选择日期" v-model="form.orderenddate" style="width: 200px"></el-date-picker>
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
export default {
	props: ['foodId', 'fyid', 'spicys', 'textures', 'tastes', 'diseases'],
	data() {
		var validateTime = (rule, value, callback) => {
			if (Date.parse(new Date(this.form.orderstartdate)) > Date.parse(new Date(this.form.orderenddate))) {
				callback(new Error('开始时间不能大于截止时间'));
			}
			callback();
		};
		var fpriceCheck = (rule, value, callback) => {
			if (value === '') {
				return callback(new Error(this.message.pleaseInputFoodPrice));
			} else if (value < 0) {
				callback(new Error('只能输入正数'));
			} else {
				callback();
			}
		};
		return {
			form: {
				fname: '',
				fprice: '',
				fyid: '',
				spicylevel: '',
				texture: '',
				taste: '',
				isdot: '',
				orderstartdate: '',
				orderenddate: '',
				contraindications: [],
				describe: '',
			},
			rules: {
				fname: [{ required: true, message: this.message.pleaseInputFoodName, trigger: 'blur' }],
				fyid: [{ required: true, message: this.message.pleaseChoiceFoodType, trigger: 'change' }],
				fprice: [{ required: true, validator: fpriceCheck, trigger: 'blur' }],
				orderstartdate: [{ validator: validateTime, trigger: 'change' }],
				orderenddate: [{ validator: validateTime, trigger: 'change' }],
			},
			foodType: [],
			loading: false,
			int0: 0,
			int1: 1,
			bLoading: false,
		};
	},
	mounted() {
		this.fetchFoodTypeList();
		if (this.foodId !== 0) {
			this.fetchDetail(this.foodId);
		}
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					if (this.foodId == 0) {	
						var data = {
							fyid: this.form.fyid,
							fname: this.form.fname,
							fprice: this.form.fprice,
							spicylevel: this.form.spicylevel,
							texture: this.form.texture,
							taste: this.form.taste,
							isdot: this.form.isdot,
							orderstartdate: this.form.orderstartdate
								? Date.parse(new Date(this.form.orderstartdate)) / 1000
								: '',
							orderenddate: this.form.orderenddate
								? Date.parse(new Date(this.form.orderenddate)) / 1000
								: '',
							contraindications: this.form.contraindications,
							describe: this.form.describe,
						};
						this.saveFood(data);
					} else {
						var data = {
							fid: this.foodId,
							fyid: this.form.fyid,
							fname: this.form.fname,
							fprice: this.form.fprice,
							spicylevel: this.form.spicylevel,
							texture: this.form.texture,
							taste: this.form.taste,
							isdot: this.form.isdot,
							orderstartdate: this.form.orderstartdate ? Date.parse(new Date(this.form.orderstartdate)) / 1000 : '',
							orderenddate: this.form.orderenddate ? Date.parse(new Date(this.form.orderenddate)) / 1000 : '',
							contraindications: this.form.contraindications,
							describe: this.form.describe,
						};
						this.saveFood(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addFoodFalse');
			this.$parent.$parent.$parent.$parent.clean();
			this.$refs['form'].resetFields();
		},
		fetchDetail: async function(id) {
			this.loading = true;
			let url = this.api.foodinfo;
			var data = {
				fid: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.form.fname = res.data.data.foodname;
					this.form.fprice = res.data.data.foodprice;
					this.form.spicylevel = res.data.data.spicylevel;
					this.form.fyid = res.data.data.fyid;
					this.form.texture = res.data.data.texture;
					this.form.taste = res.data.data.taste;
					this.form.isdot = res.data.data.canorder;
					this.form.orderstartdate = res.data.data.orderstartdate ? res.data.data.orderstartdate * 1000 : '';
					this.form.orderenddate = res.data.data.orderenddate ? res.data.data.orderenddate * 1000 : '';
					var contraindications = res.data.data.contraindications;
					this.form.contraindications = [];
					for (let i = 0; i < contraindications.length; i++) {
						this.form.contraindications.push(contraindications[i] * 1);
					}
					this.form.describe = res.data.data.introduction;
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
		saveFood: async function(data) {
			let url = this.api.food;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (this.foodId == 0) {
						this.$notify({
							title: this.message.success,
							message: this.message.addFoodSuccess,
							type: 'success',
						});
					}
					this.$parent.$parent.$parent.$parent.fetchList('', 1);
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
		fetchFoodTypeList: async function() {
			let url = this.api.foodtypelist;
			var data = {};
			const res = await this.$http.post(url, data);
			this.foodType = res.data.data;
		},
	},
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
.addFood {
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