<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
	        <h5>护工排班</h5>
	        <div class="find">
	        	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
				  <el-form-item label="排班表名称" prop="name" label-width="100px">
				    <el-input type="text" v-model="ruleForm.name" style="width:100px" size="small" auto-complete="off"></el-input>
				  </el-form-item>
				   <el-form-item label="执行时间" prop="do_day" label-width="80px">
				       <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 140px;" v-model="ruleForm.do_day"></el-date-picker>
				  </el-form-item>
					<el-form-item label="状态" prop="type" label-width="50px" style="margin: 0;">
						<el-select v-model="ruleForm.type" clearable placeholder="请选择" size="small" style="width: 140px;">
							<el-option label="预增排班" :value="int1"></el-option>
							<el-option label="在执行排班" :value="int2"></el-option>
							<el-option label="已结束排班" :value="int3"></el-option>
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
	    <v-hgpbt :searchData="searchData"></v-hgpbt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VHgpbt from "./common/HGPBTable.vue";

export default {
  data() {
    return {
      ruleForm: {
        name: "",
        do_day: "",
        type: ""
      },
      rules: {},
      searchData: {},
      int1: 1,
      int2: 2,
      int3: 3
    };
  },
  components: {
    VHgpbt
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var do_day;
          if (this.ruleForm.do_day == "" || this.ruleForm.do_day == null) {
            do_day = "";
          } else {
            do_day = this.ruleForm.do_day.getTime() / 1000;
          }
          var data = {
            name: this.ruleForm.name,
						do_day: this.ruleForm.do_day,
						type: this.ruleForm.type ? this.ruleForm.type : 0
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
.nlpg {
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