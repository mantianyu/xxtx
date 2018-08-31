<template>
	<div class="selectFood" v-show="selectFood">
		<div class="pop">
	        <div class="pop-top">
	            <h5>添加食物</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="60px" class="demo-ruleForm">
					<el-form-item label="食物名称" prop="foodname" style="margin: 0;" label-width="70px">
					    <el-input type="text" v-model="form.foodname" size="small" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="食物禁忌症" label-width="84px" prop="contraindications">
					    <el-checkbox-group v-model="form.contraindications">
					      	<el-checkbox v-for="(disease, key) in diseases" :label="key * 1" :key="key" name="contraindications">{{ disease }}</el-checkbox>
					    </el-checkbox-group>
					</el-form-item>
					<div style="display: flex;height: 40px;">
						<el-form-item label="辣味:" prop="spicylevel">
						    <el-select v-model="form.spicylevel" clearable placeholder="请选择辣味">
						      	<el-option v-for="(spicy, key) in spicys" :label="spicy" :value="key * 1" :key="key"></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="口感:" prop="texture">
						    <el-select v-model="form.texture" clearable placeholder="请选择口感">
						      	<el-option v-for="(texture, key) in textures" :label="texture" :value="key * 1" :key="key"></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="口味:" prop="taste">
						    <el-select v-model="form.taste" clearable placeholder="请选择口味">
						      	<el-option v-for="(taste, key) in tastes" :label="taste" :value="key * 1" :key="key"></el-option>
						    </el-select>
						</el-form-item>
	                    <el-button type="danger" size="medium" style="margin-left: 30px;" @click="submitForm('form')">查询</el-button>
					</div>
				</el-form>
	        </div>
	        <el-table
			    :data="tableData"
			    stripe
			    style="width: 100%">
			    <el-table-column
			      type="index"
			      width="50">
			    </el-table-column>
			    <el-table-column
			      prop="foodname"
			      label="食物名称">
			    </el-table-column>
			    <el-table-column
			      prop="foodprice"
			      label="食物价格">
			    </el-table-column>
			    <el-table-column
			      label="操作">
			      	<template slot-scope="scope">
		          		<el-input-number size="mini" :min="0" :max="99" v-model="scope.row.num" @change="handleChange(scope)"></el-input-number>
		        	</template>
			    </el-table-column>
			</el-table>
			<div style="margin-top: 30px;margin-left: 20px;display: flex;align-items: center;justify-content: flex-end;">
				<div style="display: flex;margin-right: 20px;">
					<el-pagination
					  background
					  @current-change="handleCurrentChange"
					  layout="prev, pager, next"
					  :total="total">
					</el-pagination>
				</div>
		    </div>
            <div class="login-btn" style="display: flex;align-items:center;justify-content:center;padding-top: 28px;margin-bottom: 20px;padding-bottom: 20px;">
            	<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
                <el-button type="danger" size="medium" style="margin-left: 30px;" @click="postFoods">确认</el-button>
            </div>
	    </div>
	</div>
</template>

<script>
import localEvent from '@/utils/local';
import { mapState } from 'vuex';

export default {
	props: ['mealName', 'spicys', 'textures', 'tastes', 'diseases', 'Foods', 'tableDatas', 'eattime', 'addOrder'],
	data() {
		return {
			form: {
				foodname: '',
				contraindications: [],
				spicylevel: '',
				texture: '',
				taste: '',
			},
			rules: {},
			tableData: [],
			total: 0,
			last_page: 0,
			selectFoods: [],
			searchData: {
				canorder: 1,
				time: Date.parse(new Date(this.eattime)) / 1000,
			},
		};
	},
	watch: {
		addOrder() {
			if (this.addOrder) {
				this.selectFoods = [];
			}
		},
		tableDatas() {
			this.tableData = this.tableDatas;
		},
		searchData() {
			this.fetchList(1);
		},
		eattime() {
			this.fetchList(1);
		},
	},
	mounted() {
		this.fetchList(1);
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					var data = {
						foodname: this.form.foodname,
						contraindications: this.form.contraindications,
						spicylevel: this.form.spicylevel,
						texture: this.form.texture,
						taste: this.form.taste,
					};
					data['canorder'] = 1;
					data['time'] = Date.parse(new Date(this.eattime)) / 1000;
					this.searchData = data;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handleChange(scope) {
			var isOrder = true;
			if (this.selectFoods.length == 0 && scope.row.num != 0) {
				this.selectFoods.push(scope.row);
			} else {
				if (scope.row.num == 0) {
					for (let n = 0; n < this.selectFoods.length; n++) {
						if (this.selectFoods[n].foodid == scope.row.foodid) {
							this.selectFoods.splice(n, 1);
							break;
						}
					}
				} else {
					for (let n = 0; n < this.selectFoods.length; n++) {
						if (this.selectFoods[n].foodid == scope.row.foodid) {
							this.selectFoods[n].num = scope.row.num;
							isOrder = false;
							break;
						}
					}
					if (isOrder) {
						this.selectFoods.push(scope.row);
					}
				}
			}
		},
		handleCurrentChange(val) {
			this.fetchList(val);
		},
		hideEditFalse() {
			this.$store.dispatch('selectFoodFalse');
			this.$refs['form'].resetFields();
		},
		fetchList: async function(val) {
			let url = this.api.foodlist + '?page=' + val;
			let data = this.searchData;
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				this.tableData = [];
				var foodLists = res.data.data.data;
				for (let i = 0; i < foodLists.length; i++) {
					let flag = true;
					for (let k = 0; k < this.Foods.length; k++) {
						if (this.Foods[k].foodid === foodLists[i].foodid) {
							var datas = {
								foodid: foodLists[i].foodid,
								foodname: foodLists[i].foodname,
								foodprice: foodLists[i].foodprice,
								num: this.Foods[k].num,
							};
							this.tableData.push(datas);
							flag = false;
							break;
						}
					}
					if (flag) {
						var datas = {
							foodid: foodLists[i].foodid,
							foodname: foodLists[i].foodname,
							foodprice: foodLists[i].foodprice,
							num: 0,
						};
						this.tableData.push(datas);
					}
				}
				this.total = res.data.data.total;
				this.last_page = res.data.data.last_page;
			}
		},
		postFoods() {
			this.$parent.getFoods(this.selectFoods);
			this.hideEditFalse();
		},
	},
	computed: mapState(['selectFood']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
	height: 400px;
	margin: auto;
	z-index: 130;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 3px 18px #999;
	overflow-y: auto;
	position: fixed;
	top: 50%;
	margin-top: -200px;
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
	width: 750px;
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
.selectFood {
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