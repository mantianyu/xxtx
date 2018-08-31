<template>
    <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
				<h5>老人类型分析</h5>
	        </div>
        </el-header>
        <el-main style="position: relative;">
            <el-scrollbar style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                <el-button type="danger" @click="exportList" style="margin-top: 20px;margin-left: 20px;z-index: 999;">导出</el-button>
                <ve-histogram v-if="isHave" :data="chartData" :settings="chartSettings" style="width: 650px;margin: 0 auto;"></ve-histogram>
                <el-table
                    v-if="isHave"
                    :data="tableData"
                    stripe
                    style="width: 100%;">
                    <el-table-column
                    prop="name"
                    label="老人类型">
                    </el-table-column>
                    <el-table-column
                    prop="num"
                    label="人数">
                    </el-table-column>
                    <el-table-column
                    prop="percentage"
                    label="百分比">
                    </el-table-column>
                </el-table>
            </el-scrollbar>
            <div v-if="!isHave" class="unFont">暂无数据</div>
        </el-main>
    </el-container>
</template>

<script>
import VeHistogram from "v-charts/lib/histogram";

export default {
  data() {
    this.chartSettings = {
	  showLine: ['百分比'],
	  axisSite: { right: ["百分比"] },
      yAxisType: ["KMB", "percent"],
      yAxisName: ["人数", "百分比"]
    };
    return {
      month: "",
      int3: 3,
      int6: 6,
      int12: 12,
      chartData: {
        columns: ["老人类型", "人数", "百分比"],
        rows: []
      },
      tableData: [],
      loading: false,
      isHave: true,
      searchData: {}
    };
  },
  components: {
    VeHistogram
  },
  watch: {
    searchData() {
      this.fetchList();
    }
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    fetchList: async function() {
      this.loading = true;
      let data = this.searchData;
      let url = this.api.eldertype;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.length != 0) {
            this.tableData = res.data.data;
			let dataArr = res.data.data;
			for(let i = 0; i < dataArr.length - 1; i++){
				let chart = {
					老人类型: dataArr[i].name,
					人数: dataArr[i].num,
					百分比: dataArr[i].percentage_value
              };
              this.chartData.rows.push(chart);
			};
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
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.isHave = false;
          }
        });
      }
    },
    selectMonth(val) {
      var data = {
        month: val
      };
      this.searchData = data;
    },
    exportList: async function() {
      let url = this.api.eldertypeexport;
      let data = this.searchData;
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        window.open(res.data.data);
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          center: true,
          callback: action => {}
        });
      }
    }
  }
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
