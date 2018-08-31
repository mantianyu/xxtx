<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
			<h5>住院老人</h5>
			<div class="find">
				<el-form :model="ruleForm" size="small" :rules="rules" label-width="80px" ref="ruleForm" :inline="true" @submit.native.prevent>
					<el-form-item label="老人姓名" prop="name">
						<el-input v-model="ruleForm.name" style="width:100px" size="small" placeholder="姓名"></el-input>
					</el-form-item>
					<!-- <el-form-item label="身份证号" prop="idnumber">
						<el-input v-model="ruleForm.idnumber" placeholder="身份证号" size="small"></el-input>
					</el-form-item> -->
					<el-form-item style="margin-left: 10px">
						<div style="margin-left: 10px;float: left">
							<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
		<vlrxxxqtb :searchData="searchData"></vlrxxxqtb>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import vlrxxxqtb from "./common/LRXXXQTable.vue";

export default {
  data() {
    return {
      ruleForm: {
        name: "",
        idnumber: "",
        // startage: "",
        // endage: ""
      },
      rules: {},
      searchData: {},
      goOut: true
    };
  },
  components: {
    vlrxxxqtb
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            name: this.ruleForm.name,
            idnumber: this.ruleForm.idnumber,
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
.lrxxxq {
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

.el-select-dropdown__wrap el-scrollbar__wrap {
  overflow: visible !important;
}
</style>