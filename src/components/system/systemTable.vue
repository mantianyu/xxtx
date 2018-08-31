<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>操作日志</h5>
            <div class="find">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="操作时间" prop="start_time">
                        <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="ruleForm.start_time" style="width: 160px;"></el-date-picker>
                    </el-form-item>
                        <b style="margin-left: 5px;margin-right: 5px;">~</b>
                    <el-form-item label="" prop="end_time" label-width="0">
                        <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="ruleForm.end_time" style="width: 160px;"></el-date-picker>
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
                        prop="user_account"
                        label="用户账号">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        label="用户姓名">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="用户角色名称">
                </el-table-column>
                <el-table-column
                        prop="department"
                        label="用户所在部门名称">
                </el-table-column>
                <el-table-column
                        prop="introduction"
                        label="操作说明">
                </el-table-column>
                <el-table-column
                        prop="ip"
                        label="操作时的ip地址">
                </el-table-column>
                <el-table-column
                        prop="time"
                        label="操作时间">
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div></div>
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
    </el-main>
  </el-container>
</template>

<script>
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
        start_time: "",
        end_time: ""
      },
      rules: {
				start_time: [
          { validator: startdate, trigger: 'change' }
        ],
				end_time: [
          { validator: enddate, trigger: 'change' }
        ]},
      tableData: [],
      total: 0,
      last_page: 0,
      searchData: {},
      loading: false,
      currentPage: 1
    };
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
  },
  methods: {
    submitForm(formName) {
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
            start: start_time,
            end: end_time
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
      let url = this.api.systemList + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.last_page = res.data.data.page_count;
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
          callback: action => {}
        });
      }
    }
  }
};
</script>

<style scoped>
.czrz {
  background-color: #fff;
  min-height: 100%;
  position: relative;
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
</style>