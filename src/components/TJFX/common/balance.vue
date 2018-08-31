<template>
	<div class="balance" v-show="balance">
		<div class="pop">
	        <div class="pop-top">
	            <h5>数据对比</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	        		<div style="display: flex; flex-wrap: wrap;">
	        			<el-form-item :label="status === 0 ? '年度筛选：' : status === 1 ? '月度筛选：' : '月度筛选：'" prop="year1">
                            <el-date-picker :type="status === 0 ? 'year' : status === 1 ? 'month' : 'month'" size="small" :value-format="status === 0 ? 'yyyy' : 'yyyyMM'" placeholder="选择日期" style="width: 140px;" v-model="form.year1"></el-date-picker>
                        </el-form-item>
	        			<el-form-item :label="status === 0 ? '年度筛选：' : status === 1 ? '月度筛选：' : '月度筛选：'" prop="year2">
                            <el-date-picker :type="status === 0 ? 'year' : status === 1 ? 'month' : 'month'" size="small" :value-format="status === 0 ? 'yyyy' : 'yyyyMM'" placeholder="选择日期" style="width: 140px;" v-model="form.year2"></el-date-picker>
                        </el-form-item>
	        			<el-form-item v-if="status !== 2" :label="status === 0 ? '年度筛选：' : status === 1 ? '月度筛选：' : '月度筛选：'" prop="year3">
                            <el-date-picker :type="status === 0 ? 'year' : status === 1 ? 'month' : 'month'" size="small" :value-format="status === 0 ? 'yyyy' : 'yyyyMM'" placeholder="选择日期" style="width: 140px;" v-model="form.year3"></el-date-picker>
                        </el-form-item>
	        		</div>
	                <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	                	<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
	                    <el-button type="danger" size="medium" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
	                </div>
				</el-form>
	        </div>
	    </div>
	</div>
</template>

<script>
import ChinaIdChecker from "@/utils/chinaId";
import { mapState } from "vuex";

export default {
  props: ["status"],
  data() {
    return {
      form: {
        year1: "",
        year2: "",
        year3: "",
      },
      rules: {
        
      },
    };
  },
  watch: {
    
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = [];
          if(this.form.year1){
            data.push(this.form.year1 * 1);
          }
          if(this.form.year2){
            data.push(this.form.year2 * 1);
          }
          if(this.form.year3){
            data.push(this.form.year3 * 1);
          }
          this.$store.dispatch("balanceData", data);
          this.hideEditFalse();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("balanceFalse");
      this.$refs["form"].resetFields();
    },
    
  },
  computed: mapState(["balance"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 400px;
  max-height: 500px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -250px;
  left: 50%;
  margin-left: -200px;
}
.pop-top {
  border-bottom: 1px #e5e5e5 solid;
  padding: 0 20px;
  overflow: hidden;
  background: #f2f2f2;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
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
}
.balance {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>