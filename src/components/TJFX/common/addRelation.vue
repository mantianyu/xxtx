<template>
	<div class="addRelation" v-show="addRelation">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>添加亲属</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	        		<div style="display: flex; flex-wrap: wrap;">
	        			<el-form-item label="亲属姓名:" prop="ername">
					    	<el-input v-model="form.ername" style="width: 200px;"></el-input>
					  	</el-form-item>
					  	<el-form-item label="联系电话:" prop="telphone">
					    	<el-input v-model="form.telphone" style="width: 200px;"></el-input>
					  	</el-form-item>
					  	<el-form-item label="身份证号:" prop="idcard">
					    	<el-input v-model="form.idcard" style="width: 200px;" @blur="discriCard(form.idcard)"></el-input>
					  	</el-form-item>
			          	<el-form-item label="与老人关系:" prop="relationid">
				            <el-select v-model="form.relationid" clearable placeholder="请选择" style="width: 200px;">
				              <el-option v-for="(relation, key) in relation" :label="relation" :value="key * 1" :key="key"></el-option>
				            </el-select>
			          	</el-form-item>
				        <el-form-item label="性别:" prop="gender">
				            <el-select v-model="form.gender" clearable placeholder="请选择性别" style="width: 200px;">
				                <el-option label="男" :value="int1"></el-option>
				                <el-option label="女" :value="int2"></el-option>
				            </el-select>
				        </el-form-item>
					  	<el-form-item label="联系地址:" prop="relativeaddress">
					    	<el-input v-model="form.relativeaddress" style="width: 200px;"></el-input>
					  	</el-form-item>
				        <el-form-item label="是否监护人:" prop="keeper">
				            <el-select v-model="form.keeper" clearable placeholder="请选择" style="width: 200px;">
				                <el-option label="是" :value="int1"></el-option>
				                <el-option label="否" :value="int0"></el-option>
				            </el-select>
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
import localEvent from "@/utils/local";
import ChinaIdChecker from "@/utils/chinaId";
import { mapState } from "vuex";

export default {
  props: ["erid", "elderId", "relation"],
  data() {
    return {
      form: {
        ername: "",
        telphone: "",
        idcard: "",
        relationid: "",
        gender: "",
        relativeaddress: "",
        keeper: ""
      },
      rules: {
        ername: [
          { required: true, message: this.message.pleaseInputKinName, trigger: "blur" }
        ],
        telphone: [
          { required: true, message: this.message.pleaseInputPhone, trigger: "blur" }
        ],
        idcard: [{ required: true, message: this.message.pleaseInputID, trigger: "blur" }]
      },
      empId: localEvent.StorageGetter("empId"),
      int0: 0,
      int1: 1,
      int2: 2,
      loading: false
    };
  },
  watch: {
    erid() {
      if (this.erid !== 0) {
        this.fetchDetail(this.erid);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.erid == 0) {
            var data = {
              elderid: this.elderId,
              ername: this.form.ername,
              telphone: this.form.telphone,
              idcard: this.form.idcard,
              relationid: this.form.relationid,
              gender: this.form.gender,
              relativeaddress: this.form.relativeaddress,
              keeper: this.form.keeper
            };
            this.saveRelate(data);
          } else {
            var data = {
              elderid: this.elderId,
              erid: this.erid,
              ername: this.form.ername,
              telphone: this.form.telphone,
              idcard: this.form.idcard,
              relationid: this.form.relationid,
              gender: this.form.gender,
              relativeaddress: this.form.relativeaddress,
              keeper: this.form.keeper
            };
            this.saveRelate(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addRelationFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.elderrelativeinfo;
      var data = {
        erid: id
      };
      const res = await this.$http.post(url, data);
      this.form.ername = res.data.data.name;
      this.form.telphone = res.data.data.phone;
      this.form.idcard = res.data.data.id_number;
      this.form.relationid = res.data.data.relation;
      this.form.gender = res.data.data.gender;
      this.form.relativeaddress = res.data.data.address;
      this.form.keeper = res.data.data.is_guardian;
      this.loading = false;
    },
    saveRelate: async function(data) {
      let url = this.api.addelderrelative;
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.$parent.$parent.$parent.$parent.$parent.fetchDetail();
        this.hideEditFalse();
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
          }
        });
      }
    },
    discriCard(UUserCard) {
      if (UUserCard === "") {
        return null;
      } else if (!ChinaIdChecker(UUserCard)) {
        this.$alert(this.message.IdWrong, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
        return null;
      }
    }
  },
  computed: mapState(["addRelation"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  max-height: 575px;
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
.addRelation {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
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