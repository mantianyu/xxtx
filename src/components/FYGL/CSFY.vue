<template>
  <el-container class="csfy">
    <el-header style="height: auto;">
      <div class="top-tit">
        <h5>初始费用</h5>
      </div>
    </el-header>
    <el-main style="height: 91%;position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
        <div class="table">
          <el-form ref="form" :model="form" label-width="80px">
            <table class="t_table" width="100%">
              <tbody>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">默认初始费用:</td>
                  <td width="80%" style="line-height: 40px;">定制护理费</td>
                </tr>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">已设置初始费用:</td>
                  <td width="80%" style="line-height: 40px;">
                    {{selectType}}
                  </td>
                </tr>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">月收费用:</td>
                  <td width="80%" style="line-height: 40px;">
                    <el-checkbox-group v-model="form.monthPay">
                      <el-checkbox v-for="(type, key) in types[2]" :key="key" :label="type.typeid" name="monthPay" :checked="type.isdefault == 0 ? false : true">
                        {{type.typename}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">年收费用:</td>
                  <td width="80%" style="line-height: 40px;">
                    <el-checkbox-group v-model="form.yearPay">
                      <el-checkbox v-for="(type, key) in types[3]" :key="key" :label="type.typeid" name="yearPay" :checked="type.isdefault == 0 ? false : true">
                        {{type.typename}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">日收费用:</td>
                  <td width="80%" style="line-height: 40px;">
                    <el-checkbox-group v-model="form.dayPay">
                      <el-checkbox v-for="(type, key) in types[1]" :key="key" :label="type.typeid" name="dayPay" :checked="type.isdefault == 0 ? false : true">
                        {{type.typename}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">特殊费用:</td>
                  <td width="80%" style="line-height: 40px;">
                    <el-checkbox-group v-model="form.spcailPay">
                      <el-checkbox v-for="(type, key) in types[4]" :key="key" :label="type.typeid" name="spcailPay" :checked="type.isdefault == 0 ? false : true">
                        {{type.typename}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">押金:</td>
                  <td width="80%" style="line-height: 40px;">
                    <el-checkbox-group v-model="form.yaPay">
                      <el-checkbox v-for="(type, key) in types[5]" :key="key" :label="type.typeid" name="yaPay" :checked="type.isdefault == 0 ? false : true">
                        {{type.typename}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
                <tr>
                  <td width="20%" align="center" bgcolor="#f8f8f8" style="line-height: 40px;">阶段性费用:</td>
                  <td width="80%" style="line-height: 40px;">
                    <el-checkbox-group v-model="form.jiePay">
                      <el-checkbox v-for="(type, key) in types[6]" :key="key" :label="type.typeid" name="jiePay" :checked="type.isdefault == 0 ? false : true">
                        {{type.typename}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-form>
          <div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;text-align: center">
            <el-button type="danger" plain @click="submitForm('form')">保存</el-button>
          </div>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        monthPay: [],
        yearPay: [],
        dayPay: [],
        spcailPay: [],
        yaPay: [],
        jiePay: []
      },
      types: [],
      selectType: ""
    };
  },
  components: {},
  watch: {},
  mounted() {
    this.fetchType();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.form.monthPay.length === 0 &&
            this.form.yearPay.length === 0 &&
            this.form.dayPay.length === 0 &&
            this.form.spcailPay.length === 0 &&
            this.form.yaPay.length === 0 &&
            this.form.jiePay.length === 0
          ) {
            this.$alert(this.message.payTypeEmpty, "", {
              confirmButtonText: "确定",
              callback: action => {}
            });
            return;
          }
          var typeids = [];
          typeids = typeids.concat(this.form.monthPay);
          typeids = typeids.concat(this.form.yearPay);
          typeids = typeids.concat(this.form.dayPay);
          typeids = typeids.concat(this.form.spcailPay);
          typeids = typeids.concat(this.form.yaPay);
          typeids = typeids.concat(this.form.jiePay);
          this.savePay(typeids);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchType: async function() {
      let url = this.api.pricetypelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.types = res.data.data;
      let typeArr = res.data.data;
      this.selectType = "";
      for (var type in typeArr) {
        for (let n = 0; n < typeArr[type].length; n++) {
          if (typeArr[type][n].isdefault == 1) {
            this.selectType = this.selectType + typeArr[type][n].typename + " ";
          }
        }
      }
    },
    savePay: async function(typeids) {
      let url = this.api.updatepricetype;
      var data = {
        typeids: typeids
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$alert(res.data.data, "", {
            confirmButtonText: "确定",
            callback: action => {
              this.fetchType();
            }
          });
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
    }
  }
};
</script>

<style scoped>
b {
  font-weight: normal;
}
.csfy {
  background-color: #fff;
  min-height: 100%;
  position: relative;
}
.top-tit {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}
.top-tit h5 {
  color: #ff8777;
  font-weight: normal;
  float: left;
  line-height: 30px;
  margin: 0;
  font-size: 18px;
}
.demo-ruleForm {
  display: flex;
}
.t_table {
  margin-top: 4%;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  border-spacing: 0;
  border-collapse: collapse;
}
.t_table td {
  border: 1px solid #ddd;
  padding: 8px;
}
label.dots {
  display: inline-block;
  cursor: pointer;
}
label.dots input[type="checkbox"] {
  /* appearance: none; */
  -webkit-appearance: none;
  outline: none;
  display: none;
}
label.dots input[type="checkbox"] + span {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: url(/static/img/dots.png) no-repeat;
  background-position: 0 0;
}
.re2 {
  font-weight: normal;
  margin-left: 6px;
}
.IC_bottom .table td b {
  font-size: 14px;
  font-weight: normal;
  color: #222;
}
label.dots input[type="checkbox"]:checked + span {
  background-position: 0 -11px;
}
.xuanze {
  display: inline-block;
  margin-right: 2%;
}
</style>
