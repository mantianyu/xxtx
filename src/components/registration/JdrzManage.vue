<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
        <h5>入住登记</h5>
        <div class="find">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
            <el-form-item label="老人姓名" prop="eldername">
              <el-input type="text" v-model="ruleForm.eldername" style="width:100px" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="老人性别" prop="sex" style="width: 180px;margin: 0;" size="small">
              <el-select v-model="ruleForm.sex" clearable placeholder="请选择">
                <el-option label="男" :value="int1"></el-option>
                <el-option label="女" :value="int2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status" style="width: 220px;margin: 0;" label-width="60px" size="small">
              <el-select v-model="ruleForm.status" clearable placeholder="请选择">
                <el-option label="基础信息登记" :value="int1"></el-option>
                <el-option label="健康评估登记" :value="int2"></el-option>
                <el-option label="餐饮床位护理登记" :value="int3"></el-option>
                <el-option label="入住缴费登记" :value="int4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="elderidcard">
            <el-input type="text" v-model="ruleForm.elderidcard" style="width:180px" size="small" auto-complete="off"></el-input>
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
        <v-rzdjt :searchData="searchData" :inStatus="inStatus"></v-rzdjt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
  import VRzdjt from './common/RZDJTable.vue'
  export default {
    data() {
      return {
        ruleForm: {
          eldername: '',
          sex: '',
          status: '',
          elderidcard: '',
        },
        rules: {

        },
        searchData: {},
        int1: 1,
        int2: 2,
        int3: 3,
        int4: 4,
        inStatus: ''
      }
    },
    components:{
      VRzdjt
    },
    mounted(){

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = {
              'eldername': this.ruleForm.eldername,
              'sex': this.ruleForm.sex,
              'status': this.ruleForm.status,
              'elderidcard': this.ruleForm.elderidcard
            }
            this.searchData = data;
            this.inStatus = this.ruleForm.status;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped>
  .top-tit{
    padding: 20px;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
  }
  .top-tit h5{
    color: #ff8777;
    font-weight: normal;
    float: left;
    line-height: 30px;
    margin: 0;
    font-size: 18px;
  }
  .find form{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .el-form-item {
    margin-bottom: 0;
  }

</style>
