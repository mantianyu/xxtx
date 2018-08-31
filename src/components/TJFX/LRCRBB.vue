<template>
    <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
        <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>老人出入报表</h5>
            <div class="find">
                <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
                    <el-form-item label="查询时间" prop="startDate" label-width="100px">
                        <el-date-picker type="month" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.startDate"></el-date-picker>
                    </el-form-item>
                        <b style="margin-left: 5px;margin-right: 5px;">~</b>
                    <el-form-item label="" prop="endDate">
                        <el-date-picker type="month" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.endDate"></el-date-picker>
                    </el-form-item>
                    <div style="margin-left: 10px">
                        <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        </el-header>
        <el-main style="position: relative;">
            <el-scrollbar class="scrollbar" v-if="isHave" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
              <el-button type="danger" @click="exportList" style="margin-top: 20px;margin-left: 20px;z-index: 999;">导出</el-button>
              <el-select v-model="month" placeholder="请选择" style="margin-top: 20px;margin-left: 20px;width: 120px;z-index: 999;" @change="selectMonth">
                <el-option :value="int3" label="三个月"></el-option>
                <el-option :value="int6" label="六个月"></el-option>
                <el-option :value="int12" label="十二个月"></el-option>
              </el-select>
              <ve-histogram :data="chartData" :settings="chartSettings" style="width: 800px;margin: 0 auto;margin-top: 20px;"></ve-histogram>
              <div style="display: flex;width: 760px;align-items: center;justify-content: space-around;margin: 0 auto;position: relative;top: -50px;left: 20px;font-size: 14px;color: #606266;">
                <p>60周岁以下</p>
                <p>60-69周岁</p>
                <p>70-79周岁</p>
                <p>80-89周岁</p>
                <p>90-99周岁</p>
                <p>100周岁以上</p>
              </div>
                <el-table v-if="isHave" :data="tableData" style=" width: 100% ;float:left">
                    <el-table-column prop="type">
                    </el-table-column>
                    <el-table-column label="60周岁以下">
                        <el-table-column prop="oself_care" label="自理">
                        </el-table-column>
                        <el-table-column prop="omediate" label="介助">
                        </el-table-column>
                        <el-table-column prop="oprotection" label="介护">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="60-69周岁">
                        <el-table-column prop="wself_care" label="自理">
                        </el-table-column>
                        <el-table-column prop="wmediate" label="介助">
                        </el-table-column>
                        <el-table-column prop="wprotection" label="介护">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="70-79周岁">
                        <el-table-column prop="tself_care" label="自理">
                        </el-table-column>
                        <el-table-column prop="tmediate" label="介助">
                        </el-table-column>
                        <el-table-column prop="tprotection" label="介护">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="80-89周岁">
                        <el-table-column prop="uself_care" label="自理">
                        </el-table-column>
                        <el-table-column prop="umediate" label="介助">
                        </el-table-column>
                        <el-table-column prop="uprotection" label="介护">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="90-99周岁">
                        <el-table-column prop="fself_care" label="自理">
                        </el-table-column>
                        <el-table-column prop="fmediate" label="介助">
                        </el-table-column>
                        <el-table-column prop="fprotection" label="介护">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="100周岁以上">
                        <el-table-column prop="xself_care" label="自理">
                        </el-table-column>
                        <el-table-column prop="xmediate" label="介助">
                        </el-table-column>
                        <el-table-column prop="xprotection" label="介护">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="累计">
                        <el-table-column prop="sself_care" label="自理">
                        </el-table-column>
                        <el-table-column prop="smediate" label="介助">
                        </el-table-column>
                        <el-table-column prop="sprotection" label="介护">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="total" label="合计">
                    </el-table-column>
                </el-table>
            </el-scrollbar>
            <div v-if="!isHave" class="unFont">暂无数据</div>
        </el-main>
    </el-container>
</template>

<script>
export default {
  data() {
    var startdate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.endDate)) <
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    var enddate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.startDate)) >
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    this.chartSettings = {
      labelMap: {
        checkout: "出院",
        transfer: "转院",
        die: "死亡",
        checkin: "入住"
      }
    };
    return {
      ruleForm: {
        startDate: '',
        endDate: ''
      },
      rules: {
        startDate: [{ validator: startdate, trigger: "change" }],
        endDate: [{ validator: enddate, trigger: "change" }]
      },
      searchData: {},
      chartData: {
        columns: ["type", "checkout", "transfer", "die", "checkin"],
        rows: []
      },
      tableData: [],
      isHave: true,
      loading: false,
      month: 3,
      int3: 3,
      int6: 6,
      int12: 12
    };
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            start: Date.parse(new Date(this.ruleForm.startDate)) / 1000,
            end: Date.parse(new Date(this.ruleForm.endDate)) / 1000
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
      let url = this.api.eldercheckinstatistics;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.length != 0) {
            this.tableData = res.data.data.table;
            this.chartData.rows = res.data.data.chart;
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
        this.loading = false;
        this.isHave = false;
      }
    },
    selectMonth(val) {
      var data = {
        month: val
      };
      this.searchData = data;
    },
    exportList: async function() {
      let url = this.api.eldercheckinexport;
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
.lrxxxq {
  background-color: #fff;
  min-height: 100%;
}

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

.el-select-dropdown__wrap el-scrollbar__wrap {
  overflow: visible !important;
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