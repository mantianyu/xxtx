<template>
    <div class="addRoom" v-show="addRoom">
		<el-container class="pop">
			<el-header style="height: auto;">
            <div class="pop-top">
                <h5>添加房间</h5>
                <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
            </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
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
                        <el-input v-model.number="form.bed_count" type="number">
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
                    <el-form-item label="床位编码方式" prop="bed_code_type">
                        <el-select v-model="form.bed_code_type" clearable placeholder="请选择床位编码方式">
                            <el-option label="按整个楼计数" value="0"></el-option>
                            <el-option label="按房间排序" value="1"></el-option>
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
  props: ["directions", "nurseProject", "bedType", "lid", "fid", "nursingType"],
  data() {
    var isPositiveIntegernteger = (rule, value, callback) => {
      if (!value) {
        return callback();
      } else if (!Number.isInteger(value)) {
        callback(
          new Error(
            rule.message
              ? rule.message
              : rule.attrName
                ? rule.attrName + this.message.onlyBePositiveNumber
                : this.message.onlyInputPositiveNumber
          )
        );
      } else {
        if (value < 0) {
          callback(
            new Error(
              rule.message
                ? rule.message
                : rule.attrName
                  ? rule.attrName + this.message.onlyBePositiveNumber
                  : this.message.onlyInputPositiveNumber
            )
          );
        } else {
          callback();
        }
      }
    };
    var checkBed = (rule, value, callback) => {
      if (this.form.bed_count > 0 && !value) {
        callback(
          new Error(
            rule.message
              ? rule.message
              : rule.attrName ? rule.attrName + this.message.canNotBeEmpty : this.message.canNotBeEmpty
          )
        );
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
        nursing_type: "",
        bed_code_type: "1"
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputRoomName, trigger: "blur" }],
        direction: [
          { required: true, message: this.message.pleaseInputRoomDirection, trigger: "change" }
        ],
        bed_count: [
          {
            validator: isPositiveIntegernteger,
            attrName: this.message.numberOfBed,
            trigger: "blur",
            message: this.message.numberOfBedMustBeNum
          }
        ],
        bdirection: [
          {
            validator: checkBed,
            message: this.message.pleaseChoiceBedDirection,
            trigger: "blur,change"
          }
        ],
        type_id: [
          {
            validator: checkBed,
            message: this.message.pleaseChoiceBedType,
            trigger: "blur,change"
          }
        ],
        nursing_type: [
          {
            validator: checkBed,
            message: this.message.pleaseChoiceNurseType,
            trigger: "blur,change"
          }
        ]
      },
      bLoading: false
    };
  },
  watch: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            Building_id: this.lid,
            floor_id: this.fid,
            name: this.form.name,
            direction: this.form.direction * 1,
            bed_count: this.form.bed_count,
            bdirection: this.form.bdirection * 1,
            type_id: this.form.type_id * 1,
            nursing_type: this.form.nursing_type * 1,
            bed_code_type: this.form.bed_code_type * 1
          };
          this.saveRoom(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addRoomFalse");
      this.$refs["form"].resetFields();
    },
    saveRoom: async function(data) {
      let url = this.api.doroom;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.addSuccess,
              type: "success"
            });
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
  computed: mapState(["addRoom"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
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
  margin-left: -400px;
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

.addRoom {
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