<template>
  <el-container class="nlpg">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
          <h5>咨询登记</h5>
        <div class="cha">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="咨询姓名" prop="zxname" style="margin: 0;">
              <el-input type="text" v-model="ruleForm.zxname" size="small" auto-complete="off" style="width: 140px;"></el-input>
            </el-form-item>
            <el-form-item label="老人姓名" prop="name">
              <el-input type="text" v-model="ruleForm.name" size="small" auto-complete="off" style="width: 140px;"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="type" label-width="50px" style="margin: 0;">
              <el-select v-model="ruleForm.type" clearable placeholder="请选择" size="small" style="width: 140px;">
                <el-option label="咨询" :value="int0"></el-option>
                <el-option label="已预约" :value="int1"></el-option>
                <el-option label="已入住" :value="int2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="咨询日期" prop="date" style="margin: 0;">
              <el-date-picker type="date" size="small" placeholder="选择日期" v-model="ruleForm.startDate" style="width: 140px;"></el-date-picker>
              <b>~</b>
              <el-date-picker type="date" size="small" placeholder="选择日期" v-model="ruleForm.endDate" style="width: 140px;"></el-date-picker>
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
        <v-zxdjt :searchData="searchData"></v-zxdjt>
      </el-scrollbar>
    </el-main>
    
  </el-container>
</template>

<script>
  import vZxdjt from './common/ZXDJtable.vue'
  export default {
    data() {
      return {
        ruleForm: {
          zxname:'',
          name:'',
          type: "",
          startDate:"",
          endDate:""
        } ,
        rules: {

        },
        searchData: {},
        int0: 0,
        int1: 1,
        int2: 2
      };
    },
    components:{
      vZxdjt
    },
    mounted(){

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.startDate == '' || this.ruleForm.startDate == null || this.ruleForm.endDate == '' || this.ruleForm.endDate == null ){
              var data = {
                'consultings_name': this.ruleForm.zxname,
                'elder_name': this.ruleForm.name,
                'status': this.ruleForm.type,
                'start_time': this.ruleForm.startDate ? Date.parse(new Date(this.ruleForm.startDate)) / 1000 : '',
                'end_time': this.ruleForm.endDate ? Date.parse(new Date(this.ruleForm.endDate)) / 1000 : '',
              }
              this.searchData = data;
            }else{
              if(Date.parse(new Date(this.ruleForm.startDate)) > Date.parse(new Date(this.ruleForm.endDate))){
                this.$alert(this.message.startNoLaterEnd, '', {
                confirmButtonText: this.message.confirm,
                callback: action => {
                  
                }
              });
              }else{
                var data = {
                  'consultings_name': this.ruleForm.zxname,
                  'elder_name': this.ruleForm.name,
                  'status': this.ruleForm.type,
                  'start_time': Date.parse(new Date(this.ruleForm.startDate)) / 1000,
                  'end_time': Date.parse(new Date(this.ruleForm.endDate)) / 1000,
                }
                this.searchData = data;
              }
            }
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
  .nlpg{
    background-color: #fff;
    height: 100%;
  }
  .top-tit{padding: 20px;border-bottom: 1px solid #ddd;overflow: hidden;}
    .top-tit h5{color: #ff8777;font-weight: normal;float: left;line-height: 30px;margin: 0;font-size: 18px}
    .demo-ruleForm{
      display: flex;
    }
  .cha form{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .cha span{
    margin-left: 6px;
  }
  @media screen and (max-width: 1550px) {
    .cha{
      display: flex;
      justify-content: flex-end;
    }
    .cha form {
      width: 640px;
    justify-content: flex-start;
    }
  }
</style>
