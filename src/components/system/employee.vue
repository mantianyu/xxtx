<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>员工管理</h5>
            <div class="find">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="姓名：" prop="empoylee_name">
                        <el-input type="text" v-model="ruleForm.empoylee_name" style="width:100px" size="small" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部门：" prop="department_id">
                        <el-select v-model="ruleForm.department_id" clearable placeholder="请选择部门" size="small" style="width:120px">
                            <el-option v-for="(depart, key) in depart" :label="depart.name" :value="depart.id" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-select v-model="ruleForm.status" clearable placeholder="请选择类型" size="small" style="width:120px">
                            <el-option label="在职" :value="int1"></el-option>
                            <el-option label="离职" :value="int0"></el-option>
                        </el-select>
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
        <v-empt :searchData="searchData"></v-empt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VEmpt from './EMPTable.vue'

export default {
  data() {
    return {
      ruleForm: {
        empoylee_name: "",
        department_id: "",
        status: ""
      },
      rules: {},
      int0: 0,
      int1: 1,
      depart: [],
      searchData: {}
    };
  },
  components: {
    VEmpt
  },
  mounted() {
    this.fetchDepart();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            empoylee_name: this.ruleForm.empoylee_name,
            department_id: this.ruleForm.department_id,
            status: this.ruleForm.status
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchDepart: async function() {
      let url = this.api.getshowdepartmentslist;
      let data = {};
      const res = await this.$http.post(url, data);
      this.depart = res.data.data;
    }
  }
};
</script>

<style scoped>
.wcdj {
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