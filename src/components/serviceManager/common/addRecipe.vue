<template>
	<div class="addRecipe" v-show="addRecipe">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>食谱</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<el-form-item label="执行时间:" prop="week">
								<el-select v-bind:disabled="recipeId !== 0" v-model="form.week" filterable allow-create clearable placeholder="请选择" @change="fetchTime">
									<el-option
									v-for="(week, key) in weeks"
									:key="key"
									:label="week"
									:value="week * 1">
									</el-option>
								</el-select><b style="color: #606266">（周次）</b>
							</el-form-item>
							<el-form-item label="开始时间:" prop="start_date">
								<el-input disabled v-model="form.start_date"></el-input>
							</el-form-item>
							<el-form-item label="结束时间:" prop="end_date">
								<el-input disabled v-model="form.end_date"></el-input>
							</el-form-item>
							<el-form-item label="设置人:" prop="employee_name">
								<el-input v-model="form.employee_name" disabled></el-input>
							</el-form-item>
							<div class="dateRecipe">
								<el-table
									:data="tableData"
									style="width: 100%">
									<el-table-column
										prop="week"
										label="日期">
									</el-table-column>
									<el-table-column
										v-for="(meal, key) in meals"
										:key="key"
										:label="mealName[meal]">
										<template slot-scope="scope">
											<div v-if="mealName[meal] == '早茶'">
												<p v-for="(fname, key) in scope.row.morningTea" :key="key">{{fname.foodname}}</p>
											</div>
											<div v-if="mealName[meal] == '早餐'">
												<p v-for="(fname, key) in scope.row.breakfast" :key="key">{{fname.foodname}}</p>
											</div>
											<div v-if="mealName[meal] == '午餐'">
												<p v-for="(fname, key) in scope.row.lunch" :key="key">{{fname.foodname}}</p>
											</div>
											<div v-if="mealName[meal] == '下午茶'">
												<p v-for="(fname, key) in scope.row.afternoonTea" :key="key">{{fname.foodname}}</p>
											</div>
											<div v-if="mealName[meal] == '晚餐'">
												<p v-for="(fname, key) in scope.row.dinner" :key="key">{{fname.foodname}}</p>
											</div>
											<div v-if="mealName[meal] == '宵夜'">
												<p v-for="(fname, key) in scope.row.nightSnack" :key="key">{{fname.foodname}}</p>
											</div>
											<el-button type="danger" size="mini" @click="showSelectFood(scope)">+</el-button>
										</template>
									</el-table-column>
								</el-table>
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
	    <v-srecipefood :spicys="spicys" :textures="textures" :tastes="tastes" :diseases="diseases" :foods="foods" :startTime="form.start_date" :endTime="form.end_date" :clickDate="clickDate"></v-srecipefood>
	</div>
</template>

<script>
import localEvent from '@/utils/local';
import { mapState } from 'vuex';
import vSrecipefood from './selectRecipeFood.vue';

export default {
	props: ['recipeId', 'typeId', 'mealName', 'spicys', 'textures', 'tastes', 'diseases', 'meals', 'weeks'],
	data() {
		return {
			form: {
				week: '',
				start_date: '',
				end_date: '',
				employee_name: localEvent.StorageGetter('empName'),
			},
			rules: {
				week: [{ required: true, message: this.message.pleaseInputExeTime, trigger: 'blur' }],
				employee_name: [{ required: true, message: this.message.pleaseInputSettings, trigger: 'blur' }],
			},
			tableData: [],
			row: 0,
			column: 0,
			foods: [],
			weekTime: [],
			loading: false,
			bLoading: false,
			clickDate: '',
		};
	},
	components: {
		vSrecipefood,
	},
	watch: {
		recipeId() {
			if (this.recipeId == 0) {
				this.baseTable();
			} else {
				this.fetchDetail(this.recipeId);
			}
		},
		meals() {
			this.baseTable();
		},
	},
	mounted() {},
	methods: {
		fetchTime(val) {
			if (val) {
				this.fetchWeek(val, 1);
			}
		},
		fetchWeek: async function(val, status) {
			let url = this.api.recipeweek;
			var data = {
				datecount: val,
			};
			const res = await this.$http.post(url, data);
			this.weekTime = res.data.data;
			this.form.start_date = res.data.data[0];
			this.form.end_date = res.data.data[6];
			for (let i = 0; i < this.tableData.length; i++) {
				this.tableData[i]['weekDate'] = res.data.data[i];
			}
			this.$nextTick(() => {
				if (status === 1) {
					this.baseTable();
				}
			});
		},
		baseTable() {
			var that = this;
			that.tableData = [];
			for (var k = 0; k < 7; k++) {
				var data = {};
				for (let n = 0; n < this.meals.length; n++) {
					for (var meal in this.mealName) {
						if (this.meals[n] == meal) {
							if (this.mealName[meal] == this.message.earlyTea) {
								data['morningTea'] = [];
							} else if (this.mealName[meal] == this.message.breakfast) {
								data['breakfast'] = [];
							} else if (this.mealName[meal] == this.message.lunch) {
								data['lunch'] = [];
							} else if (this.mealName[meal] == this.message.afternoonLunch) {
								data['afternoonTea'] = [];
							} else if (this.mealName[meal] == this.message.dinner) {
								data['dinner'] = [];
							} else if (this.mealName[meal] == this.message.nightSnack) {
								data['nightSnack'] = [];
							}
						}
					}
				}
				if (k == 0) {
					data['week'] = this.message.Monday;
					that.tableData.push(data);
				}
				if (k == 1) {
					data['week'] = this.message.Tuesday;
					that.tableData.push(data);
				}
				if (k == 2) {
					data['week'] = this.message.Wednesday;
					that.tableData.push(data);
				}
				if (k == 3) {
					data['week'] = this.message.Thursday;
					that.tableData.push(data);
				}
				if (k == 4) {
					data['week'] = this.message.Friday;
					that.tableData.push(data);
				}
				if (k == 5) {
					data['week'] = this.message.Saturday;
					that.tableData.push(data);
				}
				if (k == 6) {
					data['week'] = this.message.Sunday;
					that.tableData.push(data);
				}
			}
			console.log(this.tableData);
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					if (this.recipeId == 0) {
						var foods = [];
						console.log(this.tableData)
						for (var n = 0; n < this.tableData.length; n++) {
							var food = {};
							if (this.tableData[n].morningTea) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].morningTea.length; i++) {
									arr.push(this.tableData[n].morningTea[i].foodid);
								}
								var foodData = {
									type: 37,
									weekDate: this.tableData[n].weekDate,
									foodId: arr,
								};
								food['morningTea'] = foodData;
							}
							if (this.tableData[n].breakfast) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].breakfast.length; i++) {
									arr.push(this.tableData[n].breakfast[i].foodid);
								}
								var foodData = {
									type: 38,
									weekDate: this.weekTime[n].weekDate,
									foodId: arr,
								};
								food['breakfast'] = foodData;
							}
							if (this.tableData[n].lunch) {
								console.log(this.tableData[n])
								var arr = [];
								for (let i = 0; i < this.tableData[n].lunch.length; i++) {
									arr.push(this.tableData[n].lunch[i].foodid);
								}
								var foodData = {
									type: 39,
									weekDate: this.weekTime[n].weekDate,
									foodId: arr,
								};
								console.log(foodData)
								food['lunch'] = foodData;
							}
							if (this.tableData[n].afternoonTea) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].afternoonTea.length; i++) {
									arr.push(this.tableData[n].afternoonTea[i].foodid);
								}
								var foodData = {
									type: 40,
									weekDate: this.weekTime[n].weekDate,
									foodId: arr,
								};
								food['afternoonTea'] = foodData;
							}
							if (this.tableData[n].dinner) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].dinner.length; i++) {
									arr.push(this.tableData[n].dinner[i].foodid);
								}
								var foodData = {
									type: 41,
									weekDate: this.weekTime[n].weekDate,
									foodId: arr,
								};
								food['dinner'] = foodData;
							}
							if (this.tableData[n].nightSnack) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].nightSnack.length; i++) {
									arr.push(this.tableData[n].nightSnack[i].foodid);
								}
								var foodData = {
									type: 42,
									weekDate: this.weekTime[n].weekDate,
									foodId: arr,
								};
								food['nightSnack'] = foodData;
							}
							foods.push(food);
						}
						var data = {
							type_id: this.typeId,
							week: this.form.week,
							start_date: this.form.start_date,
							end_date: this.form.end_date,
							employee_id: localEvent.StorageGetter('empId'),
							food: foods,
						};
						this.saveRecipe(data);
					} else {
						console.log(this.tableData)
						var foods = [];
						for (var n = 0; n < this.tableData.length; n++) {
							var food = {};
							var num = 0;
							if (this.tableData[n].morningTea) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].morningTea.length; i++) {
									arr.push(this.tableData[n].morningTea[i].foodid);
								}
								var foodData = {
									type: 37,
									weekDate: this.weekTime[n].weekDate,
									foodId: arr,
									id: this.tableData[n].id[num],
								};
								food['morningTea'] = foodData;
								num++;
							}
							if (this.tableData[n].breakfast) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].breakfast.length; i++) {
									arr.push(this.tableData[n].breakfast[i].foodid);
								}
								var foodData = {
									type: 38,
									weekDate: this.tableData[n].weekDate,
									foodId: arr,
									id: this.tableData[n].id[num],
								};
								food['breakfast'] = foodData;
								num++;
							}
							if (this.tableData[n].lunch) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].lunch.length; i++) {
									arr.push(this.tableData[n].lunch[i].foodid);
								}
								var foodData = {
									type: 39,
									weekDate: this.tableData[n].weekDate,
									foodId: arr,
									id: this.tableData[n].id[num],
								};
								food['lunch'] = foodData;
								num++;
							}
							if (this.tableData[n].afternoonTea) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].afternoonTea.length; i++) {
									arr.push(this.tableData[n].afternoonTea[i].foodid);
								}
								var foodData = {
									type: 40,
									weekDate: this.tableData[n].weekDate,
									foodId: arr,
									id: this.tableData[n].id[num],
								};
								food['afternoonTea'] = foodData;
								num++;
							}
							if (this.tableData[n].dinner) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].dinner.length; i++) {
									arr.push(this.tableData[n].dinner[i].foodid);
								}
								var foodData = {
									type: 41,
									weekDate: this.tableData[n].weekDate,
									foodId: arr,
									id: this.tableData[n].id[num],
								};
								food['dinner'] = foodData;
								num++;
							}
							if (this.tableData[n].nightSnack) {
								var arr = [];
								for (let i = 0; i < this.tableData[n].nightSnack.length; i++) {
									arr.push(this.tableData[n].nightSnack[i].foodid);
								}
								var foodData = {
									type: 42,
									weekDate: this.tableData[n].weekDate,
									foodId: arr,
									id: this.tableData[n].id[num],
								};
								food['nightSnack'] = foodData;
								num++;
							}
							foods.push(food);
						}
						var data = {
							id: this.recipeId,
							type_id: this.typeId,
							week: this.form.week,
							start_date: this.form.start_date,
							end_date: this.form.end_date,
							employee_id: localEvent.StorageGetter('empId'),
							food: foods,
						};
						this.editRecipe(data);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('recipeFalse');
			this.$refs['form'].resetFields();
			this.baseTable();
			this.$parent.clean();
		},
		showSelectFood(scope) {
			if (!this.form.week) {
				this.$alert('请先选择执行时间！', '', {
					confirmButtonText: '确定',
					callback: action => {},
				});
				return;
			}
			this.row = scope.$index;
			this.clickDate = this.weekTime[scope.$index];
			switch (scope.column.label) {
				case this.message.earlyTea:
					this.column = 0;
					this.foods = scope.row.morningTea;
					break;
				case this.message.breakfast:
					this.column = 1;
					this.foods = scope.row.breakfast;
					break;
				case this.message.lunch:
					this.column = 2;
					this.foods = scope.row.lunch;
					break;
				case this.message.afternoonLunch:
					this.column = 3;
					this.foods = scope.row.afternoonTea;
					break;
				case this.message.dinner:
					this.column = 4;
					this.foods = scope.row.dinner;
					break;
				default:
					this.column = 5;
					this.foods = scope.row.nightSnack;
			}
			this.$store.dispatch('selectFoodTrue');
		},
		fetchDetail: async function(id) {
			this.loading = true;
			let url = this.api.recipedetail;
			var data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.form.week = res.data.data.week;
					this.fetchWeek(res.data.data.week, 0);
					this.form.start_date = res.data.data.start_date;
					this.form.end_date = res.data.data.end_date;
					var food = res.data.data.food;
					var foodsArr = [];
					for (let i = 0; i < food.length; i++) {
						if (i == 0) {
							var data = {
								week: food[i].week,
								weekDate: food[i].weekDate,
								id: [],
								typeName: [],
							};
							data.id.push(food[i].id);
							if (food[i].suitable_meal == 37) {
								data.typeName.push('morningTea');
								data['morningTea'] = food[i].morningTea;
							} else if (food[i].suitable_meal == 38) {
								data.typeName.push('breakfast');
								data['breakfast'] = food[i].breakfast;
							} else if (food[i].suitable_meal == 39) {
								data.typeName.push('lunch');
								data['lunch'] = food[i].lunch;
							} else if (food[i].suitable_meal == 40) {
								data.typeName.push('afternoonTea');
								data['afternoonTea'] = food[i].afternoonTea;
							} else if (food[i].suitable_meal == 41) {
								data.typeName.push('dinner');
								data['dinner'] = food[i].dinner;
							} else if (food[i].suitable_meal == 42) {
								data.typeName.push('nightSnack');
								data['nightSnack'] = food[i].nightSnack;
							}
							foodsArr.push(data);
						} else {
							var flag = true;
							for (let n = 0; n < foodsArr.length; n++) {
								if (foodsArr[n].week == food[i].week) {
									foodsArr[n].id.push(food[i].id);
									if (food[i].suitable_meal == 37) {
										foodsArr[n].typeName.push('morningTea');
										foodsArr[n]['morningTea'] = food[i].morningTea;
									} else if (food[i].suitable_meal == 38) {
										foodsArr[n].typeName.push('breakfast');
										foodsArr[n]['breakfast'] = food[i].breakfast;
									} else if (food[i].suitable_meal == 39) {
										foodsArr[n].typeName.push('lunch');
										foodsArr[n]['lunch'] = food[i].lunch;
									} else if (food[i].suitable_meal == 40) {
										foodsArr[n].typeName.push('afternoonTea');
										foodsArr[n]['afternoonTea'] = food[i].afternoonTea;
									} else if (food[i].suitable_meal == 41) {
										foodsArr[n].typeName.push('dinner');
										foodsArr[n]['dinner'] = food[i].dinner;
									} else if (food[i].suitable_meal == 42) {
										foodsArr[n].typeName.push('nightSnack');
										foodsArr[n]['nightSnack'] = food[i].nightSnack;
									}
									flag = false;
									continue;
								}
							}
							if (flag) {
								var data = {
									week: food[i].week,
									weekDate: food[i].weekDate,
									id: [],
									typeName: [],
								};
								data.id.push(food[i].id);
								if (food[i].suitable_meal == 37) {
									data.typeName.push('morningTea');
									data['morningTea'] = food[i].morningTea;
								} else if (food[i].suitable_meal == 38) {
									data.typeName.push('breakfast');
									data['breakfast'] = food[i].breakfast;
								} else if (food[i].suitable_meal == 39) {
									data.typeName.push('lunch');
									data['lunch'] = food[i].lunch;
								} else if (food[i].suitable_meal == 40) {
									data.typeName.push('afternoonTea');
									data['afternoonTea'] = food[i].afternoonTea;
								} else if (food[i].suitable_meal == 41) {
									data.typeName.push('dinner');
									data['dinner'] = food[i].dinner;
								} else if (food[i].suitable_meal == 42) {
									data.typeName.push('nightSnack');
									data['nightSnack'] = food[i].nightSnack;
								}
								foodsArr.push(data);
							}
						}
					}
					this.tableData = foodsArr;
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
		saveRecipe: async function(data) {
			let url = this.api.addrecipescheduledschemes;
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
		editRecipe: async function(data) {
			let url = this.api.modifyrecipe;
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
		getFoods(data) {
			switch (this.column) {
				case 0:
					var foods = this.tableData[this.row].morningTea;
					for (let i = 0; i < data.length; i++) {
						var flag = true;
						for (let n = 0; n < foods.length; n++) {
							if (data[i].foodid == foods[n].foodid) {
								flag = false;
								return;
							}
						}
						if (flag) {
							foods.push(data[i]);
						}
					}
					this.tableData[this.row].morningTea = foods;
					break;
				case 1:
					var foods = this.tableData[this.row].breakfast;
					for (let i = 0; i < data.length; i++) {
						var flag = true;
						for (let n = 0; n < foods.length; n++) {
							if (data[i].foodid == foods[n].foodid) {
								flag = false;
								return;
							}
						}
						if (flag) {
							foods.push(data[i]);
						}
					}
					this.tableData[this.row].breakfast = foods;
					break;
				case 2:
					var foods = this.tableData[this.row].lunch;
					for (let i = 0; i < data.length; i++) {
						var flag = true;
						for (let n = 0; n < foods.length; n++) {
							if (data[i].foodid == foods[n].foodid) {
								flag = false;
								return;
							}
						}
						if (flag) {
							foods.push(data[i]);
						}
					}
					this.tableData[this.row].lunch = foods;
					break;
				case 3:
					var foods = this.tableData[this.row].afternoonTea;
					for (let i = 0; i < data.length; i++) {
						var flag = true;
						for (let n = 0; n < foods.length; n++) {
							if (data[i].foodid == foods[n].foodid) {
								flag = false;
								return;
							}
						}
						if (flag) {
							foods.push(data[i]);
						}
					}
					this.tableData[this.row].afternoonTea = foods;
					break;
				case 4:
					var foods = this.tableData[this.row].dinner;
					for (let i = 0; i < data.length; i++) {
						var flag = true;
						for (let n = 0; n < foods.length; n++) {
							if (data[i].foodid == foods[n].foodid) {
								flag = false;
								return;
							}
						}
						if (flag) {
							foods.push(data[i]);
						}
					}
					this.tableData[this.row].dinner = foods;
					break;
				default:
					var foods = this.tableData[this.row].nightSnack;
					for (let i = 0; i < data.length; i++) {
						var flag = true;
						for (let n = 0; n < foods.length; n++) {
							if (data[i].foodid == foods[n].foodid) {
								flag = false;
								return;
							}
						}
						if (flag) {
							foods.push(data[i]);
						}
					}
					this.tableData[this.row].nightSnack = foods;
			}
		},
	},
	computed: mapState(['addRecipe']),
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
	overflow-y: auto;
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
.addRecipe {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 99;
}
.divflex {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>