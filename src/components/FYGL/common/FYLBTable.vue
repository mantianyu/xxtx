<template>
  <div class="Editfylb" v-show="fylbEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
      <div class="pop-top">
        <h5>费用类别</h5>
        <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
      </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
      <div class="qxz">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px">
          <el-form-item label="名称:" prop="cname">
            <el-input v-model="form.cname"></el-input>
          </el-form-item>
          <el-form-item label="费用性质:" prop="cprice_mode">
            <el-select v-model="form.cprice_mode" clearable placeholder="请选择">
              <el-option v-for="(cpricemd, key) in payType" :label="cpricemd" :value="key * 1" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收费标准:" prop="cprice">
            <el-input v-model="form.cprice" type="number">
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="cintroduction">
            <el-input type="textarea" v-model="form.cintroduction"></el-input>
          </el-form-item>
          <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
            <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
            <el-button type="danger" size="medium" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
          </div>
        </el-form>
      </div>
				</el-scrollbar>
			</el-main>
		</el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["cid", "payType"],
  data() {
    var cprice = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写收费标准'));
        } else {
          if (value < 0) {
            callback(new Error('费用不能小于0'));
          }
          callback();
        }
      };
    return {
      form: {
        cname: "",
        cprice_mode: "",
        cprice: "",
        cintroduction: ""
      },
      rules: {
        cname: [{ required: true, message: this.message.pleaseInputCostName, trigger: "blur" }],
        cprice_mode: [
          { required: true, message: this.message.pleaseChoiceCostType, trigger: "change" }
        ],
        cprice: [
          { validator: cprice, trigger: "blur" }
        ],
        cintroduction: [
          { required: true, message: this.message.pleaseInputNotes, trigger: "blur" }
        ]
      },
      loading: false
    };
  },
  watch: {
    cid() {
      if (this.cid == 0) {
      } else {
        this.fetchDetail(this.cid);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.cid == 0) {
            var data = {
              cname: this.form.cname,
              cprice_mode: this.form.cprice_mode * 1,
              cprice: this.form.cprice,
              cintroduction: this.form.cintroduction
            };
            this.saveEdit(data);
          } else {
            {
              var data = {
                cname: this.form.cname,
                cprice_mode: this.form.cprice_mode * 1,
                cprice: this.form.cprice,
                cintroduction: this.form.cintroduction,
                cid: this.cid
              };
              this.saveEdit(data);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("fylbEditFalse");
      this.$parent.$parent.$parent.clean();
      this.$refs["form"].resetFields();
    },
    saveEdit: async function(data) {
      let url = this.api.costtype;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.$parent.$parent.fetchList(1);
          this.hideEditFalse();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.costtypedetails;
      var data = {
        cid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var detailVisit = res.data.data;
          this.form.cname = detailVisit.name;
          this.form.cprice_mode = detailVisit.fee_type;
          this.form.cprice = detailVisit.price;
          this.form.cintroduction = detailVisit.introduction;
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
    }
  },
  computed: mapState(["fylbEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 460px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -230px;
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
.Editfylb {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
