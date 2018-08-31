<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
        <h5>预存管理</h5>
        <div class="find">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="老人姓名" prop="elder_name" label-width="100px">
              <el-input type="text" v-model="ruleForm.elder_name" style="width:100px" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone" label-width="70px">
              <el-input type="number" v-model="ruleForm.phone" style="width:120px" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="身份证" prop="id_number" label-width="70px">
              <el-input type="text" v-model="ruleForm.id_number" style="width:180px" size="small" auto-complete="off"></el-input>
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
        <v-ycglt :searchData="searchData"></v-ycglt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
  import VYcglt from './common/YCGLTable.vue'
    export default {
      data() {
        return {
          ruleForm: {
            elder_name: '',
            phone: '',
            id_number: ''
          },
          rules: {

          },
          searchData: {}
        };
      },
      components:{
        VYcglt
      },
      mounted(){

      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var data = {
                'elder_name': this.ruleForm.elder_name,
                'phone': this.ruleForm.phone,
                'id_number': this.ruleForm.id_number,
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
  .ycgl{
    background-color: #fff;
    min-height: 100%;
  }
  .top-tit{padding: 20px;border-bottom: 1px solid #ddd;overflow: hidden;}
  .top-tit h5{color: #ff8777;font-weight: normal;float: left;line-height: 30px;margin: 0;font-size: 18px}
  .demo-ruleForm{
    display: flex;
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
