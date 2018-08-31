<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
        <h5>预约登记</h5>
        <div class="cha">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
            <el-form-item label="预约人姓名" prop="name" style="width: 200px;">
              <el-input type="text" v-model="ruleForm.name" style="width:100px" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="老人姓名" prop="old_name"  style="width: 200px;">
              <el-input type="text" v-model="ruleForm.old_name" style="width:100px" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-button type="danger" size="small" @click="submitForm('ruleForm')" style="margin-left: 20px;">查询</el-button>
          </el-form>
        </div>
      </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
        <v-yydjt :searchData="searchData"></v-yydjt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
  import VYydjt from './common/YYDJtable.vue'
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          old_name: '',
        },
        rules: {

        },
        searchData: {}
      }
    },
    components:{
      VYydjt
    },
    mounted(){

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = {
              'name': this.ruleForm.name,
              'old_name': this.ruleForm.old_name,
            }
            this.searchData = data;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },




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

  .demo-ruleForm{
    display: flex;
  }
  .cha{width: 30%;
    float: right;}
  .cha form{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .el-form-item {
    margin-bottom: 0;
  }

</style>
