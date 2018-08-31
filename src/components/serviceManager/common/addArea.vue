<template>
	<div class="addArea" v-show="addArea">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>区域</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
					<el-form-item label="楼房:" prop="building_id">
					    <el-select v-model="form.building_id" clearable placeholder="请选择楼房" @change="selectBuild(form.building_id)">
					      	<el-option v-for="(build, key) in builds" :label="build.buildingname" :key="key" :value="build.buildingid"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item v-if="isFloor" label="楼层:" prop="floor_id">
					    <el-select v-model="form.floor_id" clearable placeholder="请选择楼层" @change="selectFloor(form.floor_id)">
					      	<el-option v-for="(floor, key) in floors" :label="floor.floorname" :key="key" :value="floor.floorid"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item v-if="isRoom" label="房间:" prop="room_id">
					    <el-select v-model="form.room_id" clearable placeholder="请选择房间">
					      	<el-option v-for="(room, key) in rooms" :label="room.roomname" :key="key" :value="room.roomid"></el-option>
					    </el-select>
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
  props: ["areasId", "builds"],
  data() {
    return {
      form: {
        building_id: "",
        floor_id: "",
        room_id: ""
      },
      rules: {
        building_id: [
          { required: true, message: this.message.pleaseChoiceBuildings, trigger: "change" }
        ],
        floor_id: [
          { required: true, message: this.message.pleaseChoiceFloorNumbers, trigger: "change" }
        ],
        room_id: [{ required: true, message: this.message.pleaseChoiceRooms, trigger: "change" }]
      },
      isFloor: false,
      isRoom: false,
      floors: [],
      rooms: [],
      loading: false,
      bLoading: false
    };
  },
  watch: {
    areasId() {
      if (this.areasId == 0) {
      } else {
        this.fetchDetail(this.areasId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.areasId == 0) {
            var data = {
              area_id: this.$route.params.aid,
              building_id: this.form.building_id,
              floor_id: this.form.floor_id,
              room_id: this.form.room_id
            };
            this.saveArea(data);
          } else {
            var data = {
              id: this.areasId,
              area_id: this.$route.params.aid,
              building_id: this.form.building_id,
              floor_id: this.form.floor_id,
              room_id: this.form.room_id
            };
            this.saveArea(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addAreaFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
      this.isFloor = false;
      this.isRoom = false;
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.deliverylistsdetail;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.building_id = res.data.data.building_id;
          this.form.floor_id = res.data.data.floor_id;
          this.form.room_id = res.data.data.room_id;
          this.fetchFloor(res.data.data.building_id);
          this.fetchRoom(res.data.data.floor_id);
          this.isFloor = true;
          this.isRoom = true;
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
    saveArea: async function(data) {
      let url = this.api.adddeliveryareas;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.areasId == 0) {
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
    },
    fetchFloor: async function(id) {
      let url = this.api.floorcodelist;
      var data = {
        lid: id
      };
      const res = await this.$http.post(url, data);
      this.floors = res.data.data;
      this.$nextTick(function() {
        this.isFloor = true;
      });
    },
    fetchRoom: async function(id) {
      let url = this.api.roomcodelist;
      var data = {
        fid: id
      };
      const res = await this.$http.post(url, data);
      this.rooms = res.data.data;
      this.$nextTick(function() {
        this.isRoom = true;
      });
    },
    selectBuild(val) {
      this.fetchFloor(val);
      this.form.floor_id = "";
    },
    selectFloor(val) {
      this.fetchRoom(val);
      this.form.room_id = "";
    }
  },
  computed: mapState(["addArea"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 500px;
  height: 360px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -180px;
  left: 50%;
  margin-left: -250px;
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
.addArea {
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