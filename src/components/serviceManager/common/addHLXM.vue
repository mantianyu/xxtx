<template>
	<div class="addHLXM" v-show="addHLXM">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>项目类别</h5>
	            <span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm" @submit.native.prevent>
        		   	<el-form-item label="项目名称:" prop="pname">
				    	<el-input v-model="form.pname"></el-input>
				  	</el-form-item>
				  	<el-form-item label="项目介绍:" prop="pintroduction">
				    	<el-input v-model="form.pintroduction" type="textarea"></el-input>
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
  props: ["typeId"],
  data() {
    return {
      form: {
        pname: "",
        pintroduction: ""
      },
      rules: {
        pname: [{ required: true, message: this.message.pleaseInputProName, trigger: "blur" }]
      },
      empId: localEvent.StorageGetter("empId"),
      loading: false,
      bLoading: false
    };
  },
  watch: {
    typeId() {
      if (this.typeId == 0) {
      } else {
        this.fetchDetail(this.typeId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.typeId == 0) {
            var data = {
              pname: this.form.pname,
              pintroduction: this.form.pintroduction
            };
            this.saveNursType(data);
          } else {
            var data = {
              pid: this.typeId,
              pname: this.form.pname,
              pintroduction: this.form.pintroduction
            };
            this.saveNursType(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addHLXMFalse");
      this.$parent.clean();
      this.$refs["form"].resetFields();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.nursingprojectdetails;
      var data = {
        pid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.pname = res.data.data.name;
          this.form.pintroduction = res.data.data.introduction;
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
    saveNursType: async function(data) {
      let url = this.api.nursingproject;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.typeId == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addSortSuccess,
              type: "success"
            });
          } else { 
            this.$notify({
              title: this.message.success,
              message: this.message.changeSortSuccess,
              type: "success"
            });
          }
          this.$parent.fetchNursProList();
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
  computed: mapState(["addHLXM"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 340px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -170px;
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
  position: fixed;
  width: 770px;
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
}
.addHLXM {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>