<template>
  <div class="manageeditBG" v-show="JdzxManageEdit">
    <el-container class="pop" id="addzxdj" v-loading="loading">
      <el-header style="height: auto;">
        <div class="pop-top">
          <h5>{{JdzxManagechange ? '咨询登记':'咨询登记'}}</h5>
          <span class="pop-close" @click="hidejdzxManageEdit"><i class="el-icon-close"></i></span>
        </div>
      </el-header>
      <el-main style="height: 91%;position: relative;">
        <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-form :rules="rules" ref="form" :model="form" label-width="120px">
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="老人姓名：" prop="elder_name">
                  <el-autocomplete style="width: 220px;"
                    value-key="elder_name"
                    popper-class="my-autocomplete"
                    v-bind:disabled="JdzxManagechange"
                    v-model="form.elder_name"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入或选择老人"
                    @select="handleSelect"
                    @clearable="clearElder"
                    clearable>
                    <i
                      class="el-icon-edit el-input__clear"
                      slot="suffix"
                      style="margin-right: 10px;"
                      @click="handleIconClick">
                    </i>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}({{ item.bed_name }})</div>
                        <span class="addr">{{ item.id_number }}</span>
                    </template>
                  </el-autocomplete>
                </el-form-item>
                <!-- <el-form-item label="老人姓名：" prop="elder_name">
                  <el-input v-bind:disabled="JdzxManagechange" v-model="form.elder_name" style="width: 220px;"></el-input>
                </el-form-item> -->
                <el-form-item label="身份证号：" prop="id_number">
                  <el-input v-bind:disabled="JdzxManagechange" v-model="form.id_number" style="width: 220px;" @blur="discriCard(form.id_number)"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="gender">
                  <el-select v-bind:disabled="JdzxManagechange"  v-model="form.gender" clearable placeholder="请选择" style="width: 220px;">
                    <el-option v-for="(gend, key) in gender" :label="gend" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="自理情况：" prop="self_care">
                  <el-select v-bind:disabled="JdzxManagechange" v-model="form.self_care" clearable placeholder="请选择" style="width: 220px;">
                    <el-option v-for="(selfcare, key) in self_care" :label="selfcare" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄：" prop="age">
                  <el-input v-bind:disabled="JdzxManagechange"  type="number" v-model="form.age" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="家庭住址：" prop="address">
                  <el-input v-bind:disabled="JdzxManagechange" v-model="form.address" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="老人状态：" prop="status">
                  <el-select v-bind:disabled="JdzxManagechange" v-model="form.status" clearable placeholder="请选择" style="width: 220px;">
                    <el-option v-for="(statusd, key) in status" :label="statusd" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="咨询人：" prop="name">
                  <el-input v-bind:disabled="JdzxManagechange" v-model="form.name" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="与老人关系：" prop="relation">
                  <el-select v-bind:disabled="JdzxManagechange"  v-model="form.relation" clearable placeholder="请选择" style="width: 220px;">
                    <el-option v-for="(relate, key) in relation" :label="relate" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="咨询日期：" prop="time">
                  <el-date-picker v-bind:disabled="JdzxManagechange" type="datetime" placeholder="选择日期" v-model="form.time" style="width: 220px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="咨询方式：" prop="method">
                  <el-select v-bind:disabled="JdzxManagechange"  v-model="form.method" clearable placeholder="请选择" style="width: 220px;">
                    <el-option v-for="(methode, key) in method" :label="methode" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="接待人：" prop="employee_name">
                  <el-input disabled v-model="form.employee_name" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="媒体渠道：" prop="channel">
                  <el-select v-bind:disabled="JdzxManagechange"  v-model="form.channel" clearable placeholder="请选择" style="width: 220px;">
                    <el-option v-for="(channeld, key) in channel" :label="channeld" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="咨询类型：" prop="type">
                  <el-select v-bind:disabled="JdzxManagechange"  v-model="form.type" clearable placeholder="请选择" style="width: 220px;">
                    <el-option v-for="(typed, key) in type" :label="typed" :value="key * 1" :key="key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系电话：" prop="phone">
                  <el-input v-bind:disabled="JdzxManagechange" type="number" v-model="form.phone" style="width: 220px;"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="咨询内容：" prop="content">
                <el-input v-bind:disabled="JdzxManagechange" type="textarea" v-model="form.content" style="width: 900px;"></el-input>
              </el-form-item>
              <div class="pop-foot" v-if="!JdzxManagechange" style="margin-bottom: 20px;">
                <el-button type="info" size="medium" @click="hidejdzxManageEdit" style="margin-top: 20px;">取消</el-button>
							  <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;margin-top: 20px;" @click="submitForm('form')">确认</el-button>
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
import ChinaIdChecker from "@/utils/chinaId";
import { mapState } from "vuex";
export default {
  props: [
    "elderid",
    "self_care",
    "relation",
    "method",
    "channel",
    "type",
    "elderList"
  ],
  data() {
    // var validateNumber = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入密码"));
    //   } else {
    //     if (!ChinaIdChecker(value)) {
    //       callback(new Error("身份证错误！"));
    //     }
    //     callback();
    //   }
    // };
    let ageCheck = (rule, value, callback) => {
      if(value === ""){
        return callback(new Error(this.message.pleaseInputElderAge));
      } else if (value < 0) {
         callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
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
        elder_name: "",
        gender: "",
        self_care: "",
        age: "",
        id_number: "",
        address: "",
        name: "",
        relation: "",
        time: "" + new Date(),
        method: "",
        employee_name: localEvent.StorageGetter("empName"),
        channel: "",
        type: "",
        phone: "",
        content: "",
        status: 0
      },
      rules: {
        elder_name: [
          { required: true, message: this.message.pleaseInputElderName, trigger: "blur" }
        ],
        gender: [
          { required: true, message: this.message.pleaseInputElderSex, trigger: "blur" }
        ],
        self_care: [
          { required: true, message: this.message.pleaseChoiceSelfCondi, trigger: "change" }
        ],
        age: [{ required: true, validator: ageCheck, trigger: "blur" }],
        // id_number: [
        //   { required: true, validator: validateNumber, trigger: "blur" }
        // ],
        address: [
          { required: true, message: this.message.pleaseInputFamilyAddress, trigger: "blur" }
        ],
        status: [
          { required: true, message: this.message.pleaseChoiceElderStatus, trigger: "change" }
        ],
        name: [
          { required: true, message: this.message.pleaseInputConsultName, trigger: "blur" }
        ],
        relation: [
          { required: true, message: this.message.pleaseChoiceOldRelation, trigger: "change" }
        ],
        time: [
          { required: true, message: this.message.pleaseChoiceConsultTime, trigger: "change" }
        ],
        method: [
          { required: true, message: this.message.pleaseChoiceConsultWay, trigger: "change" }
        ],
        employee_name: [
          { required: true, message: this.message.pleaseInputReceName, trigger: "blur" }
        ],
        channel: [
          { required: true, message: this.message.pleaseChoiceMediaWay, trigger: "change" }
        ],
        type: [
          { required: true, message: this.message.pleaseChoiceConsultType, trigger: "change" }
        ],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }],
        content: [
          { required: true, message: this.message.pleaseInputConsultContent, trigger: "blur" }
        ]
      },
      elder_id: 0,
      empId: localEvent.StorageGetter("empId"),
      gender: {
        1: this.message.male,
        2: this.message.famale
      },
      status: {
        0: this.message.consult,
        1: this.message.booked,
        2: this.message.checkedIn
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    elderid() {
      if (this.elderid == 0) {
      } else {
        this.fetchDetailJd(this.elderid);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.elderid == 0) { 
            var data = {
              elder_name: this.form.elder_name,
              gender: this.form.gender,
              self_care: this.form.self_care,
              age: this.form.age,
              id_number: this.form.id_number,
              address: this.form.address,
              name: this.form.name,
              relation: this.form.relation * 1,
              time: this.form.time
                ? Date.parse(new Date(this.form.time)) / 1000
                : "",
              method: this.form.method,
              employee_name: localEvent.StorageGetter("empName"),
              channel: this.form.channel,
              type: this.form.type,
              phone: this.form.phone,
              content: this.form.content,
              status: this.form.status,
              employee_id: localEvent.StorageGetter("empId")
            };
            this.saveEdit(data);
          } else {
            if (this.form.elder_name == "") {
              var data = {
                elder_id: this.elder_id,
                gender: this.form.gender,
                self_care: this.form.self_care,
                age: this.form.age,
                id_number: this.form.id_number,
                address: this.form.address,
                name: this.form.name,
                relation: this.form.relation * 1,
                time: this.form.time
                  ? Date.parse(new Date(this.form.time)) / 1000
                  : "",
                method: this.form.method,
                employee_name: this.form.employee_name,
                channel: this.form.channel,
                type: this.form.type,
                phone: this.form.phone,
                content: this.form.content,
                employee_id: this.empId,
                status: this.form.status,
                id: this.elderid
              };
              this.saveEdit(data);
            } else {
              var data = {
                elder_id: this.elder_id,
                elder_name: this.form.elder_name,
                gender: this.form.gender,
                self_care: this.form.self_care,
                age: this.form.age,
                id_number: this.form.id_number,
                address: this.form.address,
                name: this.form.name,
                relation: this.form.relation * 1,
                time: this.form.time
                  ? Date.parse(new Date(this.form.time)) / 1000
                  : "",
                method: this.form.method,
                employee_name: this.form.employee_name,
                channel: this.form.channel,
                type: this.form.type,
                phone: this.form.phone,
                content: this.form.content,
                employee_id: this.empId,
                status: this.form.status,
                id: this.elderid
              };
              this.saveEdit(data);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hidejdzxManageEdit() {
      this.$store.dispatch("JdzxManageEditClose");
      this.$store.dispatch("JdzxManagechangeClose");
      this.form.elder_id = "";
      this.$parent.clean();
      this.$refs["form"].resetFields();
    },
    saveEdit: async function(data) {
      let url = this.api.addzxdjlist;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
            this.$notify({
              title: this.message.success,
              message: this.message.newConsultSuccess,
              type: "success"
            });
          this.hidejdzxManageEdit();
          this.$parent.JdzxManageList();
          this.bLoading = false;
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
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
    fetchDetailJd: async function(jdzxoldId) {
      this.loading = true;
      let url = this.api.ckzxdjlist;
      var data = {
        id: jdzxoldId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var detailZx = res.data.data;
          this.form.elder_id = detailZx.elder_id;
          this.form.elder_name = detailZx.elder_name;
          this.form.gender = detailZx.gender;
          this.form.self_care = detailZx.self_care;
          this.form.age = detailZx.age;
          this.form.id_number = detailZx.id_number;
          this.form.address = detailZx.address;
          this.form.name = detailZx.name;
          this.form.relation = detailZx.relation;
          this.form.time = detailZx.time * 1000;
          this.form.method = detailZx.method;
          this.form.employee_name = detailZx.employee_name;
          this.form.channel = detailZx.channel;
          this.form.type = detailZx.type;
          this.form.phone = detailZx.phone;
          this.form.content = detailZx.content;
          this.form.status = detailZx.status;
          this.empId = detailZx.employee_id;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hidejdzxManageEdit();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hidejdzxManageEdit();
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
      if (UUserCard.length == 18) {
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
          this.form.gender = 1;
        } else {
          this.form.gender = 2;
        }
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (
          UUserCard.substring(10, 12) < month ||
          (UUserCard.substring(10, 12) == month &&
            UUserCard.substring(12, 14) <= day)
        ) {
          age++;
        }
        this.form.age = age;
      }
    },
    doFecthElder: async function(elderId) {
      let url = this.api.elderdetail;
      var data = {
        elder_id: elderId
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.form.gender = res.data.data.gender;
        this.form.self_care = res.data.data.self_care;
        this.form.age = res.data.data.age;
        this.form.id_number = res.data.data.id_number;
        this.form.address = res.data.data.address;
      } else {
        this.clearElder();
      }
    },
    clearElder() {
      this.form.gender = "";
      this.form.self_care = "";
      this.form.age = "";
      this.form.id_number = "";
      this.form.address = "";
    },
    querySearch(queryString, cb) {
      var elders = this.elderList;
      var results = queryString
        ? elders.filter(this.createFilter(queryString))
        : elders;
      cb(elders);
    },
    createFilter(queryString) {
      return elder => {
        return (
          elder.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.form.elder_name = item.name;
      if (this.form.elder_id != item.id) {
        this.form.elder_id = item.id;
        this.doFecthElder(item.id);
      }
    },
    handleIconClick(ev) {
      if (this.form.elder_id != 0) {
        this.clearElder();
      }
    }
  },
  computed: mapState(["JdzxManageEdit", "JdzxManagechange", "JdzxManageXq"])
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 1100px;
  height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -550px;
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

.qxz {
  padding: 20px;
  margin-top: 25px;
  padding-top: 0;
}
.zxbg {
  margin-top: 20px;
  width: 100%;
}
.zxbg td {
  padding: 10px 0;
}
.zxbg input[type="text"],
.zxbg textarea {
  width: 60%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #b5b5b5;
}
.zxbg select {
  width: 100px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #b5b5b5;
  font-size: 12px;
}
.zxbg input[type="radio"] {
  margin-right: 6px;
}
.zxbg label {
  font-weight: normal;
}
.qxz hr {
  border-top: 1px solid #e5e5e5;
  margin: 30px 0;
}
.ubio {
  padding-left: 10px;
  color: rgb(255, 135, 119);
  font-size: 16px;
  border-left: 4px solid rgb(255, 135, 119);
}
.el-date-editor.el-input {
  width: 130px;
}
</style>
