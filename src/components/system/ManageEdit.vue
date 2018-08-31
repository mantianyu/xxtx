<template>
	<div class="manageeditBG" v-show="manageEdit">
		<div class="pop" id="adduser" v-loading="loading">
            <div class="pop-top">
                <h5>{{ userid || userid === 0 ? '编辑管理员' : '添加管理员' }}</h5>
                <span class="pop-close" @click="hideManageEdit"><i class="el-icon-close"></i></span>
            </div>
            <div class="pop-content">
                <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
	                <el-form-item label="登录名：" prop="loginName">
	                    <el-input v-model="ruleForm.loginName"></el-input>
	                </el-form-item>
	                <el-form-item label="密码：" prop="password">
	                    <el-input type="password" v-model="ruleForm.password"></el-input>
	                </el-form-item>
	                <el-form-item label="确认密码：" prop="pwdOK">
	                    <el-input type="password" v-model="ruleForm.pwdOK"></el-input>
	                </el-form-item>
	                <el-form-item label="选择员工：" prop="employeeid">
					    <el-select v-bind:disabled="userid !== ''" v-model="ruleForm.employeeid" clearable @change="selectEmp">
					      	<el-option v-for="(nurse, key) in nurse" :value="nurse.id" :label="nurse.name" :key="key"></el-option>
					    </el-select>
					</el-form-item>
	                <el-form-item label="权限组：" prop="promise">
					    <el-select v-model="ruleForm.promise" clearable>
					      	<el-option v-for="(parr, key) in promise_arr" :value="parr.pid" :label="parr.name" :key="key"></el-option>
					    </el-select>
					</el-form-item>
	                <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	                	<el-button type="info" size="medium" @click="hideManageEdit">取消</el-button>
	                    <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('ruleForm')">确认</el-button>
	                </div>
	            </el-form>
            </div>
        </div>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["userid", "promise_arr"],
  data() {
    var validateloginName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseInputLoginName));
      } else if (value.length < 4 || value.length > 50) {
        callback(new Error(this.message.loginNameWarning));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseInputPassword));
      } else if (value.length < 2 || value.length > 50) {
        callback(new Error(this.message.passwordWarning));
      } else {
        callback();
      }
    };
    var validatePassOK = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseReInputPassword));
      } else if (value != this.ruleForm.password) {
        callback(new Error(this.message.passwordNotFit));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        loginName: "",
        password: "",
        pwdOK: "",
        employeeid: "",
        promise: ""
      },
      rules: {
        loginName: [
          { required: true, validator: validateloginName, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        pwdOK: [{ required: true, validator: validatePassOK, trigger: "blur" }],
        employeeid: [
          { required: true, message: this.message.pleaseChoiceStaff, trigger: "change" }
        ],
        promise: [
          { required: true, message: this.message.pleaseChoiceLimits, trigger: "change" }
        ]
      },
      code: "",
      checked: false,
      nurse: [],
      bLoading: false,
      loading: false
    };
  },
  watch: {
    userid() {
      if (this.userid !== '') {
        this.ManageInfo(this.userid);
      }
    }
  },
  mounted() {
    this.fetchNurse();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.userid !== '') {
            this.addUser(this.userid);
          } else {
            this.addUser(0);
          }
        } else {
          return false;
        }
      });
    },
    addUser: async function(userid) {
      let url = this.api.adduser;
      if (userid === '') {
        var data = {
          accountname: this.ruleForm.loginName,
          userpassword: this.ruleForm.password,
          roleid: this.ruleForm.promise,
          employeeid: this.ruleForm.employeeid
        };
      } else {
        var data = {
          accountname: this.ruleForm.loginName,
          userpassword: this.ruleForm.password,
          roleid: this.ruleForm.promise,
          userid: userid,
          employeeid: this.ruleForm.employeeid
        };
      }
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
           if (this.userid !== '') {
             this.$notify({
              title: this.message.success,
              message: this.message.changeSuccess,
              type: "success"
            });
           } else {
            this.$notify({
              title: this.message.success,
              message: this.message.addSuccess,
              type: "success"
            });}
          this.bLoading = false;
          this.$parent.fetchList(1);
          this.hideManageEdit();
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
    hideManageEdit() {
      this.$store.dispatch("manageEditClose");
      this.$refs["ruleForm"].resetFields();
      this.$parent.clean();
    },
    fetchNurse: async function() {
      let url = this.api.getallemployeelist;
      var data = {
        type: 2
      };
      const res = await this.$http.post(url, data);
      this.nurse = res.data.data;
    },
    ManageInfo: async function(userid) {
      this.loading = true;
      let url = this.api.userinfo;
      var data = {
        employeeid: userid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if(res.data.data.length === 0){
            this.ruleForm.employeeid = this.userid;
            this.selectEmp(this.userid);
          }else{
            let arr = res.data.data;
            this.ruleForm.loginName = arr.account;
            this.ruleForm.promise = arr.role_id;
            this.ruleForm.employeeid = arr.employee_id;
          }
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    selectEmp(val) {
      for(let i = 0; i < this.nurse.length; i++){
        if(this.nurse[i].id === val){
          this.ruleForm.loginName = this.nurse[i].phone;
        }
      }
    }
  },
  computed: mapState(["manageEdit"])
};
</script>

<style scoped>
.manageeditBG {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.el-select-dropdown__item.selected {
  color: #ff8777;
  font-weight: 700;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #ff8777;
}
.pop {
  display: block;
  width: 600px;
  height: 520px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  left: 50%;
  margin-left: -300px;
  top: 50%;
  margin-top: -260px;
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
.pop-foot {
  border-top: 1px #e5e5e5 solid;
  text-align: center;
}
.pop-cancel,
.pop-ok {
  margin: 20px 10px 0;
  border: none;
  border-radius: 4px;
  background-color: #ff8777;
  color: #fff;
  cursor: pointer;
  min-width: 90px;
  line-height: 40px;
}
.pop-cancel {
  background: #b5b5b5;
}
.pop-content {
  padding: 40px;
}
</style>
