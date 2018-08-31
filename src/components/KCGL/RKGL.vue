<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>入库管理</h5>
            <div class="find">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="仓库名称" prop="name">
                    <el-select v-model="ruleForm.name" clearable placeholder="请选择" size="small" style="width: 140px;">
                        <el-option v-for="(repo, key) in repo" :label="repo.name" :value="repo.id" :key="key"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="入库单号" prop="order_id">
                        <el-input type="text" v-model="ruleForm.order_id" style="width:160px" size="small" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="入库时间" prop="startDate" label-width="100px">
                        <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.startDate"></el-date-picker>
                    </el-form-item>
                        <b style="margin-left: 5px;margin-right: 5px;">~</b>
                    <el-form-item label="" prop="endDate" label-width="0">
                        <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.endDate"></el-date-picker>
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
        <v-rkglt :searchData="searchData" :repo="repo" :operator="operator" :goods="goods"></v-rkglt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VRkglt from "./common/RKGLTable.vue";

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
    return {
      ruleForm: {
        name: "",
        order_id: "",
        startDate: "",
        endDate: ""
      },
      rules: {
        startDate: [{ validator: startdate, trigger: "change" }],
        endDate: [{ validator: enddate, trigger: "change" }]
      },
      searchData: {},
      repo: [],
      operator: [],
      goods: []
    };
  },
  components: {
    VRkglt
  },
  mounted() {
    this.fetchInComekv();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            repo_id: this.ruleForm.name,
            order_id: this.ruleForm.order_id,
            begin_time: this.ruleForm.startDate
              ? Date.parse(new Date(this.ruleForm.startDate)) / 1000
              : "",
            end_time: this.ruleForm.endDate
              ? Date.parse(new Date(this.ruleForm.endDate)) / 1000
              : ""
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchInComekv: async function() {
      let url = this.api.getincomekv;
      let data = {};
      const res = await this.$http.post(url, data);
      this.repo = res.data.data.repo;
      this.operator = res.data.data.operator;
      this.goods = res.data.data.goods;
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
    width: 500px;
    justify-content: flex-start;
  }
}
</style>