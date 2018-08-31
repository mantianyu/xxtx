<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
	        <h5>交费登记</h5>
	        <div class="find">
	        	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				  <el-form-item label="老人姓名" prop="eldername">
				    <el-input type="text" v-model="ruleForm.eldername" style="width:100px" size="small" auto-complete="off"></el-input>
				  </el-form-item>
                    <el-form-item label="交费时间" prop="startDate" label-width="100px">
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
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;">
	    <v-jfdjt :searchData="searchData"></v-jfdjt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VJfdjt from "./common/JFDJTable.vue";

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
        eldername: "",
        startDate: "",
        endDate: ""
      },
      rules: {
        startDate: [{ validator: startdate, trigger: "change" }],
        endDate: [{ validator: enddate, trigger: "change" }]
      },
      searchData: {}
    };
  },
  components: {
    VJfdjt
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var startDate;
          var endDate;
          if (
            this.ruleForm.startDate == "" ||
            this.ruleForm.startDate == null
          ) {
            startDate = "";
          } else {
            startDate = this.ruleForm.startDate.getTime() / 1000;
          }
          if (this.ruleForm.endDate == "" || this.ruleForm.endDate == null) {
            endDate = "";
          } else {
            endDate = this.ruleForm.endDate.getTime() / 1000;
          }
          var data = {
            elder_name: this.ruleForm.eldername,
            start_time: startDate,
            end_time: endDate
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
.yyzd {
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