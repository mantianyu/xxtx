<template>
	<div class="addDrugSet" v-show="addDrugSet">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>添加药品</h5>
	            <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="90px" class="demo-ruleForm">
	        		<div style="display: flex;justify-content: space-around;height: 40px;">
	        			<el-form-item label="老人姓名:" prop="elderid" style="width: 300px;">
	        				<el-select v-bind:disabled="noEdit" filterable v-model="form.elderid" placeholder="请选择老人" @change="changeElder">
						      	<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
						    </el-select>
					  	</el-form-item>
					  	<el-form-item label="床位号:" style="width: 300px;">
					    	<el-input disabled v-model="form.elderBed"></el-input>
					  	</el-form-item>
					  	<el-button type="info" plain @click="getDrug">用药设置</el-button>
	        		</div>
	        		<div v-if="isDrugList" style="margin-top: 20px;">
						<el-table
							v-loading="loading"
						    :data="tableData"
						    stripe
						    style="width: 100%">
						    <el-table-column
						      prop="drugname"
						      label="药名">
						    </el-table-column>
						    <el-table-column
						      prop="drugtime"
						      label="时间">
						    </el-table-column>
						    <el-table-column
						      prop="bednum"
						      label="频率">
						      	<template slot-scope="scope">
						          	<p>{{scope.row.frequencycount}}次/{{scope.row.frequencyday}}天</p>
						        </template>
						    </el-table-column>
						    <el-table-column
						      prop="bednum"
						      label="时间数量">
						      	<template slot-scope="scope">
						          	<p>早{{scope.row.earlynum}}中{{scope.row.middlenum}}晚{{scope.row.latenum}}</p>
						        </template>
						    </el-table-column>
						    <el-table-column
						      prop="address"
						      label="操作">
						      	<template slot-scope="scope">
						          	<el-button type="text" size="small" @click="deleteDrug(scope.row.maid,scope.$index, tableData)">删除</el-button>
						        </template>
						    </el-table-column>
						</el-table>
						<div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: flex-end;">
							<div style="display: flex;margin-right: 20px;">
								<el-button type="primary" size="small" @click="fetchDetail(form.elderid, 1)">首页</el-button>
								<el-pagination
								  background
								  @current-change="handleCurrentChange"
					    :current-page="currentPage"
								  layout="prev, pager, next"
								  :total="total">
								</el-pagination>
								<el-button type="primary" size="small" @click="fetchDetail(form.elderid, last_page)">末页</el-button>
							</div>
					    </div>
	        		</div>
	        		<div v-if="isDrugList" style="margin-top: 20px;display: flex;flex-wrap: wrap;justify-content: space-around;">
						<el-form-item label="药品名称:" prop="drugid">
						    <el-select v-model="form.drugid" clearable placeholder="请选择药品名称">
						      	<el-option v-for="(drug, key) in drugList" :label="drug.drugname" :key="key" :value="drug.drugid"></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="时间:" prop="drugtime">
						    <el-select v-model="form.drugtime" clearable placeholder="请选择时间">
						      <el-option v-for="(time, key) in eatDrugTime" :label="time" :key="key" :value="key * 1"></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="频率:">
						    <el-input-number size="mini" :min="1" :controls="false" v-model="form.frequencycount" style="width: 72px"></el-input-number>&nbsp;次&nbsp;/&nbsp;
						    <el-input-number size="mini" :min="1" :controls="false" v-model="form.frequencyday" style="width: 72px"></el-input-number>&nbsp;天
						</el-form-item>
						<el-form-item label="时间数量:">&nbsp;早&nbsp;
						    <el-input-number size="mini" :min="0" :controls="false" v-model="form.earlynum" style="width: 50px"></el-input-number>&nbsp;中&nbsp;
						    <el-input-number size="mini" :min="0" :controls="false" v-model="form.middlenum" style="width: 50px"></el-input-number>&nbsp;晚&nbsp;
						    <el-input-number size="mini" :min="0" :controls="false" v-model="form.latenum" style="width: 50px"></el-input-number>
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
	props: ['elderId', 'eatDrugTime', 'noEdit', 'elders', 'elderBed', 'checkin_id', 'status'],
	data() {
		return {
			form: {
				elderid: '',
				elderBed: '',
				drugid: '',
				drugtime: '',
				frequencycount: '',
				frequencyday: '',
				earlynum: '',
				middlenum: '',
				latenum: '',
			},
			rules: {
				elderid: [
					{
						required: true,
						message: this.message.pleaseInputElderName,
						trigger: 'blur',
					},
				],
				drugid: [
					{
						required: true,
						message: this.message.pleaseChoiceMedicine,
						trigger: 'change',
					},
				],
				drugtime: [
					{
						required: true,
						message: this.message.pleaseChoiceTime,
						trigger: 'change',
					},
				],
			},
			tableData: [],
			isDrugList: false,
			isDrug: false,
			drugList: [],
			drugsafekeepingid: 0,
			total: 0,
			last_page: 0,
			loading: false,
			currentPage: 1,
			checkinId: 0,
			bLoading: false,
		};
	},
	watch: {
		elderId() {
			if (this.elderId == 0) {
				this.form.elderid = '';
				this.form.elderBed = '';
				this.form.drugid = '';
				this.form.drugtime = '';
				this.form.frequencycount = '';
				this.form.frequencyday = '';
				this.form.earlynum = '';
				this.form.middlenum = '';
				this.form.latenum = '';
			} else {
				this.form.elderid = this.elderId;
				this.form.elderBed = this.elderBed;
				this.fetchDetail(this.elderId, 1);
				this.fetchDrug(this.elderId);
			}
		},
	},
	mounted() {
		if (this.status === 1) {
			this.form.elderid = this.elderId;
			this.form.elderBed = this.elderBed;
			this.fetchDetail(this.elderId, 1);
			this.fetchDrug(this.elderId);
		}
	},
	methods: {
		handleCurrentChange(val) {
			this.fetchDetail(this.elderId, val);
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					if (this.form.earlynum === 0 && this.form.middlenum === 0 && this.form.latenum === 0) {
						this.$alert(this.message.eatDrugTimeNotZero, '', {
							confirmButtonText: '确定',
							callback: action => {
								this.bLoading = false;
							},
						});
						return;
					}
					var data = {
						elderid: this.form.elderid,
						drugid: this.form.drugid,
						drugtime: this.form.drugtime,
						frequencycount: this.form.frequencycount,
						frequencyday: this.form.frequencyday,
						earlynum: this.form.earlynum,
						middlenum: this.form.middlenum,
						latenum: this.form.latenum,
						checkin_id: this.checkin_id !== 0 ? this.checkin_id : this.checkinId,
					};
					this.saveDrugSet(data);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addDrugSetFalse');
			this.$refs['form'].resetFields();
			if (!this.status) {
				this.$parent.clean();
			}
			this.form.elderid = '';
			this.form.elderBed = '';
			this.form.drugid = '';
			this.form.drugtime = '';
			this.form.frequencycount = '';
			this.form.frequencyday = '';
			this.form.earlynum = '';
			this.form.middlenum = '';
			this.form.latenum = '';
			this.isDrugList = false;
			this.isDrug = false;
		},
		fetchDetail: async function(id, val) {
			this.loading = true;
			let url = this.api.medicationsetlist + '?page=' + val;
			var data = {
				elderid: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.tableData = res.data.data.data;
					this.total = res.data.data.total;
					this.last_page = res.data.data.last_page;
					this.isDrugList = true;
					this.isDrug = true;
					this.$nextTick(() => {
						this.loading = false;
						this.currentPage = val;
					});
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.hideEditFalse();
							this.loading = false;
						},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.hideEditFalse();
						this.loading = false;
					},
				});
			}
		},
		saveDrugSet: async function(data) {
			let url = this.api.addmedicationset;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.$notify({
						title: this.message.success,
						message: this.message.addDrugSetSuccess,
						type: 'success',
					});
					if (this.status === 1) {
						this.$parent.fetchYYSZ(1);
					} else {
						this.$parent.fetchList(1);
					}
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
		getDrug() {
			if (this.form.elderid == '') {
				this.$alert(this.message.pleaseChoiceOldMan, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {},
				});
			} else {
				this.fetchDrug(this.form.elderid);
				this.fetchDetail(this.form.elderid, 1);
			}
		},
		fetchDrug: async function(id) {
			let url = this.api.getelderdruglist;
			var data = {
				id: id,
			};
			const res = await this.$http.post(url, data);
			this.drugList = res.data.data;
			this.isDrugList = true;
			this.isDrug = true;
		},
		deleteDrug: async function(id, index, rows) {
			let url = this.api.delmedicationset;
			var data = {
				msid: id,
			};
			const res = await this.$http.post(url, data);
			rows.splice(index, 1);
			if (this.status === 1) {
				this.$parent.fetchYYSZ(1);
			}
		},
		changeElder(val) {
			for (let i = 0; i < this.elders.length; i++) {
				if (this.elders[i].elder_id == val) {
					this.form.elderBed = this.elders[i].bed_name;
					this.checkinId = this.elders[i].checkin_id;
					break;
				}
			}
			this.fetchDrug(this.form.elderid);
			this.fetchDetail(this.form.elderid, 1);
		},
	},
	computed: mapState(['addDrugSet']),
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
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
.addDrugSet {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2001;
}
.divflex {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>