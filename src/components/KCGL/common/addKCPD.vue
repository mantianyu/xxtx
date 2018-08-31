<template>
	<div class="addKCPD" v-show="addKCPD">
		<div class="pop">
      <div class="pop-top">
        <h5>新增</h5>
        <span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
      </div>
      <div class="qxz">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
          <div style="display: flex;flex-wrap: wrap;">
            <el-form-item label="选择仓库:" prop="repo_id">
              <el-select v-model="form.repo_id" clearable placeholder="请选择仓库" style="width: 220px;" @change="selectRepo">
                <el-option v-for="(type, key) in repo" :label="type.name" :value="type.id" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="库管人员:" prop="manager">
              <el-input disabled v-model="form.manager" style="width: 220px;"></el-input>
            </el-form-item>
            <el-form-item label="盘点人员:" prop="checker">
              <el-input disabled v-model="form.checker" style="width: 220px;"></el-input>
            </el-form-item>
            <el-form-item label="盘点日期:" prop="check_date">
              <el-date-picker disabled type="date" placeholder="选择日期" v-model="form.check_date" style="width: 220px;"></el-date-picker>
            </el-form-item>
          </div>
          <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
            <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
            <el-button type="danger" size="medium" style="margin-left: 30px;" @click="submitForm('form')">下一步</el-button>
          </div>
        </el-form>
      </div>
    </div>
	</div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["repo"],
  data() {
    return {
      form: {
        repo_id: "",
        manager: "",
        checker: "",
        check_date: new Date()
      },
      rules: {
        repo_id: [
          { required: true, message: this.message.pleaseChoiceApplyWarehouse, trigger: "change" }
        ]
      }
    };
  },
  watch: {
    repo_id(){
      if(this.repo_id === 0){
        this.$refs["form"].resetFields();
      }
    }
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch("repoId", this.form.repo_id);
          this.$store.dispatch("PDRepoTrue");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("repoId", 0);
      this.$store.dispatch("addKCPDFalse");
      this.$refs["form"].resetFields();
    },
    selectRepo(val) {
      for (let i = 0; i < this.repo.length; i++) {
        if (this.repo[i].id === val) {
          this.form.manager = this.repo[i].manager;
          break;
        }
      }
    }
  },
  computed: mapState(["addKCPD", "repo_id"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 310px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -155px;
  left: 50%;
  margin-left: -400px;
}
.pop-top {
  border-bottom: 1px #e5e5e5 solid;
  padding: 0 20px;
  overflow: hidden;
  background: #f2f2f2;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  z-index: 99;
}
.pop-top h5 {
  float: left;
  font-weight: normal;
  font-size: 16px;
  line-height: 50px;
  margin: 0;
}
.pop-top span {
  float: right;
  cursor: pointer;
  display: block;
  width: 12px;
  height: 12px;
  margin-top: 20px;
}
.qxz {
  padding: 40px;
  margin-top: 25px;
  padding-top: 0;
}
.addKCPD {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>