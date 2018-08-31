<template>
	<div class="roomEdit" v-show="roomEdit">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>房间信息修改</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px">
        		   	<el-form-item label="房间名称:" prop="name">
				    	<el-input v-model="form.name"></el-input>
				  	</el-form-item>
					<el-form-item label="房间朝向" prop="direction">
					    <el-select v-model="form.direction" clearable placeholder="请选择房间朝向">
					    	<el-option v-for="(direction, key) in directions" :label="direction" :value="key * 1" :key="key"></el-option>
					    </el-select>
					</el-form-item>
				  	<el-form-item label="床位数量:" prop="bed_count">
				    	<el-input v-model="form.bed_count">
				    		<template slot="append">/间</template>
				    	</el-input>
				  	</el-form-item>
					<el-form-item label="床位朝向" prop="bdirection">
					    <el-select v-model="form.bdirection" clearable placeholder="请选择床位朝向">
					    	<el-option v-for="(direction, key) in directions" :label="direction" :value="key * 1" :key="key"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="床位类型" prop="type_id">
					    <el-select v-model="form.type_id" clearable placeholder="请选择床位类型">
					      	<el-option v-for="bed in bedType" :label="bed.name" :value="bed.id" :key="bed.id"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="护理类型" prop="nursing_type">
					    <el-select v-model="form.nursing_type" clearable placeholder="请选择护理类型">
					      	<el-option v-for="(type, key)  in nursingType" :label="type" :value="key * 1" :key="key"></el-option>
					    </el-select>
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
  props: ["directions", "nurseProject", "bedType", "roomID", "nursingType"],
  data() {
    var typeId = (rule, value, callback) => {
      if (this.form.bed_count && !value) {
        callback(new Error(this.message.pleaseChoiceBedType));
      } else {
        callback();
      }
    };
    var nursType = (rule, value, callback) => {
      if (this.form.bed_count && !value) {
        callback(new Error(this.message.pleaseChoiceNurseType));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        direction: "",
        bed_count: "",
        bdirection: "",
        type_id: "",
        nursing_type: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputRoomName, trigger: "blur" }],
        direction: [
          { required: true, message: this.message.pleaseInputRoomDirection, trigger: "blur" }
        ],
        type_id: [{ validator: typeId, trigger: "change" }],
        nursing_type: [{ validator: nursType, trigger: "change" }]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    roomID() {
      if (this.roomID !== 0) {
        this.fetchDetail(this.roomID);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            name: this.form.name,
            rid: this.roomID,
            direction: this.form.direction,
            bed_count: this.form.bed_count,
            bdirection: this.form.bdirection,
            type_id: this.form.type_id,
            nursing_type: this.form.nursing_type
          };
          this.saveRoom(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("roomEditFalse");
      this.$parent.clean();
      this.$refs["form"].resetFields();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.roomdetails;
      var data = {
        rid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 400) {
          this.$alert(this.message.usingWarning, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.hideEditFalse();
              this.loading = false;
            }
          });
        } else if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.direction = res.data.data.direction;
          this.form.bed_count = res.data.data.bed_count;
          this.form.bdirection = res.data.data.bdirection;
          this.form.type_id = res.data.data.type_id;
          this.form.nursing_type = res.data.data.nursing_type;
          this.form.bed_code_type = res.data.data.bed_code_type;
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
            this.hideEditFalse();
            this.loading = false;
          }
        });
      }
    },
    saveRoom: async function(data) {
      let url = this.api.modifyroom;
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
  computed: mapState(["roomEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 600px;
  min-height: 465px;
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
.roomEdit {
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