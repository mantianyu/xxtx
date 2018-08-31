<template>
    <el-scrollbar class="scrollbar" style="height: 100%">
      <div style="display: flex;justify-content: space-between;">
        <div class="topLeft">
          <h6 class="main_Top_tit">入住率统计</h6>
          <ve-line :data="rzlData" :judge-width="true" height="370px" :legend-visible="false" :settings="rzlSettings" :grid="chartGrid"></ve-line>
        </div>
        <div class="topRight">
          <h6 class="main_Top_tit">床位使用统计</h6>
          <ve-histogram :data="cwsyData" :judge-width="true" height="370px" :legend-visible="false" :settings="cwsySettings" :grid="chartGrid"></ve-histogram>
        </div>
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div class="centerLeft">
          <h6 class="main_Top_tit">老人疾病统计</h6>
          <ve-histogram :data="lrjbData" :judge-width="true" height="370px" :legend-visible="false" :settings="lrjbSettings" :grid="chartGrid"></ve-histogram>
        </div>
        <div class="centerRight">
          <h6 class="main_Top_tit">老人年龄统计</h6>
          <ve-pie :data="lrnlData" :judge-width="true" height="370px" :legend-visible="false" :settings="lrnlSettings" :grid="chartGrid"></ve-pie>
        </div>
      </div>
    </el-scrollbar>
</template>

<script>
export default {
	data() {
    this.chartGrid = {
      right: 40
    }
		this.rzlSettings = {
			labelMap: {
				rate: '入住率',
			},
			yAxisType: ['percent'],
      yAxisName: ['比率'],
      showLine: []
    };
		this.cwsySettings = {
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
		this.lrjbSettings = {
			showLine: ['百分比'],
			axisSite: { right: ['百分比'] },
			yAxisType: ['KMB', 'percent'],
			yAxisName: ['人数', '百分比'],
		};
		this.lrnlSettings = {
			labelMap: {
				count: '人数',
			},
		};
		return {
			rzlData: {
				columns: ['time', 'rate'],
				rows: [],
			},
			cwsyData: {
				columns: ['month', 'use', 'free', 'use_percentage_value'],
				rows: [],
			},
			lrjbData: {
				columns: ['疾病名称', '人数', '百分比'],
				rows: [],
			},
			lrnlData: {
				columns: ['age_range', 'count'],
				rows: [],
      },
		};
	},
	watch: {},
	mounted() {
		this.fetchRZL();
		this.fetchCWSY();
		this.fetchLRJB();
		this.fetchLRNL();
	},
	methods: {
		fetchRZL: async function() {
			let url = this.api.getbedoccupyrate;
			let data = {
				months: 3,
			};
			const res = await this.$http.post(url, data);
			this.rzlData.rows = res.data.data;
		},
		fetchCWSY: async function() {
			let url = this.api.beduseage;
			let data = {
				months: 3,
			};
			const res = await this.$http.post(url, data);
			this.cwsyData.rows = res.data.data;
		},
		fetchLRJB: async function() {
			let url = this.api.healthstatistics;
			let data = {};
			const res = await this.$http.post(url, data);
			let dataArr = res.data.data;
			for (let i = 0; i < dataArr.length - 1; i++) {
				let chart = {
					疾病名称: dataArr[i].name,
					人数: dataArr[i].num,
					百分比: dataArr[i].percentage_value,
				};
				this.lrjbData.rows.push(chart);
			}
		},
		fetchLRNL: async function() {
			let url = this.api.getelderagestatistics;
			let data = {};
			const res = await this.$http.post(url, data);
			this.lrnlData.rows = res.data.data.data;
		},
	},
};
</script>

<style scoped>
.main_Top_tit {
	height: 15px;
	font-size: 16px;
	line-height: 16px;
	margin-left: 1%;
	color: #666666;
	padding-left: 20px;
	margin-top: 20px;
	border-left: 4px solid #f56c6c;
}
.topLeft {
	background-color: #fff;
	height: 350px;
	width: 49%;
	float: left;
}
.topRight {
	background-color: #fff;
	height: 350px;
	width: 49%;
	float: left;
}
.centerLeft {
	background-color: #fff;
	height: 390px;
	width: 49%;
	float: left;
	margin-top: 20px;
}
.centerRight {
	background-color: #fff;
	height: 390px;
	width: 49%;
	float: left;
	margin-top: 20px;
}
</style>
