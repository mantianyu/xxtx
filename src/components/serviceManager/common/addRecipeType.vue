<template>
	<div class="addRecipeType" v-show="addRecipeType">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>食谱类别</h5>
	            <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        		   	<el-form-item label="食谱类别名称:" prop="name">
				    	<el-input v-model="form.name"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="金额:" prop="price">
				    	<el-input v-model="form.price" type="number"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="食谱类别备注:" prop="introduction">
				    	<el-input v-model="form.introduction"></el-input>
				  	</el-form-item>
					<el-form-item label="类别详情" prop="suitable_meals">
					    <el-checkbox-group v-model="form.suitable_meals">
					      	<el-checkbox v-for="(meal, key) in mealName" :label="key * 1" :key="key" name="suitable_meals">{{ meal }}</el-checkbox>
					    </el-checkbox-group>
					</el-form-item>
	                <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	                	<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
	                    <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
	                </div>
				</el-form>
	        </div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["recipeTypeId", "mealName"],
  data() {
    return {
      form: {
        name: "",
        price: "",
        introduction: "",
        suitable_meals: []
      },
      rules: {
        name: [
          { required: true, message: this.message.pleaseInputRecipeType, trigger: "blur" }
        ],
        price: [{ required: true, message: this.message.pleaseInputMoney, trigger: "blur" }]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    recipeTypeId() {
      if (this.recipeTypeId == 0) {
      } else {
        this.fetchDetail(this.recipeTypeId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.recipeTypeId == 0) {
            var data = {
              name: this.form.name,
              price: this.form.price,
              introduction: this.form.introduction,
              suitable_meals: this.form.suitable_meals
            };
            this.saveRecipeType(data);
          } else {
            var data = {
              id: this.recipeTypeId,
              name: this.form.name,
              price: this.form.price,
              introduction: this.form.introduction,
              suitable_meals: this.form.suitable_meals
            };
            this.saveRecipeType(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("recipeTypeFalse");
      this.$refs["form"].resetFields();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.recipesdetail;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.price = res.data.data.price;
          this.form.introduction = res.data.data.introduction;
          this.form.suitable_meals = res.data.data.suitable_meals;
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
    saveRecipeType: async function(data) {
      let url = this.api.addrecipestypes;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.recipeTypeId == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addRecipeSuccess,
              type: "success"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: this.message.changeRecipeSuccess,
              type: "success"
            });}
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
    }
  },
  computed: mapState(["addRecipeType"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 460px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -230px;
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
.addRecipeType {
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