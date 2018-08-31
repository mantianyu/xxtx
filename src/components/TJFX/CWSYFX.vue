<template>
    <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
				<h5>床位使用分析</h5>
                <div class="find">
                    <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
                        <el-form-item label="查询时间" prop="start" label-width="100px">
                            <el-date-picker type="month" size="small" placeholder="选择日期" value-format="yyyyMM" style="width: 160px;" v-model="ruleForm.start"></el-date-picker>
                        </el-form-item>
                            <b style="margin-left: 5px;margin-right: 5px;">~</b>
                        <el-form-item label="" prop="end">
                            <el-date-picker type="month" size="small" placeholder="选择日期" value-format="yyyyMM" style="width: 160px;" v-model="ruleForm.end"></el-date-picker>
                        </el-form-item>
                        <div style="margin-left: 10px">
                            <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
                        </div>
                    </el-form>
                </div>
	        </div>
        </el-header>
        <el-main style="position: relative;">
            <el-scrollbar class="scrollbar"  style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                <el-button type="danger" @click="exportList" style="margin-top: 20px;margin-left: 20px;z-index: 999;">导出</el-button>
                <el-select v-model="month" placeholder="请选择" style="margin-top: 20px;margin-left: 20px;width: 120px;z-index: 999;" @change="selectMonth">
                    <el-option :value="int1" label="一个月"></el-option>
                    <el-option :value="int3" label="三个月"></el-option>
                    <el-option :value="int6" label="六个月"></el-option>
                    <el-option :value="int12" label="十二个月"></el-option>
                </el-select>
                <ve-histogram :data="chartData" :settings="chartSettings" v-if="isHave" style="width: 600px;margin: 0 auto;"></ve-histogram>
                <el-table v-if="isHave"
                    :data="tableData"
                    stripe
                    style="width: 100%;">
                    <el-table-column
                    prop="month"
                    label="时间">
                    </el-table-column>
                    <el-table-column
                    prop="use"
                    label="使用">
                    </el-table-column>
                    <el-table-column
                    prop="free"
                    label="空闲">
                    </el-table-column>
                    <el-table-column
                    prop="use_percentage"
                    label="百分比">
                    </el-table-column>
                </el-table>
            </el-scrollbar>
            <div v-if="!isHave" class="unFont">暂无数据</div>
        </el-main>
    </el-container>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram';

export default {
	data() {
		var startdate = (rule, value, callback) => {
			if (Date.parse(new Date(this.ruleForm.endDate)) < Date.parse(new Date(value))) {
				callback(new Error(this.message.EndTimeWarning));
			}
			callback();
		};
		var enddate = (rule, value, callback) => {
			if (Date.parse(new Date(this.ruleForm.startDate)) > Date.parse(new Date(value))) {
				callback(new Error(this.message.EndTimeWarning));
			}
			callback();
		};
		this.chartSettings = {
			labelMap: {
				time: '时间',
				use: '使用',
				free: '空闲',
				use_percentage_value: '百分比',
			},
			showLine: ['百分比'],
			axisSite: { right: ['百分比'] },
			yAxisType: ['number', 'percent'],
			yAxisName: ['数值', '比率'],
		};
		return {
			chartData: {
				columns: ['month', 'use', 'free', 'use_percentage_value'],
				rows: [],
			},
			ruleForm: {
				startDate: '',
				endDate: '',
			},
			rules: {
				startDate: [{ validator: startdate, trigger: 'change' }],
				endDate: [{ validator: enddate, trigger: 'change' }],
			},
			tableData: [],
			loading: false,
			isHave: true,
			searchData: {
				month: 3,
			},
			month: '',
			int1: 1,
			int3: 3,
			int6: 6,
			int12: 12,
		};
	},
	components: {
		VeHistogram,
	},
  watch: {
    searchData() {
      this.fetchList(1);
    },
  },
	mounted() {
		this.fetchList();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					var data = {
						start: this.ruleForm.start * 1,
						end: this.ruleForm.end * 1,
					};
					this.searchData = data;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		fetchList: async function() {
			this.loading = true;
			let url = this.api.beduseage;
			let data = this.searchData;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (res.data.data.length != 0) {
						this.chartData.rows = [];
						this.tableData = [];
						let dataArr = res.data.data;
						for (let i = 0; i < dataArr.length; i++) {
							let chart = {
								month: dataArr[i].month,
								use: dataArr[i].use,
								free: dataArr[i].free,
								use_percentage_value: dataArr[i].use_percentage_value,
							};
							let table = {
								month: dataArr[i].month,
								use: dataArr[i].use,
								free: dataArr[i].free,
								use_percentage: dataArr[i].use_percentage,
							};
							this.chartData.rows.push(chart);
							this.tableData.push(table);
						}
						this.$nextTick(() => {
							this.loading = false;
							this.isHave = true;
						});
					} else {
						this.loading = false;
						this.isHave = false;
					}
				} else {
					this.loading = false;
					this.isHave = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
            }
          });
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.loading = false;
						this.isHave = false;
					},
				});
			}
		},
		selectMonth(val) {
			var data = {
				month: val,
			};
			this.searchData = data;
		},
		exportList: async function() {
			let url = this.api.badstatusexport;
			let data = this.searchData;
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				window.open(res.data.data);
			} else {
				this.$alert(res.data.data, '', {
					confirmButtonText: this.message.confirm,
					center: true,
					callback: action => {},
				});
			}
		},
	},
};
</script>

<style scoped>
.top-tit {
	padding: 20px;
	border-bottom: 1px solid #ddd;
	overflow: hidden;
}

.top-tit h5 {
	color: #ff8777;
	font-weight: normal;
	float: left;
	line-height: 30px;
	margin: 0;
	font-size: 18px;
}

.demo-ruleForm {
	display: flex;
}

.find form {
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.el-form-item {
	margin-bottom: 0;
}

.unFont {
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	position: absolute;
	left: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 120px;
	font-style: oblique;
	color: #ff8777;
	text-shadow: 10px 10px 10px #f59083;
}
</style>
