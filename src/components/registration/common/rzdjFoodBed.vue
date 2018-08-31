<template>
	<div>
		<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	      	<div style="display: flex;flex-wrap: wrap;">
		        <el-form-item label="选择套餐:" prop="recipeid">
		          <el-select v-model="form.recipeid" clearable placeholder="请选择" style="width: 200px;" @change="changeEat">
		            <el-option v-for="(eat, key) in eat" :label="eat.name" :value="eat.id" :key="key"></el-option>
		          </el-select>
		        </el-form-item>
	          	<el-form-item label="套餐费用:">
	            	<el-input v-model="form.recipeprice" disabled style="width: 200px;"></el-input>
	          	</el-form-item>
	          	<el-form-item label="套餐详情:">
	            	<el-input v-model="form.recipeinfo" disabled style="width: 200px;"></el-input>
	          	</el-form-item>
	        </div>
	        <div style="display: flex;flex-wrap: wrap;">
			  	<el-form-item label="床位类型:" prop="bedtypeid">
				    <el-select v-model="form.bedtypeid" clearable placeholder="请选择" style="width: 200px;" @change="changeType">
			            <el-option v-for="(bedType, key) in bedType" :label="bedType.name" :value="bedType.id" :key="key"></el-option>
		          	</el-select>
			  	</el-form-item>
          <el-form-item label="是否包房：" prop="isprivateroom">
              <el-select v-model="form.isprivateroom" clearable placeholder="请选择" style="width: 200px;" @change="isPrivate">
                  <el-option v-for="(privateroom, key) in is_private_room" :label="privateroom" :value="key * 1" :key="key"></el-option>
              </el-select>
          </el-form-item>
	          	<el-form-item label="费用:" prop="bedprice">
	            	<el-input v-model="form.bedprice" disabled style="width: 200px;"></el-input>
	          	</el-form-item>
	          	<el-form-item label="楼房:" prop="building_id">
				    <el-select v-model="form.building_id" clearable placeholder="请选择楼房" @change="selectBuild(form.building_id)" style="width: 200px;">
				      	<el-option v-for="(build, key) in builds" :label="build" :key="key" :value="key * 1"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item v-if="isFloor" label="楼层:" prop="floor_id">
				    <el-select v-model="form.floor_id" clearable placeholder="请选择楼层" @change="selectFloor(form.floor_id)" style="width: 200px;">
				      	<el-option v-for="(floor, key) in floors" :label="floor" :key="key" :value="key * 1"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item v-if="isRoom" label="房间:" prop="room_id">
				    <el-select v-model="form.room_id" clearable placeholder="请选择房间" @change="selectBed(form.room_id)" style="width: 200px;">
				      	<el-option v-for="(room, key) in rooms" :label="room" :key="key" :value="key * 1"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item v-if="isBed" label="床位:" prop="bedid">
				    <el-select v-model="form.bedid" clearable placeholder="请选择床位" style="width: 200px;">
				      	<el-option v-for="(bed, key) in beds" :label="bed" :key="key" :value="key * 1"></el-option>
				    </el-select>
				</el-form-item>
		        <el-form-item label="床位描述:" prop="bedintro">
		          <el-input v-model="form.bedintro" disabled style="width: 200px;"></el-input>
		        </el-form-item>
	        </div>
	      	<div v-if="status ? status != 1 ? true : false : true" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	      		<el-button type="info" size="medium" @click="back">上一步</el-button>
	          	<el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">保存</el-button>
	      	</div>
		</el-form>
	</div>
</template>

<script>
export default {
  props: [
    "elderDetail",
    "id",
    "checkin",
    "noNurseEatBed",
    "status",
    "selfcare"
  ],
  data() {
    return {
      form: {
        recipeid: "",
        recipeprice: "",
        recipeinfo: "",
        bedtypeid: "",
        isprivateroom: 0,
        bedprice: "",
        bedid: "",
        bedintro: "",
        building_id: "",
        floor_id: "",
        room_id: ""
      },
      rules: {
        recipeid: [
          { required: true, message: this.message.pleaseChoicePackage, trigger: "change" }
        ],
        bedtypeid: [
          { required: true, message: this.message.pleaseChoiceBedType, trigger: "change" }
        ],
        building_id: [
          { required: true, message: this.message.pleaseChoiceBuildings, trigger: "change" }
        ],
        floor_id: [
          { required: true, message: this.message.pleaseChoiceFloorNumbers, trigger: "change" }
        ],
        room_id: [{ required: true, message: this.message.pleaseChoiceRooms, trigger: "change" }],
        bedid: [{ required: true, message: this.message.pleaseChoiceBerth, trigger: "change" }]
      },
      elderid: 0,
      checkinId: 0,
      is_private_room: {
        1: this.message.private,
        0: this.message.noPrivate
      },
      eat: [],
      bedType: [],
      bedPrice: "",
      monthPrice: "",
      isFloor: false,
      isRoom: false,
      isBed: false,
      builds: [],
      floors: [],
      rooms: [],
      beds: [],
      bLoading: false
    };
  },
  watch: {
    elderDetail() {
      if (this.elderDetail.length == 0) {
        this.$parent.$parent.$parent.$parent.loadingFalse();
      } else {
        this.elderid = this.elderDetail.elderid;
        this.checkinId = this.elderDetail.checkinid;
        this.fetchDetail(this.elderDetail.checkinid);
      }
    },
    id() {
      if (this.id != 0) {
        this.elderid = this.id;
        this.checkinId = this.checkin;
        this.fetchDetail(this.checkinId);
      }
    }
  },
  mounted() {
    this.fetchEat();
    this.fetchBedtype();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elderid: this.elderid,
            checkinid: this.checkinId,
            recipeid: this.form.recipeid,
            recipeprice: this.form.recipeprice,
            bedtypeid: this.form.bedtypeid,
            isprivateroom: this.form.isprivateroom,
            bedprice: this.form.bedprice,
            bedid: this.form.bedid,
            bedintro: this.form.bedintro
          };
          this.saveRecipeBed(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchDetail: async function(id) {
      let url = this.api.elderrecipebedinfo;
      var data = {
        checkid: id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.form.recipeid = res.data.data.recipetypeid;
        this.form.recipeprice = res.data.data.recipetypeprice;
        this.form.bedtypeid = res.data.data.bedtypeid;
        this.form.isprivateroom = res.data.data.isprivateroom;
        this.form.bedprice = res.data.data.bedprice;
        this.form.bedid = res.data.data.bedid;
        this.form.building_id = res.data.data.building_id;
        this.form.floor_id = res.data.data.floor_id;
        this.form.room_id = res.data.data.room_id;
        if (res.data.data.bedid != "") {
          this.isFloor = true;
          this.isRoom = true;
          this.isBed = true;
          this.fetchBuild(
            this.elderDetail.elder_id,
            this.selfcare,
            this.form.bedtypeid,
            this.form.isprivateroom
          );
          this.fetchFloor(
            res.data.data.building_id,
            this.elderDetail.elder_id,
            this.selfcare,
            this.form.bedtypeid,
            this.form.isprivateroom
          );
          this.fetchRoom(
            res.data.data.floor_id,
            this.elderDetail.elder_id,
            this.selfcare,
            this.form.bedtypeid,
            this.form.isprivateroom
          );
          this.fetchBed(
            res.data.data.room_id,
            this.elderDetail.elder_id,
            this.selfcare,
            this.form.bedtypeid,
            this.form.isprivateroom
          );
        }
        this.form.bedintro = res.data.data.bedintro;
        this.$nextTick(function() {
          for (let i = 0; i < this.eat.length; i++) {
            if (this.eat[i].id == res.data.data.recipetypeid) {
              this.form.recipeinfo = this.eat[i].suitable_meals.join(",");
            }
          }
          for (let i = 0; i < this.bedType.length; i++) {
            if (this.bedType[i].id == res.data.data.bedtypeid) {
              this.bedPrice = this.bedType[i].bed_monthly_price;
              this.monthPrice = this.bedType[i].house_monthly_price;
              this.form.bedprice = this.bedType[i].bed_monthly_price;
              this.form.bedintro = this.bedType[i].introduction;
            }
          }
          // this.isPrivate(res.data.data.isprivateroom);
          this.$nextTick(() => {
            this.$parent.$parent.$parent.$parent.loadingFalse();
          });
        });
      } else {
        this.$parent.$parent.$parent.$parent.loadingFalse();
      }
    },
    saveRecipeBed: async function(data) {
      let url = this.api.elderrecipebed;
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        if (this.noNurseEatBed) {
          this.bLoading = false;
          this.$store.dispatch("addCYCWHLFalse");
          this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.CycwManageList(
            1
          );
        } else {
          this.bLoading = false;
          this.$parent.$parent.$parent.$parent.isFoodTrue(res.data.data);
          this.$parent.$parent.$parent.$parent.showNewPayIn();
          this.$parent.$parent.$parent.$parent.$parent.ManageList(1);
        }
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    back() {
      this.$parent.$parent.$parent.$parent.showNewNurse();
    },
    fetchEat: async function() {
      let url = this.api.recipeslist;
      var data = {};
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.eat = res.data.data;
      }
    },
    changeEat(val) {
      for (let i = 0; i < this.eat.length; i++) {
        if (this.eat[i].id == val) {
          this.form.recipeprice = this.eat[i].price;
          this.form.recipeinfo = this.eat[i].suitable_meals.join(",");
        }
      }
    },
    fetchBedtype: async function() {
      let url = this.api.bednolist;
      var data = {};
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.bedType = res.data.data;
      }
    },
    changeType(val) {
      for (let i = 0; i < this.bedType.length; i++) {
        if (this.bedType[i].id == val) {
          this.bedPrice = this.bedType[i].bed_monthly_price;
          this.monthPrice = this.bedType[i].house_monthly_price;
          this.form.bedprice = this.bedType[i].bed_monthly_price;
          this.form.bedintro = this.bedType[i].introduction;
          break;
        }
      }
      this.form.building_id = "";
      this.form.floor_id = "";
      this.form.room_id = "";
      this.form.bedid = "";
      this.builds = [];
      this.floors = [];
      this.rooms = [];
      this.beds = [];
      this.fetchBuild(
        this.elderDetail.elder_id,
        this.selfcare,
        val,
        this.form.isprivateroom
      );
    },
    isPrivate(val) {
      console.log(val);
      if (val == 0) {
        this.form.bedprice = this.bedPrice;
      } else {
        this.form.bedprice = this.monthPrice;
      }
      if (this.form.bedtypeid) {
        this.form.building_id = "";
        this.form.floor_id = "";
        this.form.room_id = "";
        this.form.bedid = "";
        this.builds = [];
        this.floors = [];
        this.rooms = [];
        this.beds = [];
        this.fetchBuild(
          this.elderDetail.elder_id,
          this.selfcare,
          this.form.bedtypeid,
          val
        );
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
          this.elderDetail.elder_id,
          this.selfcare,
          this.form.bedtypeid,
          this.form.isprivateroom
        );
        this.form.floor_id = "";
        this.form.room_id = "";
        this.form.bedid = "";
        this.floors = [];
        this.rooms = [];
        this.beds = [];
      }
    },
    selectFloor(val) {
      if (val) {
        this.fetchRoom(
          val,
          this.elderDetail.elder_id,
          this.selfcare,
          this.form.bedtypeid,
          this.form.isprivateroom
        );
        this.form.room_id = "";
        this.form.bedid = "";
        this.rooms = [];
        this.beds = [];
      }
    },
    selectBed(val) {
      if (val) {
        this.fetchBed(
          val,
          this.elderDetail.elder_id,
          this.selfcare,
          this.form.bedtypeid
        );
        this.form.bedid = "";
        this.beds = [];
      }
    }
  }
};
</script>
