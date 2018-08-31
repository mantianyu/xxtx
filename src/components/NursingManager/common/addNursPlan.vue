<template>
	<div class="addNursPlan" v-show="addNursPlan">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>护工排班方案</h5>
					<span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse">
						<i class="el-icon-close"></i>
					</span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="130px" class="demo-ruleForm">
              <div style="display: flex;flex-direction: row;">
                <el-form-item label="方案名称:" prop="name">
                  <el-input v-model="form.name" style="width: 280px;"></el-input>
                </el-form-item>
                <el-form-item label="排班周期:" prop="cycle">
                  <el-select v-model="form.cycle" clearable placeholder="请选择排班周期" style="width: 280px;">
                    <el-option label="月" :value="cycle1"></el-option>
                    <el-option label="周" :value="cycle2"></el-option>
                  </el-select>
                </el-form-item>
              </div>
							<el-form-item label="方案说明:" prop="introduction">
								<el-input type="textarea" v-model="form.introduction"></el-input>
							</el-form-item>
							<el-form-item label="参考设置及添加:">
								<el-button type="danger" plain size="mini" @click="addSet(0)">添加</el-button>
								<el-button type="danger" plain size="mini" @click="addSet(1)">全天（08：00-次日08：00）</el-button>
								<el-button type="danger" plain size="mini" @click="addSet(2)">白班（06：50-19：00）</el-button>
								<el-button type="danger" plain size="mini" @click="addSet(3)">夜班（18：50-次日07：00）</el-button>
								<el-button type="danger" plain size="mini" @click="addSet(4)">早班（6：30-13：30）</el-button>
								<el-button type="danger" plain size="mini" @click="addSet(5)">晚班（13：30-20：30）</el-button>
								<el-button type="danger" plain size="mini" @click="addSet(6)">夜班（20：30-次日6:30）</el-button>
							</el-form-item>
								<el-table :data="tableData" style="width: 100%">
									<el-table-column label="班次名称" width="180">
										<template slot-scope="scope">
											<el-input v-model="scope.row.name" v-bind:disabled="scope.row.isEdit" size="mini" placeholder="请输入班次名称"></el-input>
										</template>
									</el-table-column>
									<el-table-column label="开始时间" width="240">
										<template slot-scope="scope">
											<el-time-select v-model="scope.row.start_time" :picker-options="{
													start: '00:00',
													step: '00:15',
													end: '24:00'
												}" style="width: 150px" placeholder="选择时间" size="mini" @change="selectStart(scope.row, scope.$index)">
											</el-time-select>
										</template>
									</el-table-column>
									<el-table-column label="结束时间" width="280">
										<template slot-scope="scope">
                      <el-select v-model="scope.row.timeType" placeholder="请选择" disabled size="mini" style="width: 80px;">
                        <el-option
                          label="当日"
                          :value="int0">
                        </el-option>
                        <el-option
                          label="次日"
                          :value="int1">
                        </el-option>
                      </el-select>
											<el-time-select v-model="scope.row.end_time" :picker-options="{
													start: '00:00',
													step: '00:15',
													end: '24:00'
												}" style="width: 130px" placeholder="选择时间" size="mini" @change="selectEnd(scope.row, scope.$index)">
											</el-time-select>
										</template>
									</el-table-column>
									<el-table-column fixed="right" label="操作" width="120">
										<template slot-scope="scope">
											<el-button v-bind:disabled="cdis" @click.native.prevent="deleteRow(scope.$index, tableData, scope.row)" type="text" size="small">
												移除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
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
	props: ['nursId'],
	data() {
		return {
			form: {
				name: '',
				cycle: '',
				introduction: '',
			},
			rules: {
				name: [
					{
						required: true,
						message: this.message.pleaseInputScheName,
						trigger: 'blur',
					},
				],
				cycle: [
					{
						required: true,
						message: this.message.pleaseChoiceCycle,
						trigger: 'change',
					},
				],
			},
			empId: localEvent.StorageGetter('empId'),
			cycle1: 0,
			cycle2: 1,
			tableData: [],
			loading: false,
			bLoading: false,
			int0: 0,
			int1: 1,
			cdis: false,
		};
	},
	watch: {
		nursId() {
			if (this.nursId == 0) {
				this.tableData = [];
				this.empId = localEvent.StorageGetter('empId');
			} else {
				this.fetchDetail(this.nursId);
			}
		},
	},
	methods: {
		deleteRow: async function(index, rows, scope) {
			this.cdis = true;
			if (scope.id) {
				let url = this.api.deletetimeplans;
				var data = {
					id: scope.id,
				};
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					rows.splice(index, 1);
					this.cdis = false;
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.cdis = false;
						},
					});
				}
			} else {
				rows.splice(index, 1);
				this.cdis = false;
			}
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					if (this.tableData.length != 0) {
						for (let i = 0; i < this.tableData.length; i++) {
							if (this.tableData[i].name == '') {
								this.$alert(this.message.flightNameWarning, '', {
									confirmButtonText: this.message.confirm,
									callback: action => {
										this.bLoading = false;
									},
								});
								return null;
							} else if (this.tableData[i].start_time == '' || this.tableData[i].end_time == '') {
								this.$alert(this.messagestartEndTimeWarning, '', {
									confirmButtonText: this.message.confirm,
									callback: action => {
										this.bLoading = false;
									},
								});
								return null;
							}
						}
						if (this.nursId == 0) {
							var data = {
								name: this.form.name,
								cycle: this.form.cycle,
								introduction: this.form.introduction,
								employee_id: this.empId,
								shift: this.tableData,
							};
							this.savePlan(data);
						} else {
							var data = {
								id: this.nursId,
								name: this.form.name,
								cycle: this.form.cycle,
								introduction: this.form.introduction,
								employee_id: this.empId,
								shift: this.tableData,
							};
							this.savePlan(data);
						}
					} else {
						this.$alert(this.message.flightCannotEmpty, '', {
							confirmButtonText: this.message.confirm,
							callback: action => {
								this.bLoading = false;
							},
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		hideEditFalse() {
			this.$store.dispatch('addNursPlanFalse');
			this.$refs['form'].resetFields();
			this.$parent.clean();
			this.tableData = [];
		},
		fetchDetail: async function(id) {
			this.loading = true;
			let url = this.api.schedulingdetail;
			var data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.form.name = res.data.data.name;
					this.form.cycle = res.data.data.cycle;
					this.form.introduction = res.data.data.introduction;
					this.tableData = [];
					for(let i = 0; i < res.data.data.data.length; i++){
						let data = res.data.data.data[i];
						data['timeType'] = res.data.data.data[i].start_time < res.data.data.data[i].end_time ? 0 : 1;
						this.tableData.push(data);
					}
					this.empId = res.data.data.employee_id;
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
		savePlan: async function(data) {
			let url = this.api.addscheduling;
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
		addSet(val) {
			if (this.tableData.length === 3) {
				this.$alert(this.message.maxThree, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {},
				});
				return;
			} else {
				var data = {
					name:
						val == 0
							? ''
							: val == 1
								? this.message.allDay
								: val == 2
									? this.message.whiteWork
									: val == 3
										? this.message.nightshift
										: val == 4
											? this.message.morning
											: val == 5 ? this.message.night : this.message.nightshift,
					start_time:
						val == 0
							? ''
							: val == 1
								? '08:00'
								: val == 2
									? '06:50'
									: val == 3 ? '18:50' : val == 4 ? '06:30' : val == 5 ? '13:30' : '20:30',
					end_time:
						val == 0
							? ''
							: val == 1
								? '08:00'
								: val == 2
									? '19:00'
									: val == 3 ? '07:00' : val == 4 ? '13:30' : val == 5 ? '20:30' : '06:30',
					timeType:
						val == 0 ? 0 : val == 1 ? 1 : val == 2 ? 0 : val == 3 ? 1 : val == 4 ? 0 : val == 5 ? 0 : 1,
        };
        for(let i = 0; i < this.tableData.length; i++){
          if(data.name === this.tableData[i].name){
            this.$alert(this.message.nurseWorkCopy, '', {
              confirmButtonText: this.message.confirm,
              callback: action => {},
            });
            return;
          }
        }
				this.tableData.push(data);
			}
		},
		selectStart(scope, index) {
			if (scope.start_time < scope.end_time) {
				this.tableData[index].timeType = 0;
			} else if (scope.start_time >= scope.end_time) {
				this.tableData[index].timeType = 1;
			}
		},
		selectEnd(scope, index) {
			if (scope.start_time < scope.end_time) {
				this.tableData[index].timeType = 0;
			} else if (scope.start_time >= scope.end_time) {
				this.tableData[index].timeType = 1;
			}
		},
	},
	computed: mapState(['addNursPlan']),
};
</script>

<style scoped>
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
.qxz {
	padding: 40px;
	margin-top: 25px;
	padding-top: 0;
}
.addNursPlan {
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