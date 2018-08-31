<template>
    <div>
        <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
            <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="护理级别:" prop="levelid">
                    <el-select v-model="form.levelid" clearable placeholder="请选择" style="width: 200px;" @change="selectLevel">
                        <el-option v-for="(level, key) in levelList" :label="level.name" :value="level.id" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="级别说明:" prop="levelintroduction">
                    <el-input v-model="form.levelintroduction" disabled style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="护理级别费用:" prop="levelprice">
                    <el-input v-model="form.levelprice" disabled style="width: 200px;"></el-input>
                </el-form-item>
            </div>
            <div>
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="项目名称">
                    </el-table-column>
                    <el-table-column
                            prop="type_name"
                            label="所属类别">
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            label="费用">
                    </el-table-column>
                    <el-table-column
                            prop="price_mode"
                            label="收费方式">
                        <template slot-scope="scope">
                            <p>{{modes[scope.row.price_mode]}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="任务类型">
                        <template slot-scope="scope">
                            <p>{{scope.row.task_type == 0 ? '一般任务' : '关键任务'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="cycle"
                            label="执行频次">
                        <template slot-scope="scope">
                            <p>{{scope.row.cycle == 1 ? '天任务' : scope.row.cycle == 2 ? '周任务' : scope.row.cycle == 3 ? '月任务' : ''}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                      prop="days"
                      label="执行日期">
                      <template slot-scope="scope">
                        <p v-if="scope.row.cycle == 3" v-for="(day, key) in scope.row.days" :key="key">{{ months[day] }}</p>
                        <p v-if="scope.row.cycle == 2" v-for="(day, key) in scope.row.days" :key="key">{{ weeks[day] }}</p>
                      </template>
                      </el-table-column>
                      <el-table-column
                      prop="times"
                      label="执行时间">
                      <template slot-scope="scope">
                        <p v-for="(time, key) in scope.row.times" :key="key">{{ dayTimes[time] }}</p>
                      </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                    <div></div>
                    <div style="display: flex;margin-right: 20px;"></div>
                </div>
            </div>
            <div v-if="status ? status != 1 ? true : false : true" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="info" size="medium" @click="back">{{iscycw ? '取消' : '上一步'}}</el-button>
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
	props: ['elderDetail', 'id', 'checkin', 'iscycw', 'status'],
	data() {
		return {
			form: {
				levelid: '',
				levelintroduction: '',
				levelprice: '',
			},
			rules: {
				levelid: [{ required: true, message: this.message.pleaseChoiceNurseLevel, trigger: 'change' }],
			},
			months: [
				'1号',
				'2号',
				'3号',
				'4号',
				'5号',
				'6号',
				'7号',
				'8号',
				'9号',
				'10号',
				'11号',
				'12号',
				'13号',
				'14号',
				'15号',
				'16号',
				'17号',
				'18号',
				'19号',
				'20号',
				'21号',
				'22号',
				'23号',
				'24号',
				'25号',
				'26号',
				'27号',
				'28号',
				'29号',
				'30号',
				'31号',
			],
			weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
			dayTimes: [
				'06:00',
				'06:30',
				'07:00',
				'07:30',
				'08:00',
				'08:30',
				'09:00',
				'09:30',
				'10:00',
				'10:30',
				'11:00',
				'11:30',
				'12:00',
				'12:30',
				'13:00',
				'13:30',
				'14:00',
				'14:30',
				'15:00',
				'15:30',
				'16:00',
				'16:30',
				'17:00',
				'17:30',
				'18:00',
				'18:30',
				'19:00',
				'19:30',
				'20:00',
				'20:30',
				'21:00',
				'21:30',
				'22:00',
				'22:30',
				'23:00',
				'23:30',
				'00:00',
				'00:30',
				'01:00',
				'01:30',
				'02:00',
				'02:30',
				'03:00',
				'03:30',
				'04:00',
				'04:30',
				'05:00',
				'05:30',
			],
			vision: [],
			hearing: [],
			disease: [],
			elderid: 0,
			tableData: [],
			multipleSelection: [],
			levelList: [],
			levelId: 0,
			modes: [this.message.times, this.message.days, this.message.weeks, this.message.months, this.message.years],
			bLoading: false,
			islevelId: 0
		};
	},
	watch: {
		elderDetail() {
			if (this.elderDetail.length == 0) {
				this.$parent.$parent.$parent.$parent.loadingFalse();
			} else {
				this.elderid = this.elderDetail.elderid;
				this.checkinId = this.elderDetail.checkinid;
				this.fetchDetail(this.elderDetail.checkinid);
			}
		},
		id() {
			if (this.id != 0) {
				this.elderid = this.id;
				this.checkinId = this.checkin;
				this.fetchDetail(this.checkin);
			}
		},
	},
	mounted() {
		this.fetchList();
	},
	methods: {
		handleCurrentChange(val) {
			this.fetchProject(val);
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					var iteminfos = [];
					for (let i = 0; i < this.multipleSelection.length; i++) {
						if (!this.multipleSelection[i].nlsid) {
							var item = {
								itemid: this.multipleSelection[i].itemid,
								cycle: this.multipleSelection[i].cycle,
								type: this.multipleSelection[i].type,
								days: this.multipleSelection[i].days,
								times: this.multipleSelection[i].times,
								ensid: 0,
							};
							iteminfos.push(item);
						} else {
							var item = {
								itemid: this.multipleSelection[i].itemid,
								cycle: this.multipleSelection[i].cycle,
								type: this.multipleSelection[i].type,
								days: this.multipleSelection[i].days,
								times: this.multipleSelection[i].times,
								ensid: this.multipleSelection[i].nlsid,
							};
							iteminfos.push(item);
						}
					}
					var data = {
						ensid: this.elderid,
						checkinid: this.checkinId,
						levelid: this.form.levelid,
						levelprice: this.form.levelprice,
						nursingschemes: iteminfos,
					};
					this.saveNurse(data);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		fetchDetail: async function(id) {
			let url = this.api.eldernurschemeinfo;
			var data = {
				checkinid: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.islevelId = res.data.data.levelid == 0 ? '' : res.data.data.levelid;
					this.form.levelid = res.data.data.levelid == 0 ? '' : res.data.data.levelid;
					this.form.levelprice = res.data.data.levelprice == '0' ? '' : res.data.data.levelprice;
					this.selectLevel(res.data.data.levelid);
				} else {
					this.$parent.$parent.$parent.$parent.loadingFalse();
				}
			} catch (error) {
				this.$parent.$parent.$parent.$parent.loadingFalse();
			}
		},
		saveNurse: async function(data) {
			let url = this.api.addeldernurscheme;
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				this.bLoading = false;
				this.$parent.$parent.$parent.$parent.isLevelTrue(res.data.data);
				this.$parent.$parent.$parent.$parent.showNewFoodBed();
				if (this.iscycw) {
					this.bLoading = false;
					this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.CycwManageList(1);
				}
			} else {
				this.$alert(res.data.data, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.bLoading = false;
					},
				});
			}
		},
		back() {
			if (this.iscycw) {
				this.$parent.$parent.$parent.$parent.hideEdit();
			} else {
				this.$parent.$parent.$parent.$parent.showNewHealth();
			}
		},
		fetchProject: async function() {
			let url = this.api.nlevelinfo;
			if (this.status === 1) {
				var data = {
					nlid: this.levelId,
					type: 1,
				};
			} else {
				var data = {
					nlid: this.levelId,
				};
			}
			try {
				const res = await this.$http.post(url, data);
				this.tableData = [];
				for (let i = 0; i < res.data.data.iteminfos.length; i++) {
					var data = {
						itemid: res.data.data.iteminfos[i].itemid,
						cycle: res.data.data.iteminfos[i].cycle,
						type: res.data.data.iteminfos[i].type,
						days: res.data.data.iteminfos[i].days,
						times: res.data.data.iteminfos[i].times,
						name: res.data.data.iteminfos[i].iteminfo.name,
						type_name: res.data.data.iteminfos[i].iteminfo.type_name,
						price: res.data.data.iteminfos[i].iteminfo.price,
						price_mode: res.data.data.iteminfos[i].iteminfo.price_mode,
						levelId: res.data.data.id,
						isChecked: false,
					};
					this.tableData.push(data);
				}
				this.$nextTick(function() {
					this.tableData.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
					this.fetchElderProject();
				});
			} catch (error) {
				this.$parent.$parent.$parent.$parent.loadingFalse();
			}
		},
		fetchElderProject: async function() {
			let url = this.api.eldernurschemelist;
			if (this.status === 1) {
				var data = {
					checkinid: this.checkinId,
					levelid: this.levelId,
					type: 1,
				};
			} else {
				var data = {
					checkinid: this.checkinId,
					levelid: this.levelId,
				};
			}
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					for (let i = 0; i < res.data.data.length; i++) {
						for (let k = 0; k < this.tableData.length; k++) {
							if (
								this.tableData[k].levelId === res.data.data[i].level_id &&
								this.tableData[k].itemid == res.data.data[i].itemid
							) {
								this.tableData[k].itemid = res.data.data[i].itemid;
								this.tableData[k].cycle = res.data.data[i].cycle;
								this.tableData[k].type = res.data.data[i].type;
								this.tableData[k].days = res.data.data[i].days;
								this.tableData[k].times = res.data.data[i].times;
								this.tableData[k].name = res.data.data[i].iteminfo.name;
								this.tableData[k].type_name = res.data.data[i].iteminfo.type_name;
								this.tableData[k].price = res.data.data[i].iteminfo.price;
								this.tableData[k].price_mode = res.data.data[i].iteminfo.price_mode;
								this.tableData[k]['isChecked'] = true;
							}
						}
					}
					if (this.tableData.length != 0) {
						this.$nextTick(function() {
							this.tableData.forEach(row => {
								if (!row.isChecked && this.islevelId === row.levelId) {
									this.$refs.multipleTable.toggleRowSelection(row);
								}
							});
							this.$nextTick(() => {
								this.$parent.$parent.$parent.$parent.loadingFalse();
							});
						});
					} else {
						this.$nextTick(() => {
							this.$parent.$parent.$parent.$parent.loadingFalse();
						});
					}
				} else {
					this.$parent.$parent.$parent.$parent.loadingFalse();
				}
			} catch (error) {
				this.$parent.$parent.$parent.$parent.loadingFalse();
			}
		},
		fetchList: async function() {
			let url = this.api.nlevellist;
			if (this.status === 1) {
				var data = {
					type: 1,
				};
			} else {
				var data = {};
			}
			const res = await this.$http.post(url, data);
			this.levelList = res.data.data;
			if (this.form.levelid && !this.levelId) {
				this.selectLevel(this.form.levelid);
			}
		},
		selectLevel(val) {
			let flag = true;
			for (let i = 0; i < this.levelList.length; i++) {
				if (this.levelList[i].id == val) {
					this.levelId = val;
					this.form.levelintroduction = this.levelList[i].levelintroduction;
					this.form.levelprice = this.levelList[i].levelprice;
					this.fetchProject();
					flag = false;
				}
			}
			if (flag) {
				this.$nextTick(() => {
					this.$parent.$parent.$parent.$parent.loadingFalse();
				});
			}
		},
	},
};
</script>
