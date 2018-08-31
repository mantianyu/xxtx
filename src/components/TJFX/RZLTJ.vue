<template>
    <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
        <el-header style="min-height: 60px;height: auto;">
          <div class="top-tit">
            <h5>入住率分析</h5>
            <div class="find">
              <el-form label-width="400px" :rules="rules" ref="ruleForm" :model="ruleForm">
                <el-form-item label="时间：" prop="start" label-width="100px">
                    <el-date-picker type="month" size="small" placeholder="选择日期" value-format="yyyy-MM" style="width: 160px;" v-model="ruleForm.start"></el-date-picker>
                </el-form-item>
                    <b>~</b>
                <el-form-item label="" prop="end" label-width="0">
                    <el-date-picker type="month" size="small" placeholder="选择日期" value-format="yyyy-MM" style="width: 160px;" v-model="ruleForm.end"></el-date-picker>
                </el-form-item>
                <div style="margin-left: 10px">
                  <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </el-header>
        <el-main style="position: relative;">
            <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                <el-button type="danger" @click="exportList" style="margin-top: 20px;margin-left: 20px;z-index: 999;">导出</el-button>
                <el-select v-model="month" placeholder="请选择" style="margin-top: 20px;margin-left: 20px;width: 120px;z-index: 999;" @change="selectMonth">
                  <el-option :value="int3" label="三个月"></el-option>
                  <el-option :value="int6" label="六个月"></el-option>
                  <el-option :value="int12" label="十二个月"></el-option>
                </el-select>
                <ve-line v-if="isHave" :data="chartData" :settings="chartSettings" style="width: 600px;margin: 0 auto;"></ve-line>
                <el-table
                    v-if="isHave"
                    :data="tableData"
                    stripe
                    style="width: 100%;">
                    <el-table-column
                    prop="time"
                    label="时间">
                    </el-table-column>
                    <el-table-column
                    prop="rate"
                    label="入住率">
                    </el-table-column>
                </el-table>
            </el-scrollbar>
            <div v-if="!isHave" class="unFont">暂无数据</div>
        </el-main>
    </el-container>
</template>

<script>
import VeLine from "v-charts/lib/line";

export default {
  data() {
    this.chartSettings = {
      labelMap: {
        rate: "入住率"
      },
      yAxisType: ["percent"],
      yAxisName: ["比率"]
    };
    var startdate = (rule, value, callback) => {
      if (this.ruleForm.end) {
        if (this.ruleForm.end < value) {
          callback(new Error(this.message.EndTimeWarning));
        }
      }
      callback();
    };
    var enddate = (rule, value, callback) => {
      if (this.ruleForm.start) {
        if (this.ruleForm.start > value) {
          callback(new Error(this.message.EndTimeWarning));
        }
      }
      callback();
    };
    return {
      ruleForm: {
        start: "",
        end: ""
      },
      rules: {
        start: [{ validator: startdate, trigger: "change" }],
        end: [{ validator: enddate, trigger: "change" }]
      },
      chartData: {
        columns: ["time", "rate"],
        rows: []
      },
      tableData: [],
      loading: false,
      isHave: true,
      searchData: {
        months: 3
      },
      month: 3,
      int3: 3,
      int6: 6,
      int12: 12
    };
  },
  components: {
    VeLine
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
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            start_date: this.ruleForm.start,
            end_date: this.ruleForm.end,
          };
          this.month = "";
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.getbedoccupyrate;
      let data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.length != 0) {
            this.chartData.rows = res.data.data;
            this.tableData = res.data.data;
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
        months: val
      };
      this.searchData = data;
    },
    exportList: async function() {
      let url = this.api.exportbedoccupyrate;
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
