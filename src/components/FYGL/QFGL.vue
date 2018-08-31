<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
        <h5>欠费管理</h5>
        <div class="find">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
            <el-form-item label="老人姓名" prop="elder_name">
              <el-input type="text" v-model="ruleForm.elder_name" style="width:100px" size="small" auto-complete="off"></el-input>
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
          :data="tableData"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange">
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
            prop="deposits"
            label="押金(元)">
          </el-table-column>
          <el-table-column
            prop="imprests"
            label="余额(元)">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="消费(元)">
          </el-table-column>
          <el-table-column
            prop="arrearage"
            label="欠费(元)">
          </el-table-column>
          <el-table-column
            prop="month"
            label="账单月份">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showCheckOut(scope.row)">交费/预存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>

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
    </el-main>
    <v-qfglt :checkInId="checkInId"></v-qfglt>
  </el-container>
</template>

<script>
import VQfglt from "./common/QFGLTable.vue";

export default {
  data() {
    return {
      ruleForm: {
        elder_name: ""
      },
      rules: {},
      searchData: {},
      tableData: [],
      checkInId: 0,
      total: 0,
      last_page: 0,
      loading: false,
      currentPage: 1
    };
  },
  components: {
    VQfglt
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
          var data = {
            elder_name: this.ruleForm.elder_name
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getfeemanagelists + "?page=" + val;
      var data = this.searchData;
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
          this.checkInId = 0;
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
    showCheckOut(scope) {
      this.checkInId = scope.check_in_id;
      this.$store.dispatch("qfglCheckOutTrue");
    },
    clean() {
      this.checkInId = 0;
    }
  }
};
</script>

<style scoped>
.qfgl {
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
</style>
