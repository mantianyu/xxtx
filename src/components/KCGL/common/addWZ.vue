<template>
	<div class="addWZ" v-show="addWZ">
		<div class="pop" v-loading="loading">
      <div class="pop-top">
        <h5>物资</h5>
        <span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
      </div>
      <div class="qxz">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
          <div style="display: flex;flex-wrap: wrap;">
            <el-form-item label="物资名称:" prop="name">
                <el-input v-model="form.name" style="width: 220px;"></el-input>
            </el-form-item>
            <el-form-item label="所属类别:" prop="category_id">
              <el-select v-model="form.category_id" clearable placeholder="请选择所属类别" style="width: 220px;">
                <el-option v-for="(type, key) in typeLists" :label="type.name" :value="type.id" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规格:" prop="specification">
              <el-input v-model="form.specification" style="width: 220px;"></el-input>
            </el-form-item>
            <el-form-item label="生产厂商:" prop="supplier">
              <el-input v-model="form.supplier" style="width: 220px;"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="物资描述:" prop="description">
            <el-input v-model="form.description" type="textarea" style="width: 560px;"></el-input>
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
  props: ["goodsId", "typeLists"],
  data() {
    return {
      form: {
        name: "",
        category_id: "",
        specification: "",
        supplier: "",
        description: ""
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputProName, trigger: "blur" }],
        category_id: [
          { required: true, message: this.message.pleaseChoiceType, trigger: "change" }
        ]
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    goodsId() {
      if (this.goodsId == 0) {
      } else {
        this.fetchDetail(this.goodsId);
      }
    }
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.goodsId == 0) {
            var data = {
              name: this.form.name,
              category_id: this.form.category_id,
              specification: this.form.specification,
              supplier: this.form.supplier,
              description: this.form.description
            };
            this.saveGoods(data);
          } else {
            var data = {
              id: this.goodsId,
              name: this.form.name,
              category_id: this.form.category_id,
              specification: this.form.specification,
              supplier: this.form.supplier,
              description: this.form.description
            };
            this.saveGoods(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addWZFalse");
      this.$parent.$parent.$parent.$parent.clean();
      this.$refs["form"].resetFields();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.viewgoods;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.category_id = res.data.data.category_id;
          this.form.specification = res.data.data.specification;
          this.form.supplier = res.data.data.supplier;
          this.form.description = res.data.data.description;
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
    saveGoods: async function(data) {
      let url = this.api.addgoods;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.$parent.$parent.$parent.fetchList(1);
          this.hideEditFalse();
          this.bLoading = false;
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
  computed: mapState(["addWZ"])
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
.addWZ {
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