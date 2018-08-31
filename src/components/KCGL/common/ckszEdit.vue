<template>
	<div class="ckszEdit" v-show="ckszEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>仓库设置</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px">
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="仓库名称:" prop="name">
                  <el-input v-model="form.name" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="管理员:" prop="manager">
                  <el-select v-model="form.manager" clearable placeholder="请选择管理员" style="width: 220px;">
                    <el-option v-for="(manage, key) in manage" :label="manage.name" :value="manage.id" :key="key"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="仓库位置:" prop="location">
                <el-input v-model="form.location" style="width: 560px;"></el-input>
              </el-form-item>
              <el-form-item label="用途描述:" prop="description">
                <el-input type="textarea" v-model="form.description" style="width: 560px;"></el-input>
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
  props: ["Id", "manage"],
  data() {
    return {
      form: {
        name: "",
        manager: "",
        location: "",
        description: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputWarehouseName, trigger: "blur" }],
        manager: [
          { required: true, message: this.message.pleaseChoiceAdmin, trigger: "change" }
        ]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    Id() {
      if (this.Id !== 0) {
        this.fetchDetail(this.Id);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.Id == 0) {
            var data = {
              name: this.form.name,
              manager_id: this.form.manager,
              location: this.form.location,
              description: this.form.description
            };
            this.saveRepose(data);
          } else {
            var data = {
              id: this.Id,
              name: this.form.name,
              manager_id: this.form.manager,
              location: this.form.location,
              description: this.form.description
            };
            this.saveRepose(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("ckszEditFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.viewrepository;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.manager = res.data.data.manager_id;
          this.form.location = res.data.data.location;
          this.form.description = res.data.data.description;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.hideEditFalse();
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
    saveRepose: async function(data) {
      let url = this.api.addrepository;
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
  computed: mapState(["ckszEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 380px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -190px;
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
.ckszEdit {
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