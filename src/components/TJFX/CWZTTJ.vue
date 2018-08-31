<template>
    <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
				      <h5>床位状态统计</h5>
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
            <el-scrollbar class="scrollbar" v-if="isHave" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                <el-button type="success" @click="showBalance" style="margin-left: 20px;margin-top: 20px;">对比</el-button>
                <el-button type="danger" style="margin-left: 20px;margin-top: 20px;" @click="exportList">导出</el-button>
                <ve-histogram :data="chartData" :settings="chartSettings" style="width: 800px;margin: 0 auto;margin-top: 20px;"></ve-histogram>
                <el-table :data="tableData" style=" width: 100% ;float:left">
                    <el-table-column
                    prop="month"
                    label="日期">
                    </el-table-column>
                    <el-table-column label="空闲">
                        <el-table-column
                        prop="free_self"
                        label="自理">
                        </el-table-column>
                        <el-table-column
                        prop="free_help"
                        label="介助">
                        </el-table-column>
                        <el-table-column
                        prop="free_nurse"
                        label="介护">
                        </el-table-column>
                        <el-table-column
                        prop="free_else"
                        label="其他">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="使用">
                        <el-table-column
                        prop="use_self"
                        label="自理">
                        </el-table-column>
                        <el-table-column
                        prop="use_help"
                        label="介助">
                        </el-table-column>
                        <el-table-column
                        prop="use_nurse"
                        label="介护">
                        </el-table-column>
                        <el-table-column
                        prop="use_else"
                        label="其他">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="包房">
                        <el-table-column
                        prop="private_self"
                        label="自理">
                        </el-table-column>
                        <el-table-column
                        prop="private_help"
                        label="介助">
                        </el-table-column>
                        <el-table-column
                        prop="private_nurse"
                        label="介护">
                        </el-table-column>
                        <el-table-column
                        prop="private_else"
                        label="其他">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预约">
                        <el-table-column
                        prop="appoint_self"
                        label="自理">
                        </el-table-column>
                        <el-table-column
                        prop="appoint_help"
                        label="介助">
                        </el-table-column>
                        <el-table-column
                        prop="appoint_nurse"
                        label="介护">
                        </el-table-column>
                        <el-table-column
                        prop="appoint_nurse"
                        label="其他">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="分类小计">
                        <el-table-column
                        prop="self"
                        label="自理">
                        </el-table-column>
                        <el-table-column
                        prop="help"
                        label="介助">
                        </el-table-column>
                        <el-table-column
                        prop="nurse"
                        label="介护">
                        </el-table-column>
                        <el-table-column
                        prop="else"
                        label="其他">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        prop="total" label="总数">
                    </el-table-column>
                </el-table>
            </el-scrollbar>
            <div v-if="!isHave" class="unFont">暂无数据</div>
        </el-main>
        <v-balance :status="status"></v-balance>
    </el-container>
</template>

<script>
import VeHistogram from "v-charts/lib/histogram";
import vBalance from "./common/balance.vue";
import { mapState } from "vuex";

export default {
  data() {
    var startdate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.end)) <
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    var enddate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.start)) >
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    this.chartSettings = {};
    return {
      ruleForm: {
        start: "",
        end: ""
      },
      rules: {
        start: [{ validator: startdate, trigger: "change" }],
        end: [{ validator: enddate, trigger: "change" }]
      },
      loading: false,
      isHave: true,
      chartData: {},
      tableData: [],
      status: 2,
      searchData: {}
    };
  },
  components: {
    VeHistogram,
    vBalance
  },
  mounted() {
    this.fetchList();
    this.fetchChart();
  },
  watch: {
    searchData() {
      this.fetchList(1);
    },
    balanceData() {
      this.fetchChart();
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            start: this.ruleForm.start * 1 ? this.ruleForm.start : '',
            end: this.ruleForm.end * 1 ? this.ruleForm.end * 1 : ''
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchChart: async function() {
      let url = this.api.bedstatuschart;
      let data = {
        month:
          this.balanceData.length !== 0
            ? this.balanceData
            : (
                new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1 < 10
                  ? "0" + (new Date().getMonth() + 1)
                  : new Date().getMonth() + 1)
              )
                .split("-")
                .join("") * 1
      };
      const res = await this.$http.post(url, data);
      this.chartData = res.data.data;
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.bedstatus;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.length != 0) {
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
        this.loading = false;
        this.isHave = false;
      }
    },
    showBalance() {
      this.$store.dispatch("balanceTrue");
    },
    exportList: async function() {
      let url = this.api.bedstatusexport;
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
  },
  computed: mapState(["balanceData"])
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
