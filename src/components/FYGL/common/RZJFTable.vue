<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
        <h5>入住缴费</h5>
        <div class="find">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="老人姓名" prop="old_name">
              <el-input type="text" v-model="ruleForm.old_name" size="small" auto-complete="off" style="width: 140px;"></el-input>
            </el-form-item>
            <el-form-item label="收费员" prop="name">
              <el-input type="text" v-model="ruleForm.name" size="small" auto-complete="off" style="width: 140px;"></el-input>
            </el-form-item>
            <el-form-item label="交费时间" prop="start_time" label-width="100px">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.start_time"></el-date-picker>
            </el-form-item>
                <b style="margin-left: 5px;margin-right: 5px;">~</b>
            <el-form-item label="" prop="end_time" label-width="0">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.end_time"></el-date-picker>
            </el-form-item>
            <div style="margin-left: 10px">
              <el-button type="danger" size="small" @click="submitFormS('ruleForm')">查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
        <div>
          <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              type="index"
              width="55">
            </el-table-column>
            <el-table-column
              prop="old_name"
              label="老人姓名">
            </el-table-column>
            <el-table-column
              prop="bed_name"
              label="床位号">
            </el-table-column>
            <el-table-column
              prop="final_dues"
              label="交费金额">
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="交费时间">
            </el-table-column>
            <el-table-column
              prop="employee_name"
              label="收费员">
            </el-table-column>
            <el-table-column
              prop="type"
              label="费用说明">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showDetailTrue(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
            <div>
              <!-- <el-button type="success" @click="showAddRzjf">新增</el-button> -->
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
        </div>
      </el-scrollbar>
    </el-main>
    <v-rzjfdetail :feeid="feeid"></v-rzjfdetail>
  </el-container>
</template>

<script>
import VRzjfdetail from "./rzjfdetail.vue";
export default {
  data() {
    var startdate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.end_time)) <
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    var enddate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.start_time)) >
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    return {
      ruleForm: {
        old_name: "",
        name: "",
        start_time: "",
        end_time: ""
      },
      rules: {
        start_time: [{ validator: startdate, trigger: "change" }],
        end_time: [{ validator: enddate, trigger: "change" }]
      },
      searchData: {},
      tableData: [],
      total: 0,
      last_page: 0,
      feeid: 0,
      method: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    VRzjfdetail
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchMethod();
  },
  methods: {
    submitFormS(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var start_time;
          var end_time;
          if (
            this.ruleForm.start_time == "" ||
            this.ruleForm.start_time == null
          ) {
            start_time = "";
          } else {
            start_time = this.ruleForm.start_time.getTime() / 1000;
          }
          if (this.ruleForm.end_time == "" || this.ruleForm.end_time == null) {
            end_time = "";
          } else {
            end_time = this.ruleForm.end_time.getTime() / 1000;
          }
          var data = {
            old_name: this.ruleForm.old_name,
            name: this.ruleForm.name,
            start_time: start_time,
            end_time: end_time
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getfeementlist + "?page=" + val;
      let data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.data.length == 0) {
            this.$notify({
              title: this.message.hint,
              message: this.message.informationNoExist,
              type: "warning"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: `为您搜索到${res.data.data.total}条信息`,
              type: "success"
            });
          }
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
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
          }
        });
      }
    },
    showAddRzjf() {
      this.$router.push({ path: `/jdxxcrzjf` });
    },
    fetchMethod: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_PAY_METHOD
      };
      const res = await this.$http.post(url, data);
      this.method = res.data.data;
    },
    showDetailTrue(scope) {
      this.feeid = scope.id;
      this.$store.dispatch("rzjfDetailTrue");
    }
  }
};
</script>

<style scoped>
.rzjf {
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.el-form-item {
  margin-bottom: 0;
}
@media screen and (max-width: 1380px) {
  .find {
    display: flex;
    justify-content: flex-end;
  }
  .find form {
    width: 445px;
    justify-content: flex-start;
  }
}
</style>
