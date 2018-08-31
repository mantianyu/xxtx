<template>
    <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
        <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>月度运营报表</h5>
            <div class="find">
                <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
					<!-- <el-form-item label="机构名称：" prop="name">
						<el-input v-model="ruleForm.name" style="width:100px" size="small" placeholder="姓名"></el-input>
					</el-form-item> -->
                    <el-form-item label="月度筛选：" prop="start" label-width="100px">
                        <el-date-picker type="month" size="small" placeholder="选择日期" value-format="yyyyMM" style="width: 160px;" v-model="ruleForm.start"></el-date-picker>
                    </el-form-item>
                        <b>~</b>
                    <el-form-item label="" prop="end" label-width="0">
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
              <ve-histogram :data="chartData"></ve-histogram>
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                    prop="month"
                    label="月份">
                    </el-table-column>
                    <el-table-column
                    prop="bed_115_count"
                    label="自理床位数">
                    </el-table-column>
                    <el-table-column
                    prop="bed_116_count"
                    label="介助床位数">
                    </el-table-column>
                    <el-table-column
                    prop="bed_117_count"
                    label="介护床位数">
                    </el-table-column>
                    <el-table-column
                    prop="bed_118_count"
                    label="其它床位数">
                    </el-table-column>
                    <el-table-column
                    prop="bed_count"
                    label="床位总数">
                    </el-table-column>
                    <el-table-column
                    prop="elder_115_count"
                    label="处理老人数">
                    </el-table-column>
                    <el-table-column
                    prop="elder_116_count"
                    label="介助老人数">
                    </el-table-column>
                    <el-table-column
                    prop="elder_117_count"
                    label="介护老人数">
                    </el-table-column>
                    <el-table-column
                    prop="elder_118_count"
                    label="其它老人数">
                    </el-table-column>
                    <el-table-column
                    prop="elder_count"
                    label="老人总数">
                    </el-table-column>
                    <el-table-column
                    prop="elder_service_count"
                    label="服务老人数">
                    </el-table-column>
                    <el-table-column
                    prop="nursing_worker_count"
                    label="在职护工数">
                    </el-table-column>
                </el-table>
                <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                    <div>
                        <el-button type="danger" @click="exportList">导出</el-button>
                    </div>
                    <div style="display: flex;margin-right: 20px;">
                        <el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
                        <el-pagination
                                background
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                layout="prev, pager, next"
                                :total="total">
                        </el-pagination>
                        <el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
                    </div>
                </div>
            </el-scrollbar>
            <div v-if="!isHave" class="unFont">暂无数据</div>
        </el-main>
        <v-balance :status="status"></v-balance>
    </el-container>
</template>

<script>
import vBalance from "./common/balance.vue";
import { mapState } from "vuex";

export default {
  data() {
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
      chartData: {},
      searchData: {},
      tableData: [],
      isHave: true,
      loading: false,
      total: 0,
      last_page: 0,
      currentPage: 1,
      status: 1
    };
  },
  components: {
    vBalance
  },
  watch: {
    searchData() {
      this.fetchList(1);
    },
    balanceData() {
      this.fetchChart();
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchChart();
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            start: this.ruleForm.start * 1,
            end: this.ruleForm.end * 1
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.operationMonthList + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.list.length != 0) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
            this.last_page = res.data.data.page_count;
            this.$nextTick(() => {
              this.loading = false;
              this.isHave = true;
              this.currentPage = val;
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
    fetchChart: async function() {
      let url = this.api.operattionMonthChart;
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
    exportList: async function() {
      let url = this.api.operationMonthExport;
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