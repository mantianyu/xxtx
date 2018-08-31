<template>
	<div class="addDrug" v-show="addDrug">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
      <div class="pop-top">
          <h5>添加药品</h5>
          <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
      </div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
              <el-form-item label="药品名称:" prop="drugname">
                <el-input v-model="form.drugname" style="width: 560px;"></el-input>
              </el-form-item>
              <el-form-item label="药品编码:" prop="drugcode">
                <el-input v-model="form.drugcode" style="width: 560px;">
                  <template slot="append">药品名称首个字母</template>
                </el-input>
              </el-form-item>
              <el-form-item label="生产厂家:" prop="drugmanufacturer">
                <el-input v-model="form.drugmanufacturer" style="width: 560px;"></el-input>
              </el-form-item>
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="类别:" prop="drugtype">
                    <el-select v-model="form.drugtype" clearable placeholder="请选择类别" style="width: 220px;">
                      <el-option v-for="(type, key) in drugType" :label="type" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最小规格:" prop="drugdose">
                    <el-select v-model="form.drugdose" clearable placeholder="请选择最小规格" style="width: 220px;">
                      <el-option v-for="(specifical, key) in drugSpecifical" :label="specifical" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="剂型:" prop="drugform">
                    <el-select v-model="form.drugform" clearable placeholder="请选择剂型" style="width: 220px;">
                      <el-option v-for="(form, key) in drugForm" :label="form" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性:" prop="attribute">
                    <el-select v-model="form.attribute" clearable placeholder="请选择属性" style="width: 220px;">
                      <el-option v-for="(attribute, key) in drugAttribute" :label="attribute" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
              </div>
              <el-form-item label="药品类别:" prop="category">
                  <el-input type="textarea" autosize maxlength="50" v-model="form.category" style="width: 560px;"></el-input>
              </el-form-item>
              <el-form-item label="主治疾病:" prop="maindisease">
                  <el-input type="textarea" autosize maxlength="500" v-model="form.maindisease" style="width: 560px;"></el-input>
              </el-form-item>
              <el-form-item label="注意事项:" prop="notice">
                  <el-input type="textarea" autosize maxlength="500" v-model="form.notice" style="width: 560px;"></el-input>
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
  props: ["drugId", "drugType", "drugForm", "drugSpecifical", "drugAttribute"],
  data() {
    return {
      form: {
        drugname: "",
        drugcode: "",
        drugmanufacturer: "",
        drugtype: "",
        drugdose: "",
        drugform: "",
        attribute: "",
        notice: "",
        maindisease: "",
        category: ""
      },
      rules: {
        drugname: [
          { required: true, message: this.message.pleaseInputMedicineName, trigger: "blur" }
        ],
        drugcode: [
          { required: true, message: this.message.pleaseInputMedicineNumber, trigger: "blur" }
        ]
      },
      empId: localEvent.StorageGetter("empId"),
      loading: false,
      bLoading: false
    };
  },
  watch: {
    drugId() {
      if (this.drugId == 0) {
      } else {
        this.fetchDetail(this.drugId);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.drugId == 0) {
            var data = {
              drugname: this.form.drugname,
              drugcode: this.form.drugcode,
              drugmanufacturer: this.form.drugmanufacturer,
              drugtype: this.form.drugtype,
              drugdose: this.form.drugdose,
              drugform: this.form.drugform,
              attribute: this.form.attribute,
              notice: this.form.notice,
              maindisease: this.form.maindisease,
              category: this.form.category,
            };
            this.saveRegist(data);
          } else {
            var data = {
              drugid: this.drugId,
              drugname: this.form.drugname,
              drugcode: this.form.drugcode,
              drugmanufacturer: this.form.drugmanufacturer,
              drugtype: this.form.drugtype,
              drugdose: this.form.drugdose,
              drugform: this.form.drugform,
              attribute: this.form.attribute,
              notice: this.form.notice,
              maindisease: this.form.maindisease,
              category: this.form.category,
            };
            this.saveRegist(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addDrugFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.druginfo;
      var data = {
        drugid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.drugname = res.data.data.drugname;
          this.form.drugcode = res.data.data.drugcode;
          this.form.drugmanufacturer = res.data.data.drugmanufacturer;
          this.form.drugtype = res.data.data.drugtype;
          this.form.drugdose = res.data.data.drugspecification;
          this.form.drugform = res.data.data.drugform;
          this.form.attribute = res.data.data.attribute;
          this.form.notice = res.data.data.notice;
          this.form.maindisease = res.data.data.maindisease;
          this.form.category = res.data.data.category;
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
    saveRegist: async function(data) {
      let url = this.api.adddrug;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
            title: this.message.success,
            message: this.message.saveSuccess,
            type: "success"
          });
          this.$parent.fetchList(1);
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
    }
  },
  computed: mapState(["addDrug"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 576px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -288px;
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
.addDrug {
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