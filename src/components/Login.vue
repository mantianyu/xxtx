<template>
    <div class="login-wrap">
        <img src="/static/img/callUs.png" style="position: absolute;top: 20px;left: 50px;"/>
        <div class="login-left">
            <img src="/static/img/login_logo.png"/>
            <img src="/static/img/login_img.png"/>
        </div>
        <div class="ms-login">
            <div class="ms-title">家园智能养老管理系统登录</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <!-- <el-form-item prop="beadhouse_name">
                    <img class="login-icon" src="/static/img/login_home.png">
                    <el-input v-model="ruleForm.beadhouse_name" placeholder="请输入养老院" prefix-icon="" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item> -->
                <el-form-item prop="username">
                    <img class="login-icon" src="/static/img/login_username.png">
                    <el-input v-model="ruleForm.username" placeholder="请输入账号" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <img class="login-icon" src="/static/img/login_password.png">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <img class="login-icon" src="/static/img/login_yzm.png">
                    <el-input v-model="ruleForm.code" placeholder="请输入验证码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    <div class="code" @click="createCode">{{code}}</div>
                </el-form-item>
                <el-checkbox v-model="checked" fill="#ff8777">记住密码</el-checkbox>
                <div class="login-btn" style="margin-top: 20px">
                    <el-button type="danger" @click="submitForm('ruleForm')" @keyup.enter.native="submitForm('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </div>
                <div class="declare"> 家园智能管理系统，保障每位使用者录入的信息安全。</div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import localEvent from "@/utils/local";
    import {mapState} from "vuex";

    export default {
        data() {
            // var validateHName = (rule, value, callback) => {
            //   if (value === "") {
            //     callback(new Error(this.message.pleaseInputNursingHome));
            //   } else if (value.length < 4 || value.length > 50) {
            //     callback(new Error(this.message.nursingHomeWarning));
            //   } else {
            //     if (this.ruleForm.checkPass !== "") {
            //       this.$refs.ruleForm.validateField("username");
            //     }
            //     callback();
            //   }
            // };
            var validateName = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.message.pleaseInputUsername));
                } else if (value.length < 2 || value.length > 50) {
                    callback(new Error(this.message.usernameWarning));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.message.pleaseInputPassword));
                } else if (value.length < 6 || value.length > 50) {
                    callback(new Error(this.message.passwordWarning));
                } else {
                    callback();
                }
            };
            var validateCode = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.message.pleaseInputVerify));
                } else if (value.toUpperCase() !== this.code.toUpperCase()) {
                    callback(new Error(this.message.verifyWarning));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    // beadhouse_name: "",
                    username: "",
                    password: "",
                    code: ""
                },
                rules: {
                    // beadhouse_name: [
                    //   { required: true, validator: validateHName, trigger: "blur" }
                    // ],
                    username: [
                        {required: true, validator: validateName, trigger: "blur"}
                    ],
                    password: [
                        {required: true, validator: validatePass, trigger: "blur"}
                    ],
                    code: [{required: true, validator: validateCode, trigger: "blur"}]
                },
                code: "",
                checked: false,
                fullscreenLoading: false
            };
        },
        mounted() {
            this.createCode();
            this.getCookie();
        },
        methods: {
            createCode() {
                var code = "";
                var codeLength = 4; //验证码的长度
                var codeChars = new Array(
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "j",
                    "k",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                    "G",
                    "H",
                    "J",
                    "K",
                    "M",
                    "N",
                    "O",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T",
                    "U",
                    "V",
                    "W",
                    "X",
                    "Y",
                    "Z"
                ); //所有候选组成验证码的字符，当然也可以用中文的
                for (var i = 0; i < codeLength; i++) {
                    var charNum = Math.floor(Math.random() * 52);
                    code += codeChars[charNum];
                }
                this.code = code;
            },
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate(valid => {
                    if (valid) {
                        this.erpLogin(self);
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            erpLogin: async function (self) {
                this.fullscreenLoading = true;
                let url = this.api.login;
                const data = {
                    // beadhouse_name: this.ruleForm.beadhouse_name,
                    username: this.ruleForm.username,
                    password: this.ruleForm.password
                };
                try {
                    const res = await this.$http.post(url, data);
                    if (res.data.status_code == 200) {
                        this.fullscreenLoading = false;
                        if (this.checked) {
                            this.setCookie(
                                this.ruleForm.username,
                                this.ruleForm.password,
                                7
                            );
                        }
                        this.$http.requestor.parseToken(res.data.data);
                        if (res.data.data.user_name != "") {
                            var empName = res.data.data.user_name;
                        } else {
                            var empName = this.ruleForm.username;
                        }
                        var empId = res.data.data.user_id;
                        localEvent.StorageSetter("empName", empName);
                        localEvent.StorageSetter("empId", empId);
                        this.fullscreenLoading = false;
                        self.$router.push("/home");
                    } else if (res.data.status_code == 2) {
                        this.fullscreenLoading = false;
                        this.$alert(this.message.noLoading, "", {
                            confirmButtonText: this.message.confirm,
                            callback: action => {
                            }
                        });
                    } else {
                        this.fullscreenLoading = false;
                        this.$alert(this.message.accountPassError, "", {
                            confirmButtonText: this.message.confirm,
                            callback: action => {
                            }
                        });
                    }
                } catch (error) {
                    this.$alert(this.message.timeOut, "", {
                        confirmButtonText: this.message.confirm,
                        callback: action => {
                            this.fullscreenLoading = false;
                        }
                    });
                }
            },
            //设置cookie
            setCookie(c_name, c_pwd, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                // window.document.cookie =
                //   "HName" + "=" + h_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie =
                    "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie =
                    "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
            },
            //读取cookie
            getCookie: function () {
                if (document.cookie.length > 0) {
                    this.checked = true;
                    var arr = document.cookie.split("; ");
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split("=");
                        if (arr2[0] == "userName") {
                            this.ruleForm.username = arr2[1];
                        } else if (arr2[0] == "userPwd") {
                            this.ruleForm.password = arr2[1];
                        }
                    }
                }
            }
        },
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background: url(/static/img/login_bg.png) center no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .login-left {
        width: 460px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .ms-login {
        width: 334px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .ms-title {
        text-align: center;
        color: #666666;
        line-height: 38px;
        font-size: 24px;
        margin-bottom: 20px;
    }

    .login-icon {
        position: absolute;
        top: 8px;
        left: 10px;
        z-index: 1;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }

    .code {
        width: 78px;
        height: 41px;
        text-align: center;
        line-height: 41px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }

    .declare {
        font-size: 13px;
        color: #ff8777;
        padding-top: 18px;
    }
</style>