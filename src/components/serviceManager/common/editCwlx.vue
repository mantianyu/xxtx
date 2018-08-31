<template>
	<div class="Edittslf" v-show="bedTypeEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>床位类型</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px">
        		   	<el-form-item label="类型名称:" prop="name">
				    	<el-input v-model="form.name"></el-input>
				  	</el-form-item>
				  	<el-form-item label="床位价格:" prop="bed_monthly_price">
				    	<el-input v-model.number="form.bed_monthly_price" type="number">
				    		<template slot="append">元/月</template>
				    	</el-input>

				  	</el-form-item>
				  	<el-form-item label="包房价格:" prop="house_monthly_price">
				    	<el-input v-model.number="form.house_monthly_price" type="number">
				    		<template slot="append">元/月</template>
				    	</el-input>
				  	</el-form-item>
				  	<el-form-item label="床位描述:" prop="introduction">
					    <el-input type="textarea" v-model="form.introduction"></el-input>
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
  props: ["bedTypeId"],
  data() {
    return {
      form: {
        name: "",
        bed_monthly_price: "",
        house_monthly_price: "",
        introduction: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputTypeName, trigger: "blur" }],
        bed_monthly_price: [
          { required: true, message: this.message.pleaseInputBedPrice, trigger: "blur" }
        ],
        house_monthly_price: [
          { required: true, message: this.message.pleaseInputMonthPrice, trigger: "blur" }
        ]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    bedTypeId() {
      if (this.bedTypeId == 0) {
      } else {
        this.fetchDetail(this.bedTypeId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.bedTypeId == 0) {        
            var data = {
              name: this.form.name,
              bed_monthly_price: this.form.bed_monthly_price,
              house_monthly_price: this.form.house_monthly_price,
              introduction: this.form.introduction
            };
            this.saveBedType(data);
          } else {
            var data = {
              name: this.form.name,
              bed_monthly_price: this.form.bed_monthly_price,
              house_monthly_price: this.form.house_monthly_price,
              introduction: this.form.introduction,
              id: this.bedTypeId
            };
            this.saveBedType(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("bedTypeEditFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.RecipesDetailBedType;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.bed_monthly_price = res.data.data.bed_monthly_price;
          this.form.house_monthly_price = res.data.data.house_monthly_price;
          this.form.introduction = res.data.data.introduction;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.hideEditFalse();
              this.loading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.hideEditFalse();
            this.loading = false;
          }
        });
      }
    },
    saveBedType: async function(data) {
      let url = this.api.addBedtype;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.bedTypeId == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addSuccess,
              type: "success"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: this.message.changeSuccess,
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
  computed: mapState(["bedTypeEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 470px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -235px;
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
.Edittslf {
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