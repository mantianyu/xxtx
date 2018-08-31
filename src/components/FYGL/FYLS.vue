<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
        <h5>费用流水</h5>
        <div class="find">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="老人姓名" prop="elder_name">
              <el-input type="text" v-model="ruleForm.elder_name" style="width:100px" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="交费时间" prop="time">
              <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 140px;" v-model="ruleForm.time"></el-date-picker>
            </el-form-item>
            <div style="margin-left: 10px">
              <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;">
        <el-table
          v-loading="loading"
          :data="tableDataFYLS"
          style="width: 100%"
          stripe
          @selection-change="handleSelectionChange">
          <el-table-column
            type="index"
            width="55">
          </el-table-column>
          <el-table-column
            prop="elder_name"
            label="老人姓名">
          </el-table-column>
          <el-table-column
            prop="bed_name"
            label="床位号">
          </el-table-column>
          <el-table-column
            prop="fee_type"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额(元)">
          </el-table-column>
          <el-table-column
            prop="employee_name"
            label="收费员">
          </el-table-column>
          <el-table-column
            prop="date_time"
            label="费用时间">
          </el-table-column>
          <el-table-column
            prop="price_type_name"
            label="费用类别">
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注">
          </el-table-column>
        </el-table>
        <div class="fenye">
          <div style="display: flex;margin: 20px;float: right;">
            <el-button type="primary" size="small" @click="JdrzManageList(1)">首页</el-button>
            <el-pagination
              background
              @current-change="handleCurrentChange"
					    :current-page="currentPage"
              layout="prev, pager, next"
              :total="total">
            </el-pagination>
            <el-button type="primary" size="small" @click="JdrzManageList(last_page)">末页</el-button>
          </div>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        elder_name: "",
        time: ""
      },
      rules: {},
      searchData: {},
      tableDataFYLS: [],
      multipleSelection: [],
      total: 0,
      last_page: 0,
      loading: false,
      currentPage: 1
    };
  },
  watch: {
    searchData() {
      this.JdrzManageList(1);
    }
  },
  mounted() {
    this.JdrzManageList(1);
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.JdrzManageList(val);
    },
    JdrzManageList: async function(val) {
      this.loading = true;
      let url = this.api.paymentrecordslist + "?page=" + val;
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
          this.tableDataFYLS = [];
          this.tableDataFYLS = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let time = "";
          if (this.ruleForm.time != "") {
            time = Date.parse(new Date(this.ruleForm.time)) / 1000;
          }
          var data = {
            elder_name: this.ruleForm.elder_name,
            time: time
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.fyls {
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
