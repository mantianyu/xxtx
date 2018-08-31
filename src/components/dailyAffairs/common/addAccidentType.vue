<template>
	<div class="addAccidentType" v-show="addAccidentType">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>事故类型</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px">
        		   	<el-form-item label="事故类型名称:" prop="typename">
				    	<el-input v-model="form.typename"></el-input>
				  	</el-form-item>
					<el-form-item label="事故等级" prop="levelid">
					    <el-select v-model="form.levelid" clearable placeholder="请选择事故等级">
					    	<el-option v-for="(accide, key) in accident" :label="accide" :value="key * 1" :key="key"></el-option>
					    </el-select>
					</el-form-item>
        		   	<el-form-item label="联系人:" prop="contactname">
				    	<el-input v-model="form.contactname"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="联系电话:" prop="telphone">
				    	<el-input v-model="form.telphone"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="类型描述:" prop="introduction">
				    	<el-input type="textarea" v-model="form.introduction"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="处理预案:" prop="contingencyplan">
				    	<el-input type="textarea" v-model="form.contingencyplan"></el-input>
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
  props: ["accidentTypeId", "accident"],
  data() {
    let phoneCheck = (rule, value, callback) => {
      if(value === ""){
        return callback(new Error(this.message.pleaseInputPhone));
      } else if (value < 0) {
         callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      form: {
        typename: "",
        levelid: "",
        contactname: "",
        telphone: "",
        introduction: "",
        contingencyplan: ""
      },
      rules: {
        typename: [
          { required: true, message: this.message.pleaseInputAccident, trigger: "blur" }
        ],
        levelid: [
          { required: true, message: this.message.pleaseChoiceAccidentLevel, trigger: "change" }
        ],
        contactname: [
          { required: true, message: this.message.pleaseChoiceLinkman, trigger: "blur" }
        ],
        telphone: [
          { required: true, message: this.message.pleaseChoicePhone, trigger: "blur" }
        ],
        introduction: [
          { required: true, message: this.message.pleaseChoiceTypeDes, trigger: "blur" }
        ],
        contingencyplan: [
          { required: true, message: this.message.pleaseChoiceTreatment, trigger: "blur" }
        ],
        telphone: [
          { required: true, validator: phoneCheck, trigger: "blur" }
        ]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    accidentTypeId() {
      if (this.accidentTypeId == 0) {
      } else {
        this.fetchDetail(this.accidentTypeId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.accidentTypeId == 0) {
            var data = {
              typename: this.form.typename,
              levelid: this.form.levelid,
              contactname: this.form.contactname,
              telphone: this.form.telphone,
              introduction: this.form.introduction,
              contingencyplan: this.form.contingencyplan
            };
            this.saveBed(data);
          } else {
            var data = {
              typeid: this.accidentTypeId,
              typename: this.form.typename,
              levelid: this.form.levelid,
              contactname: this.form.contactname,
              telphone: this.form.telphone,
              introduction: this.form.introduction,
              contingencyplan: this.form.contingencyplan
            };
            this.saveBed(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addAccidentTypeFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.accidenttypeinfo;
      var data = {
        typeid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.typename = res.data.data.name;
          this.form.levelid = res.data.data.level;
          this.form.contactname = res.data.data.contact;
          this.form.telphone = res.data.data.phone;
          this.form.introduction = res.data.data.introduction;
          this.form.contingencyplan = res.data.data.contingency_plan;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(this.message.timeOut, "", {
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
    saveBed: async function(data) {
      let url = this.api.accidenttype;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.accidentTypeId == 0){
            this.$notify({
              title: this.message.success,
              message: this.message.addSuccess,
              type: "success"
            });
          }else{
             this.$notify({
              title: this.message.success,
              message: this.message.changeSuccess,
              type: "success"
            });
          }   
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
  computed: mapState(["addAccidentType"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 580px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -290px;
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
  width: 760px;
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
.addAccidentType {
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