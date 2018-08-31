<template>
	<div class="addRoom" v-show="addBed">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>{{ bedId == 0 ? '添加床位':'床位信息修改' }}</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px">
        		   	<el-form-item label="床位名称:" prop="name">
				    	<el-input v-model="form.name"></el-input>
				  	</el-form-item>
        		   	<el-form-item label="床位编号:" prop="number">
				    	<el-input v-model.number="form.number" type="number"></el-input>
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
  props: [
    "directions",
    "nurseProject",
    "bedType",
    "lid",
    "fid",
    "rid",
    "bedId",
    "nursingType"
  ],
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
    return {
      form: {
        name: "",
        bdirection: "",
        type_id: "",
        nursing_type: "",
        number: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputBedName, trigger: "blur" }],
        number: [
          { required: true, message: this.message.pleaseInputBedNumber, trigger: "blur" },
          {
            validator: isPositiveIntegernteger,
            attrName: this.message.bedNumber,
            trigger: "blur",
            message: this.message.bedNumberMustBeNum
          }
        ],
        bdirection: [
          { required: true, message: this.message.pleaseChoiceBedDirection, trigger: "blur" }
        ],
        type_id: [
          { required: true, message: this.message.pleaseChoiceBedType, trigger: "blur" }
        ],
        nursing_type: [
          { required: true, message: this.message.pleaseChoiceNurseType, trigger: "blur" }
        ]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    bedId() {
      if (this.bedId == 0) {
      } else {
        this.fetchDetail(this.bedId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.bedId == 0) {
            var data = {
              Building_id: this.lid,
              floor_id: this.fid,
              room_id: this.rid,
              name: this.form.name,
              bdirection: this.form.bdirection * 1,
              type_id: this.form.type_id * 1,
              nursing_type: this.form.nursing_type * 1,
              number: this.form.number
            };
            this.saveBed(data);
          } else {
            var data = {
              bid: this.bedId,
              name: this.form.name,
              bdirection: this.form.bdirection * 1,
              type_id: this.form.type_id * 1,
              nursing_type: this.form.nursing_type * 1,
              number: this.form.number
            };
            this.saveModifyBed(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addBedFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.beddetails;
      var data = {
        bid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.bdirection = res.data.data.direction;
          this.form.type_id = res.data.data.type_id;
          this.form.nursing_type = res.data.data.nursing_type_id;
          this.form.number = res.data.data.number;
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
    saveBed: async function(data) {
      let url = this.api.dobed;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.bedId == 0) {
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
    saveModifyBed: async function(data) {
      let url = this.api.modifybed;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.fetchList(1);
          this.bLoading = false;
          this.hideEditFalse();
          this.form.name = "";
          this.form.bdirection = "";
          this.form.type_id = "";
          this.form.nursing_type = "";
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
  computed: mapState(["addBed"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  min-height: 450px;
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