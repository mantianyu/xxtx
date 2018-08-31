<template>
	<div class="addOtherPay">
    	<el-form :rules="rules" ref="form" :model="form" label-width="120px">
    		<div style="display: flex;flex-wrap: wrap;width: 800px;">
    			<el-form-item label="老人姓名:" prop="elder_id">
			    	<el-select v-model="form.elder_id" clearable placeholder="请选择老人" style="width: 620px;">
				      	<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
				    </el-select>
			  	</el-form-item>
			   	<el-form-item label="水费:" prop="waterfee">
			    	<el-input v-model="form.waterfee" style="width: 250px;" type="number"></el-input>
			  	</el-form-item>
			   	<el-form-item label="电费:" prop="powerfee">
			    	<el-input v-model="form.powerfee" style="width: 250px;" type="number"></el-input>
			  	</el-form-item>
			  	<el-form-item label="开始消费日期:" prop="start_date">
			      	<el-date-picker type="date" placeholder="选择日期" v-model="form.start_date" style="width: 250px;"></el-date-picker>
			  	</el-form-item>
			  	<el-form-item label="结束消费日期:" prop="end_date">
			      	<el-date-picker type="date" placeholder="选择日期" v-model="form.end_date" style="width: 250px;"></el-date-picker>
			  	</el-form-item>
			   	<el-form-item label="备注:" prop="introduction">
			    	<el-input type="textarea" v-model="form.introduction" style="width: 620px;"></el-input>
			  	</el-form-item>
    		</div>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
            </div>
		</el-form>
	</div>
</template>

<script>
import localEvent from "@/utils/local";

export default {
  props: ["elders"],
  data() {
    var startdate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseInputStartPayTime));
      } else {
        if (
          Date.parse(new Date(this.form.end_date)) < Date.parse(new Date(value))
        ) {
          callback(new Error(this.message.EndTimeWarning));
        }
        callback();
      }
    };
    var enddate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseInputEndPayTime));
      } else {
        if (
          Date.parse(new Date(this.form.start_date)) >
          Date.parse(new Date(value))
        ) {
          callback(new Error(this.message.EndTimeWarning));
        }
        callback();
      }
    };
    return {
      form: {
        elder_id: "",
        waterfee: "",
        powerfee: "",
        start_date: "",
        end_date: "",
        introduction: ""
      },
      rules: {
        elder_id: [
          { required: true, message: this.message.pleaseChoiceElderName, trigger: "change" }
        ],
        waterfee: [
          { required: true, message: this.message.pleaseInputCost, trigger: "blur" }
        ],
        powerfee: [
          { required: true, message: this.message.pleaseInputCost, trigger: "blur" }
        ],
        start_date: [{ validator: startdate, trigger: "change" }],
        end_date: [{ validator: enddate, trigger: "change" }]
      },
      bLoading: false
    };
  },
  watch: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elder_id: this.form.elder_id,
            waterfee: this.form.waterfee,
            powerfee: this.form.powerfee,
            start_date:
              new Date(this.form.start_date).getFullYear() +
              "-" +
              (new Date(this.form.start_date).getMonth() + 1) +
              "-" +
              new Date(this.form.start_date).getDate(),
            end_date:
              new Date(this.form.end_date).getFullYear() +
              "-" +
              (new Date(this.form.end_date).getMonth() + 1) +
              "-" +
              new Date(this.form.end_date).getDate(),
            introduction: this.form.introduction,
            employee_id: localEvent.StorageGetter("empId")
          };
          this.savePay(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    savePay: async function(data) {
      let url = this.api.addfixfeelists;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.addPayReginSuccess,
              type: "success"
            });
          this.$refs["form"].resetFields();
          this.bLoading = false;
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.addOtherPay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>