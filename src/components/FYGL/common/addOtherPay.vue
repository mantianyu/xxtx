<template>
	<div class="addOtherPay">
    	<el-form :rules="rules" ref="form" :model="form" label-width="120px">
    		<div style="display: flex;flex-wrap: wrap;width: 800px;">
    			<el-form-item label="老人姓名:" prop="elder_id">
			    	<el-select v-model="form.elder_id" clearable placeholder="请选择老人" style="width: 250px;">
				      	<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
				    </el-select>
			  	</el-form-item>
			   	<el-form-item label="费用类别:" prop="price_type_id">
			    	<el-select v-model="form.price_type_id" clearable placeholder="请选择费用类别" style="width: 250px;" @change="changePriceType">
				      	<el-option v-for="(type, key) in payType" :label="type.name" :value="type.id" :key="key"></el-option>
				    </el-select>
			  	</el-form-item>
			   	<el-form-item label="消费金额:" prop="amount">
			    	<el-input v-model="form.amount" style="width: 250px;" type="number"></el-input>
			  	</el-form-item>
			  	<el-form-item label="消费时间:" prop="time">
			      	<el-date-picker type="datetime" placeholder="选择时间" v-model="form.time" style="width: 250px;"></el-date-picker>
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
  props: ["elders", "payType"],
  data() {
    return {
      form: {
        elder_id: "",
        amount: "",
        price_type_id: "",
        time: "" + new Date(),
        introduction: ""
      },
      rules: {
        elder_id: [
          { required: true, message: this.message.pleaseChoiceElderName, trigger: "change" }
        ],
        amount: [
          { required: true, message: this.message.pleaseInputCost, trigger: "blur" }
        ],
        price_type_id: [
          { required: true, message: this.message.pleaseChoiceCostType, trigger: "change" }
        ],
        time: [{ required: true, message: this.message.pleaseChoiceCostDate, trigger: "change" }]
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
            amount: this.form.amount,
            price_type_id: this.form.price_type_id,
            time: Date.parse(new Date(this.form.time)) / 1000,
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
      let url = this.api.addfeelists;
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
    },
    changePriceType(val) {
      for (let i = 0; i < this.payType.length; i++) {
        if (this.payType[i].id === val) {
          this.form.amount = this.payType[i].price;
          break;
        }
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