<template>
    <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
				<h5>护理类型分析</h5>
	        </div>
        </el-header>
        <el-main style="position: relative;">
            <el-scrollbar style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                <el-button type="danger" @click="exportList" style="margin-top: 20px;margin-left: 20px;z-index: 999;">导出</el-button>
                <ve-histogram v-if="isHave" :data="chartData" :settings="chartSettings" style="width: 600px;margin: 0 auto;"></ve-histogram>
                <el-table
                    v-if="isHave"
                    :data="tableData"
                    stripe
                    style="width: 100%;">
                    <el-table-column
                    prop="type"
                    label="护理类型">
                    </el-table-column>
                    <el-table-column
                    prop="count"
                    label="人数">
                    </el-table-column>
                    <el-table-column
                    prop="pernct"
                    label="比例">
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
      labelMap: {
        count: "人数",
        scale: "百分比"
      },
      showLine: ["scale"],
      axisSite: { right: ["scale"] },
      yAxisType: ["KMB", "percent"],
      yAxisName: ["人数", "百分比"]
    };
    return {
      chartData: {
        columns: ["type", "count", "scale"],
        rows: []
      },
      tableData: [],
      loading: false,
      isHave: true,
    };
  },
  components: {
    VeHistogram
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    fetchList: async function() {
      this.loading = true;
      let data = {};
      let url = this.api.eldernursingtype;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.length != 0) {
            this.tableData = res.data.data;
            this.chartData.rows = [];
            for (let i = 0; i < res.data.data.length - 1; i++) {
              this.chartData.rows.push(res.data.data[i]);
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
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.isHave = false;
          }
        });
      }
    },
    exportList: async function() {
      let url = this.api.eldernursingtypexport;
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
