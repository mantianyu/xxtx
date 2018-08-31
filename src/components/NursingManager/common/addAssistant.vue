<template>
	<div class="addAssistant" v-if="addAssistant">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>护工助手资料</h5>
					<span class="pop-close" @click="hideEditFalse">
						<i class="el-icon-close"></i>
					</span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="130px" class="demo-ruleForm">
							<div style="width: 85%;">
									<el-form-item label="昵称:" prop="nickname">
										<el-input v-model="form.nickname" style="width: 200px;height: 40px;"></el-input>
									</el-form-item>
                  <el-form-item label="头像信息:" prop="head" style="float: right;">
                    <el-upload class="avatar-uploader" :action="this.api.uploademployeeimage" :headers="{'Authorization': 'Bearer ' + token}" :show-file-list="false" :on-success="handleAvatarSuccess">
                      <img v-if="form.head" :src="form.head" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
									<el-form-item label="星级:" prop="star">
                    <el-rate style="margin-top: 10px;"
                      v-model="form.star"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate> 
									</el-form-item>
									<el-form-item label="邀请码:" prop="invite_code">
										<el-input v-model="form.invite_code" style="width: 200px;" :disabled="true"></el-input>
									</el-form-item>  
							</div>
              <div style="width:100%;overflow: hidden">
                <el-form-item label="积分:" prop="score">
                  <el-input v-model="form.score" style="width: 200px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="手机:" prop="phone">
                  <el-input v-model="form.phone" type="number" style="width: 660px;" :disabled="true"></el-input>
                </el-form-item>
              </div>
							
							<div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;padding-top: 28px;">
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
  props: ["nlid"],
  data() {
    let phoneCheck = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error(this.message.pleaseInputPhone));
      } else if (value < 0) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      form: {
        nickname: "",
        head: "",
        star: 0,
        invite_code: "",
        score: "",
        phone: ""
      },
      rules: {
        nickname: [
          { required: true, message: "请输入护工昵称", trigger: "blur" }
        ],
        star: [{ required: true, message: "请输入星级", trigger: "blur" }],
        invite_code: [
          { required: true, message: "请输入邀请码", trigger: "blur" }
        ],
        score: [{ required: true, message: "请输入积分", trigger: "blur" }],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }]
      },
      token: "",
      tableData: [],
      loading: false,
      bLoading: false
    };
  },
  watch: {
    nlid() {
      if (this.nlid !== 0) {
        this.fetchDetail(this.nlid);
      }
    },
    accessToken() {
      this.token = this.accessToken;
    }
  },
  mounted() {
    this.token = this.accessToken;
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.head = res.data;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          let data = {
            employee_id: this.nlid,
            nickname: this.form.nickname,
            head: this.form.head
          }
          this.saveNurse(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addAssistantFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
      this.tableData = [];
      // this.quarter = [];
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.getnurseext;
      var data = {
        employee_id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.nickname = res.data.data.nickname;
          this.form.head = res.data.data.head;
          this.form.star = res.data.data.star;
          this.form.invite_code = res.data.data.invite_code;
          this.form.score = res.data.data.score;
          this.form.phone = res.data.data.phone;
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
    saveNurse: async function(data) {
      let url = this.api.setnurseext;
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
    }
  },
  computed: mapState(["addAssistant", "accessToken"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 900px;
  height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -550px;
}
.pop-top {
  padding: 0 20px;
  overflow: hidden;
  background: #f2f2f2;
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
.addAssistant {
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
.el-form-item {
  float: left;
}
</style>