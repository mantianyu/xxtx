<template>
	<div class="addFoodType" v-show="addFoodType">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>食物类别</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        		   	<el-form-item label="食物类别名称:" prop="fname">
				    	<el-input v-model="form.fname"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="食物类别介绍:" prop="fintroduction">
				    	<el-input v-model="form.fintroduction"></el-input>
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
  props: ["foodTypeId"],
  data() {
    return {
      form: {
        fname: "",
        fintroduction: ""
      },
      rules: {
        fname: [
          {
            required: true,
            message: this.message.pleaseInputFoodType,
            trigger: "blur"
          }
        ]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    foodTypeId() {
      if (this.foodTypeId == 0) {
      } else {
        this.fetchDetail(this.foodTypeId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.foodTypeId == 0) {
            var data = {
              fname: this.form.fname,
              fintroduction: this.form.fintroduction
            };
            this.saveFoodType(data);
          } else {
            var data = {
              fid: this.foodTypeId,
              fname: this.form.fname,
              fintroduction: this.form.fintroduction
            };
            this.saveFoodType(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addFoodTypeFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.foodtypedetails;
      var data = {
        fid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.fname = res.data.data.name;
          this.form.fintroduction = res.data.data.introduction;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hideEditFalse();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEditFalse();
          }
        });
      }
    },
    saveFoodType: async function(data) {
      let url = this.api.foodtype;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.foodTypeId == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addFoodTypeSuccess,
              type: "success"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: this.message.changeFoodTypeSuccess,
              type: "success"
            });
            }
          this.$parent.fetchFoodTypeList();
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
    }
  },
  computed: mapState(["addFoodType"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 325px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
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
.addFoodType {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>