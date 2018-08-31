<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>外出登记</h5>
            <div class="find">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="老人姓名" prop="name">
                        <el-input type="text" v-model="ruleForm.name" style="width:100px" size="small" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="type" label-width="70px">
                        <el-select v-model="ruleForm.type" clearable placeholder="请选择类型" size="small" style="width:120px">
                            <el-option label="已返回" :value="int1"></el-option>
                            <el-option label="未返回" :value="int0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="外出时间" prop="date">
                        <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 140px;" v-model="ruleForm.date"></el-date-picker>
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
        <v-wcdjt :searchData="searchData"></v-wcdjt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
    import VWcdjt from './common/WCDJTable.vue'

    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    type: '',
                    date: ''
                },
                rules: {},
                int0: 0,
                int1: 1,
                searchData: {}
            };
        },
        components: {
            VWcdjt
        },
        mounted() {

        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var out_time;
                        if (this.ruleForm.date == '' || this.ruleForm.date == null) {
                            out_time = '';
                        } else {
                            out_time = this.ruleForm.date.getTime() / 1000;
                        }
                        var data = {
                            'elder_name': this.ruleForm.name,
                            'out_time': out_time,
                            'is_back': this.ruleForm.type
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
        font-size: 18px
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