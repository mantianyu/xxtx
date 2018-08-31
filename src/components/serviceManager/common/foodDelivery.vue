<template>
	<div class="isDelivery" v-show="isDelivery">
		<div class="pop">
	        <div class="pop-top">
	            <h5>送餐</h5>
	            <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        		   	<el-form-item label="送餐人:" prop="deliveryid">
				    	<el-select v-model="form.deliveryid" clearable placeholder="请选择送餐人">
					      	<el-option v-for="(emp, key) in EMPs" :label="emp" :key="key" :value="key * 1"></el-option>
					    </el-select>
				  	</el-form-item>
				  	<el-form-item label="就餐时间段:" prop="mealtime">
				      	<el-select v-model="form.mealtime" clearable placeholder="请选择就餐时间段">
					      	<el-option v-for="(meal, key) in mealName" :label="meal" :key="key" :value="key * 1"></el-option>
					    </el-select>
				  	</el-form-item>
				  	<el-form-item label="送餐份数:" prop="deliverynum">
				      	<el-input v-model="form.deliverynum"></el-input>
				  	</el-form-item>
				  	<el-form-item label="送餐时间:" prop="deliverytime">
				      	<el-date-picker type="datetime" placeholder="选择日期" v-model="form.deliverytime"></el-date-picker>
				  	</el-form-item>
	                <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	                	<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
	                    <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
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
  props: ["mealName", "foodorderid", "eatmeal", "EMPs"],
  data() {
    return {
      form: {
        deliveryid: "",
        mealtime: "",
        deliverynum: "",
        deliverytime: ""
      },
      rules: {
        deliveryid: [
          { required: true, message: this.message.pleaseChoiceCaterer, trigger: "change" }
        ],
        mealtime: [
          { required: true, message: this.message.pleaseChoiceDinTime, trigger: "change" }
        ],
        deliverynum: [
          { required: true, message: this.message.pleaseChoiceMealsNumber, trigger: "blur" }
        ],
        deliverytime: [
          { required: true, message: this.message.choiceSendTime, trigger: "change" }
        ]
      },
      bLoading: false
    };
  },
  watch: {
    eatmeal() {
      this.form.mealtime = this.eatmeal;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            foodorderid: this.foodorderid,
            deliveryid: this.form.deliveryid,
            mealtime: this.form.mealtime,
            deliverynum: this.form.deliverynum,
            deliverytime: Date.parse(new Date(this.form.deliverytime)) / 1000
          };
          this.saveDelivery(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("deliveryFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    saveDelivery: async function(data) {
      let url = this.api.fooddelivery;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.fetchList(1);
          this.bLoading = false;
          this.hideEditFalse();
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
    showSelectFood() {
      this.$store.dispatch("selectFoodTrue");
    }
  },
  computed: mapState(["isDelivery"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 426px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -213px;
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
  position: fixed;
  width: 770px;
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
}
.isDelivery {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>