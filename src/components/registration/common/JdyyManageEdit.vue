<template>
    <div class="Editjdyy" v-show="jdyyEdit">
    <el-container class="pop" v-loading="loading">
      <el-header style="height: auto;">
            <div class="pop-top">
                <h5>预约登记</h5>
                <span class="pop-close" @click="hideEditFalse">
                    <i class="el-icon-close"></i>
                </span>
            </div>
      </el-header>
      <el-main style="height: 91%;position: relative;">
        <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
            <div class="qxz">
                <el-form :rules="rules" ref="form" :model="form" label-width="120px">
                    <div :data="form" style="display: flex;flex-wrap: wrap;">
                        <el-form-item label="老人姓名：" prop="old_name">
                          <el-autocomplete style="width: 220px;"
                            value-key="old_name"
                            v-bind:disabled="jdyyEditFalse"
                            popper-class="my-autocomplete"
                            v-model="form.old_name"
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
                        <!-- <el-form-item label="老人姓名：" prop="old_name">
                            <el-input v-bind:disabled="jdyyEditFalse" v-model="form.old_name" style="width: 220px;"></el-input>
                        </el-form-item> -->
                        <el-form-item label="身份证号：" prop="id_number">
                            <el-input v-bind:disabled="jdyyEditFalse" v-model="form.id_number" style="width: 220px;" @blur="discriCard(form.id_number)"></el-input>
                        </el-form-item>
                        <el-form-item label="性别：" prop="gender">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.gender" clearable placeholder="请选择" style="width: 220px;">
                                <el-option v-for="(gend, key) in gender" :label="gend" :value="key * 1" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="自理情况：" prop="selfCare">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.selfCare" clearable placeholder="请选择" style="width: 220px;" @change="selectCareType(form.selfCare)">
                                <el-option v-for="(selfcare, key) in self_care" :label="selfcare" :value="key * 1" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="年龄：" prop="age">
                            <el-input v-bind:disabled="jdyyEditFalse" v-model="form.age" style="width: 220px;"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭住址：" prop="address">
                            <el-input v-bind:disabled="jdyyEditFalse" v-model="form.address" style="width: 220px;"></el-input>
                        </el-form-item>
                        <el-form-item label="床位类型：" prop="bed_type_id">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.bed_type_id" clearable placeholder="请选择" style="width: 220px;" @change="selectBedType(form.bed_type_id)">
                                <el-option v-for="(bedtype, key) in bedList" :label="bedtype.name" :value="bedtype.id" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否包房：" prop="is_private_room">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.is_private_room" clearable placeholder="请选择" style="width: 220px;" @change="selectBaoFang">
                                <el-option v-for="(privateroom, key) in is_private_room" :label="privateroom" :value="key * 1" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="楼房：" prop="building_id">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.building_id" clearable placeholder="请选择楼房" style="width: 220px;" @change="selectBuild(form.building_id)">
                                <el-option v-for="(build, key) in builds" :label="build" :key="key" :value="key * 1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="楼层：" v-if="isFloor" prop="floor_id">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.floor_id" clearable placeholder="请选择楼层" style="width: 220px;" @change="selectFloor(form.floor_id)">
                                <el-option v-for="(floor, key) in floors" :label="floor" :key="key" :value="key * 1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="房间：" v-if="isRoom" prop="room_id">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.room_id" clearable placeholder="请选择房间" style="width: 220px;" @change="selectRoom(form.room_id)">
                                <el-option v-for="(room, key) in rooms" :label="room" :key="key" :value="key * 1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="床位：" v-if="isBed" prop="bed_id">
                            <el-select v-bind:disabled="jdyyEditFalse" v-model="form.bed_id" clearable placeholder="请选择床位" style="width: 220px;">
                                <el-option v-for="(bed, key) in beds" :label="bed" :key="key" :value="key * 1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="床位描述：" prop="bed_intro">
                            <el-input disabled v-model="form.bed_intro" style="width: 220px;"></el-input>
                        </el-form-item>
                        <el-form-item label="床位价格：" prop="bed_price">
                            <el-input disabled v-model="form.bed_price" style="width: 220px;"></el-input>
                        </el-form-item>
                        <el-form-item label="状态：" prop="status">
                            <el-select disabled v-model="form.status" clearable placeholder="请选择" style="width: 220px;">
                                <el-option v-for="(statused, key) in status" :label="statused" :value="key * 1" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                      <div style="display: flex;flex-wrap: wrap;margin-top: 30px;">
                          <el-form-item label="预约人：" prop="name">
                              <el-input v-bind:disabled="jdyyEditFalse" v-model="form.name" style="width: 220px;"></el-input>
                          </el-form-item>
                          <el-form-item label="与老人关系：" prop="relation">
                              <el-select v-bind:disabled="jdyyEditFalse" v-model="form.relation" clearable placeholder="请选择" style="width: 220px;">
                                  <el-option v-for="(relate, key) in relation" :label="relate" :value="key * 1" :key="key"></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item label="预约日期：" prop="appointment_date">
                              <el-date-picker v-bind:disabled="jdyyEditFalse" type="date" placeholder="选择日期" style="width: 220px;" v-model="form.appointment_date"></el-date-picker>
                          </el-form-item>
                          <el-form-item label="联系电话：" prop="phone">
                              <el-input v-bind:disabled="jdyyEditFalse" v-model="form.phone" style="width: 220px;"></el-input>
                          </el-form-item>
                          <el-form-item label="预约入住日期：" prop="check_in_date" label-width="130px">
                              <el-date-picker v-bind:disabled="jdyyEditFalse" type="date" placeholder="选择日期" style="width: 220px;" v-model="form.check_in_date"></el-date-picker>
                          </el-form-item>
                      </div>
                    </div>
                    <div v-if="!jdyyEditFalse" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
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
import ChinaIdChecker from "@/utils/chinaId";
import { mapState } from "vuex";

export default {
  props: ["elderid", "relation", "self_care", "bedList", "elderList"],
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
        old_name: "",
        elder_id: "",
        gender: "",
        selfCare: "",
        age: "",
        id_number: "",
        address: "",
        building_id: "",
        floor_id: "",
        room_id: "",
        bed_id: "",
        bed_type_id: "",
        is_private_room: 0,
        bed_intro: "",
        name: "",
        relation: "",
        appointment_date: Date.parse(new Date()),
        phone: "",
        bed_price: "",
        status: 0,
        check_in_date: Date.parse(new Date())
      },
      rules: {
        old_name: [
          {
            required: true,
            message: "请输入老人姓名",
            trigger: ["blur", "change"]
          }
        ],
        gender: [
          {
            required: true,
            message: "请输入老人性别",
            trigger: ["blur", "change"]
          }
        ],
        selfCare: [
          {
            required: true,
            message: this.message.pleaseChoiceSelfCondi,
            trigger: "change"
          }
        ],
        age: [
          {
            required: true,
            validator: ageCheck,
            trigger: "blur"
          }
        ],
        // id_number: [
        //   { required: true, validator: validateNumber, trigger: "blur" }
        // ],
        building_id: [
          {
            required: true,
            message: this.message.pleaseChoiceBuildings,
            trigger: "change"
          }
        ],
        floor_id: [
          {
            required: true,
            message: this.message.pleaseChoiceFloorNumbers,
            trigger: "change"
          }
        ],
        room_id: [
          {
            required: true,
            message: this.message.pleaseChoiceRooms,
            trigger: "change"
          }
        ],
        bed_id: [
          {
            required: true,
            message: this.message.pleaseChoiceBerth,
            trigger: "change"
          }
        ],
        bed_type_id: [
          {
            required: true,
            message: this.message.pleaseChoiceBedType,
            trigger: "change"
          }
        ],
        is_private_room: [
          {
            required: true,
            message: this.message.pleaseChoicePrivate,
            trigger: "change"
          }
        ],
        bed_price: [
          {
            required: true,
            message: this.message.pleaseInputPrice,
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: this.message.pleaseInputStatus,
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: this.message.pleaseInputOrderName,
            trigger: "blur"
          }
        ],
        relation: [
          {
            required: true,
            message: this.message.pleaseChoiceRelation,
            trigger: "change"
          }
        ],
        appointment_date: [
          {
            required: true,
            message: this.message.pleaseChoiceTime,
            trigger: "change"
          }
        ],
        check_in_date: [
          {
            required: true,
            message: this.message.pleaseChoiceTime,
            trigger: "change"
          }
        ],
        phone: [{ required: true, validator: phoneCheck, trigger: "blur" }],
      },
      elder_id: 0,
      bed_id: 0,
      empId: localEvent.StorageGetter("empId"),
      gender: {
        1: this.message.male,
        2: this.message.famale
      },
      is_private_room: {
        1: this.message.private,
        0: this.message.noPrivate
      },
      status: {
        0: this.message.booked,
        1: this.message.checkedIn
      },
      isFloor: false,
      isRoom: false,
      isBed: false,
      builds: [],
      floors: [],
      rooms: [],
      beds: [],
      baofangTrue: 0,
      baofangFalse: 0,
      loading: false,
      clean: false,
      bLoading: false
    };
  },
  watch: {
    elderid() {
      if (this.elderid == 0) {
        this.isFloor = false;
        this.isRoom = false;
        this.isBed = false;
        this.builds = [];
        this.floors = [];
        this.rooms = [];
        this.beds = [];
        this.baofangTrue = 0;
        this.baofangFalse = 0;
      } else {
        this.fetchDetailVisit(this.elderid);
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
              old_name: this.form.old_name,
              gender: this.form.gender,
              self_care: this.form.selfCare * 1,
              age: this.form.age,
              id_number: this.form.id_number,
              address: this.form.address,
              bed_id: this.form.bed_id,
              bed_type_id: this.form.bed_type_id * 1,
              is_private_room: this.form.is_private_room * 1,
              bed_intro: this.form.bed_intro,
              name: this.form.name,
              relation: this.form.relation * 1,
              appointment_date:
                Date.parse(new Date(this.form.appointment_date)) / 1000,
              phone: this.form.phone,
              bed_price: this.form.bed_price,
              status: this.form.status,
              check_in_date:
                Date.parse(new Date(this.form.check_in_date)) / 1000,
              bed_id: this.form.bed_id,
              employee_id: localEvent.StorageGetter("empId")
            };
            this.saveEdit(data);
          } else {
            if (this.form.appointment_date == "") {
              var data = {
                old_name: this.form.old_name,
                gender: this.form.gender,
                self_care: this.form.selfCare * 1,
                age: this.form.age,
                id_number: this.form.id_number,
                address: this.form.address,
                bed_id: this.form.bed_id,
                bed_type_id: this.form.bed_type_id * 1,
                is_private_room: this.form.is_private_room * 1,
                bed_intro: this.form.bed_intro,
                name: this.form.name,
                relation: this.form.relation * 1,
                phone: this.form.phone,
                bed_price: this.form.bed_price,
                status: this.form.status,
                check_in_date:
                  Date.parse(new Date(this.form.check_in_date)) / 1000,
                bed_id: this.form.bed_id,
                employee_id: localEvent.StorageGetter("empId"),
                id: this.elderid
              };
              this.saveEdit(data);
            } else {
              var data = {
                old_name: this.form.old_name,
                gender: this.form.gender,
                self_care: this.form.selfCare * 1,
                age: this.form.age,
                id_number: this.form.id_number,
                address: this.form.address,
                bed_id: this.form.bed_id,
                bed_type_id: this.form.bed_type_id * 1,
                is_private_room: this.form.is_private_room * 1,
                bed_intro: this.form.bed_intro,
                name: this.form.name,
                relation: this.form.relation * 1,
                appointment_date:
                  Date.parse(new Date(this.form.appointment_date)) / 1000,
                phone: this.form.phone,
                bed_price: this.form.bed_price,
                status: this.form.status,
                check_in_date:
                  Date.parse(new Date(this.form.check_in_date)) / 1000,
                bed_id: this.form.bed_id,
                employee_id: localEvent.StorageGetter("empId"),
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
    hideEditFalse() {
      this.$store.dispatch("JdyyEditClose");
      this.$store.dispatch("JdyyEditFalseClose");
      this.$refs["form"].resetFields();
      this.form.elder_id = "";
      this.$parent.clean();
      this.clean = false;
      this.isFloor = false;
      this.isRoom = false;
      this.isBed = false;
      this.builds = [];
      this.floors = [];
      this.rooms = [];
      this.beds = [];
      this.baofangTrue = 0;
      this.baofangFalse = 0;
    },
    saveEdit: async function(data) {
      let url = this.api.addappointments;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
            this.$notify({
              title: this.message.success,
              message: this.message.newOrderSuccess,
              type: "success"
            });
          this.$parent.JdyyManageList(1);
          this.bLoading = false;
          this.hideEditFalse();
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
    fetchDetailVisit: async function(oldVisitId) {
      this.loading = true;
      let url = this.api.appointmentdetail;
      var data = {
        id: oldVisitId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var detailVisit = res.data.data;
          this.form.old_name = detailVisit.old_name;
          this.form.gender = detailVisit.gender;
          this.form.selfCare = detailVisit.self_care;
          this.form.age = detailVisit.age;
          this.form.id_number = detailVisit.id_number;
          this.form.address = detailVisit.address;
          this.form.bed_type_id = detailVisit.bed_type_id;
          this.form.is_private_room = detailVisit.is_private_room;
          this.form.bed_intro = detailVisit.bed_intro;
          this.form.name = detailVisit.name;
          this.form.relation = detailVisit.relation;
          this.form.appointment_date = detailVisit.appointment_date;
          this.form.phone = detailVisit.phone;
          this.form.bed_price = detailVisit.bed_price;
          this.form.status = detailVisit.status;
          this.form.check_in_date = detailVisit.check_in_date;
          this.empId = detailVisit.employee_id;
          this.form.elder_id = detailVisit.elder_id;
          this.form.bed_id = detailVisit.bed_id;
          this.form.building_id = detailVisit.building_id;
          this.form.floor_id = detailVisit.floor_id;
          this.form.room_id = detailVisit.room_id;
          if (res.data.data.bedid != "") {
            this.isFloor = true;
            this.isRoom = true;
            this.isBed = true;
            this.fetchBuild(
              this.form.elder_id,
              this.form.selfCare,
              this.form.bed_type_id,
              this.form.is_private_room
            );
            this.fetchFloor(
              detailVisit.building_id,
              this.form.elder_id,
              this.form.selfCare,
              this.form.bed_type_id,
              this.form.is_private_room
            );
            this.fetchRoom(
              detailVisit.floor_id,
              this.form.elder_id,
              this.form.selfCare,
              this.form.bed_type_id,
              this.form.is_private_room
            );
            this.fetchBed(
              detailVisit.room_id,
              this.form.elder_id,
              this.form.selfCare,
              this.form.bed_type_id
            );
          }
          this.$nextTick(function() {
            for (let i = 0; i < this.bedList.length; i++) {
              if (this.bedList[i].id == detailVisit.bed_type_id) {
                this.form.bed_intro = this.bedList[i].introduction;
                this.baofangTrue = this.bedList[i].house_monthly_price;
                this.baofangFalse = this.bedList[i].bed_monthly_price;
                this.form.bed_price = this.bedList[i].bed_monthly_price;
                break;
              }
            }
            // this.selectBaoFang(detailVisit.is_private_room);
            this.$nextTick(() => {
              this.loading = false;
            });
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
    fetchBuild: async function(elderId, careType, bedType, isPrivate) {
      let url = this.api.selectBuildingList;
      var data = {
        elder_id: elderId,
        care_type: careType,
        bed_type: bedType,
        is_private_room: isPrivate
      };
      const res = await this.$http.post(url, data);
      this.builds = res.data.data;
    },
    fetchFloor: async function(buildId, elderId, careType, bedType, isPrivate) {
      let url = this.api.selectFloorList;
      var data = {
        lid: buildId,
        elder_id: elderId,
        care_type: careType,
        bed_type: bedType,
        is_private_room: isPrivate
      };
      const res = await this.$http.post(url, data);
      this.floors = res.data.data;
      this.$nextTick(function() {
        this.isFloor = true;
      });
    },
    fetchRoom: async function(floorId, elderId, careType, bedType, isPrivate) {
      let url = this.api.selectRoomList;
      var data = {
        fid: floorId,
        elder_id: elderId,
        care_type: careType,
        bed_type: bedType,
        is_private_room: isPrivate
      };
      const res = await this.$http.post(url, data);
      this.rooms = res.data.data;
      this.$nextTick(function() {
        this.isRoom = true;
      });
    },
    fetchBed: async function(roomId, elderId, careType, bedType) {
      let url = this.api.selectBedList;
      var data = {
        rid: roomId,
        elder_id: elderId,
        care_type: careType,
        bed_type: bedType
      };
      const res = await this.$http.post(url, data);
      this.beds = res.data.data;
      this.$nextTick(function() {
        this.isBed = true;
      });
    },
    selectBuild(val) {
      if (val) {
        this.fetchFloor(
          val,
          this.form.elder_id,
          this.form.selfCare,
          this.form.bed_type_id,
          this.form.is_private_room
        );
        this.form.floor_id = "";
        this.form.room_id = "";
        this.form.bed_id = "";
        this.floors = [];
        this.rooms = [];
        this.beds = [];
      }
    },
    selectFloor(val) {
      if (val) {
        this.fetchRoom(
          val,
          this.form.elder_id,
          this.form.selfCare,
          this.form.bed_type_id,
          this.form.is_private_room
        );
        this.form.room_id = "";
        this.form.bed_id = "";
        this.rooms = [];
        this.beds = [];
      }
    },
    selectRoom(val) {
      if (val) {
        this.fetchBed(
          val,
          this.form.elder_id,
          this.form.selfCare,
          this.form.bed_type_id
        );
        this.form.bed_id = "";
        this.beds = [];
      }
    },
    selectCareType(val) {
      if (this.form.bed_type_id) {
        this.form.building_id = "";
        this.form.floor_id = "";
        this.form.room_id = "";
        this.form.bed_id = "";
        this.builds = [];
        this.floors = [];
        this.rooms = [];
        this.beds = [];
        this.fetchBuild(
          this.form.elder_id,
          val,
          this.form.bed_type_id,
          this.form.is_private_room
        );
      }
    },
    selectBedType(val) {
      for (let i = 0; i < this.bedList.length; i++) {
        if (this.bedList[i].id == val) {
          this.form.bed_intro = this.bedList[i].introduction;
          this.baofangTrue = this.bedList[i].house_monthly_price;
          this.baofangFalse = this.bedList[i].bed_monthly_price;
          this.form.bed_price = this.bedList[i].bed_monthly_price;
          break;
        }
      }
      if (this.form.selfCare) {
        this.form.building_id = "";
        this.form.floor_id = "";
        this.form.room_id = "";
        this.form.bed_id = "";
        this.builds = [];
        this.floors = [];
        this.rooms = [];
        this.beds = [];
        this.fetchBuild(
          this.form.elder_id,
          this.form.selfCare,
          val,
          this.form.is_private_room
        );
      }
    },
    selectBaoFang(val) {
      if (val == 1) {
        this.form.bed_price = this.baofangTrue;
      } else {
        this.form.bed_price = this.baofangFalse;
      }
      if (this.form.selfCare && this.form.bed_type_id) {
        this.form.building_id = "";
        this.form.floor_id = "";
        this.form.room_id = "";
        this.form.bed_id = "";
        this.builds = [];
        this.floors = [];
        this.rooms = [];
        this.beds = [];
        this.fetchBuild(
          this.form.elder_id,
          this.form.selfCare,
          this.form.bed_type_id,
          val
        );
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
        this.form.selfCare = res.data.data.self_care;
        this.form.age = res.data.data.age;
        this.form.id_number = res.data.data.id_number;
        this.form.address = res.data.data.address;
        // this.$refs["form"].validate();
      } else {
        this.clearElder();
      }
    },
    clearElder() {
      this.form.gender = "";
      this.form.selfCare = "";
      this.form.age = "";
      this.form.id_number = "";
      this.form.address = "";
      this.form.elder_id = "";
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
      this.form.old_name = item.name;
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
  computed: mapState(["jdyyEdit", "jdyyEditFalse"])
};
</script>

<style scoped>
.Editjdyy {
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

.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.el-select-dropdown__item.selected {
  color: #ff8777;
  font-weight: 700;
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
</style>
