<template>
	<div class="addDepart" v-show="addDepart">
		<div class="pop" v-loading="loading">
	        <div class="pop-top">
	            <h5>{{ departId == 0 ? '添加部门' : '编辑部门' }}</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	        		<div style="display: flex;flex-wrap: wrap;">
	        			<el-form-item label="部门名称:" prop="name">
					    	<el-input v-model="form.name" style="width: 200px;"></el-input>
					  	</el-form-item>
						<el-form-item label="部门领导" prop="leader">
						    <el-select v-model="form.leader" clearable placeholder="请选择部门领导" style="width: 200px;">
						    	<el-option v-for="(nurse, key) in nurses" :label="nurse" :value="key * 1" :key="key"></el-option>
						    </el-select>
						</el-form-item>
					  	<el-form-item label="联系电话:" prop="phone">
					    	<el-input v-model="form.phone" type="number" style="width: 200px;"></el-input>
					  	</el-form-item>
					  	<el-form-item label="地址:" prop="address">
					    	<el-input v-model="form.address" style="width: 200px;"></el-input>
					  	</el-form-item>
	        		</div>
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
  props: ["departId"],
  data() {
    return {
      form: {
        name: "",
        leader: "",
        phone: "",
        address: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputDepartmentName, trigger: "blur" }]
      },
      nurses: [],
      loading: false,
      bLoading: false
    };
  },
  watch: {
    departId() {
      if (this.departId == 0) {
        this.nurses = [];
      } else {
        this.fetchDetail(this.departId);
        this.fetchNurse(this.departId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.departId == 0) {
            var data = {
              name: this.form.name,
              leader: this.form.leader,
              phone: this.form.phone,
              address: this.form.address
            };
            this.saveDepart(data);
          } else {
            var data = {
              id: this.departId,
              name: this.form.name,
              leader: this.form.leader,
              phone: this.form.phone,
              address: this.form.address
            };
            this.saveDepart(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addDepartFalse");
      this.$refs["form"].resetFields();
      this.$parent.$parent.clean();
      this.nurses = [];
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.departmentsdetail;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.leader = res.data.data.leader;
          this.form.phone = res.data.data.phone;
          this.form.address = res.data.data.address;
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
    fetchNurse: async function(id) {
      let url = this.api.getdepartmentsemployeelist;
      var data = {
        departments: id
      };
      const res = await this.$http.post(url, data);
      this.nurses = res.data.data;
    },
    saveDepart: async function(data) {
      let url = this.api.adddepartments;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.departId == 0) {
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
          this.$parent.$parent.fetchList();
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
  computed: mapState(["addDepart"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  max-height: 575px;
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
.addDepart {
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