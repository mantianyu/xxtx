<template>
	<div class="addDrugSale" v-show="addDrugSale">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>药品缴存</h5>
					<span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="老人姓名:" prop="elderid">
									<el-select v-model="form.elderid" filterable clearable placeholder="请选择老人">
										<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="缴存方式:" prop="handtype">
									<el-select v-model="form.handtype" clearable placeholder="请选择缴存方式">
										<el-option v-for="(drugSale, key) in drugSaleType" :label="drugSale" :key="key" :value="key * 1"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<el-form-item label="老人药品信息:">
								<el-button type="info" size="small" @click="addDrugList">添加</el-button>
							</el-form-item>
							<el-form-item>
								<el-table
									:data="druglist"
									stripe
									style="width: 100%">
									<el-table-column
									prop="drugname"
									label="药名">
									</el-table-column>
									<el-table-column
									prop="count"
									label="数量">
										<template slot-scope="scope">
											<el-input-number :controls="false" size="mini" :min="0" v-model="scope.row.count" style="width: 80px"></el-input-number>
										</template>
									</el-table-column>
									<el-table-column
									prop="drugspecification"
									label="最小规格">
										<template slot-scope="scope">
											<p>{{drugSpecifical[scope.row.drugspecification]}}</p>
										</template>
									</el-table-column>
									<el-table-column
									prop="warncount"
									label="预警数量">
										<template slot-scope="scope">
											<el-input-number :controls="false" size="mini" :min="0" v-model="scope.row.warncount" style="width: 80px"></el-input-number>
										</template>
									</el-table-column>
									<el-table-column
									label="操作">
										<template slot-scope="scope">
											<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, druglist)">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
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
	   	<v-druglist></v-druglist>
	</div>
</template>

<script>
import localEvent from '@/utils/local';
import { mapState } from 'vuex';
import vDruglist from './addDrugList.vue';

export default {
	props: ['drugSaleType', 'elders'],
	data() {
		return {
			form: {
				elderid: '',
				handtype: '',
			},
			rules: {
				elderid: [
					{
						required: true,
						message: this.message.pleaseInputElderName,
						trigger: 'blur',
					},
				],
				handtype: [
					{
						required: true,
						message: this.message.pleaseChoiceDepositeType,
						trigger: 'change',
					},
				],
			},
			drugSpecifical: [],
			druglist: [],
			bLoading: false,
		};
	},
	components: {
		vDruglist,
	},
	mounted() {
		this.fetchDrugSpecifical();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					var drugs = [];

					if (this.druglist.length === 0) {
						this.$alert(this.message.drugSaleNotEmpty, '', {
							confirmButtonText: this.message.confirm,
							callback: action => {
								this.bLoading = false;
							},
						});
						return;
					}
					for (let i = 0; i < this.druglist.length; i++) {
						var drug = {
							drugid: this.druglist[i].drugid,
							drugcount: this.druglist[i].count,
							warncount: this.druglist[i].warncount,
						};
						drugs.push(drug);
					}
					var data = {
						elderid: this.form.elderid,
						handtype: this.form.handtype,
						drugdetails: drugs,
					};
					this.saveDrugSale(data);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addDrugSaleFalse');
			this.$refs['form'].resetFields();
			this.druglist = [];
		},
		saveDrugSale: async function(data) {
			let url = this.api.adddrugsafekeep;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.$notify({
						title: this.message.success,
						message: this.message.addDrugSaleSuccess,
						type: 'success',
					});
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
		fetchDrugSpecifical: async function() {
			let url = this.api.data;
			var data = {
				group: this.data.BEADHOUSE_DRUG_MINIMUM_SPECIFICATION,
			};
			const res = await this.$http.post(url, data);
			this.drugSpecifical = res.data.data;
		},
		addDrugList() {
			this.$store.dispatch('addDrugListTrue');
		},
		getDrugList(data) {
			for (let i = 0; i < data.length; i++) {
				let flag = true;
				for (let k = 0; k < this.druglist.length; k++) {
					if (this.druglist[k].drugid === data[i].drugid) {
						flag = false;
						break;
					}
				}
				if (flag) {
					var drug = {
						drugid: data[i].drugid,
						drugname: data[i].drugname,
						drugspecification: data[i].drugspecification,
						count: 0,
						warncount: 0,
					};
					this.druglist.push(drug);
				}
			}
		},
		deleteRow(index, rows) {
			rows.splice(index, 1);
		},
	},
	computed: mapState(['addDrugSale']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
	height: 520px;
	margin: auto;
	z-index: 130;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 3px 18px #999;
	overflow-y: auto;
	position: fixed;
	top: 50%;
	margin-top: -260px;
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
.addDrugSale {
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