<template>
	<div class="addOrder" v-show="addOrder">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>食物</h5>
					<span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="老人姓名:" prop="elderid">
									<el-select v-model="form.elderid" filterable clearable placeholder="请选择老人" style="width: 220px;">
										<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="就餐日期:" prop="eattime">
									<el-date-picker type="datetime" placeholder="选择日期" style="width: 220px;" v-model="form.eattime" :picker-options="pickerOptions"></el-date-picker>
								</el-form-item>
								<el-form-item label="就餐时间段:" prop="mealtime">
									<el-select v-model="form.mealtime" clearable placeholder="请选择就餐时间段" style="width: 220px;">
										<el-option v-for="(meal, key) in mealName" :label="meal" :key="key" :value="key * 1"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="总数量:" prop="foodordernum">
									<el-input disabled v-model="form.foodordernum" style="width: 220px;"></el-input>
								</el-form-item>
								<el-form-item label="订单金额:" prop="foodmoney">
									<el-input disabled v-model="form.foodmoney" style="width: 220px;"></el-input>
								</el-form-item>
							</div>
							<el-form-item label="选择食物:">
								<el-button type="danger" size="medium" @click="showSelectFood">点击选择食物</el-button>
								<el-table
									:data="Foods"
									stripe
									style="width: 530px;">
									<el-table-column
									type="index"
									width="50">
									</el-table-column>
									<el-table-column
									prop="foodname"
									label="食物名称">
									</el-table-column>
									<el-table-column
									prop="foodprice"
									label="食物价格">
									</el-table-column>
									<el-table-column
									prop="num"
									label="数量">
									</el-table-column>
								</el-table>
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
	    <v-sfood :spicys="spicys" :textures="textures" :tastes="tastes" :diseases="diseases" :Foods="Foods" :tableDatas="tableDatas" :addOrder="addOrder" :eattime="form.eattime"></v-sfood>
	</div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";
import vSfood from "./selectFood.vue";

export default {
  props: ["mealName", "spicys", "textures", "tastes", "diseases", "elders"],
  data() {
    return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        },
      form: {
        elderid: "",
        eattime: new Date(),
        mealtime: "",
        foodmoney: "",
        foodordernum: ""
      },
      rules: {
        elderid: [
          { required: true, message: this.message.pleaseChoiceElderName, trigger: "change" }
        ],
        foodmoney: [
          { required: true, message: this.message.pleaseInputOrderMoney, trigger: "blur" }
        ],
        foodordernum: [
          { required: true, message: this.message.pleaseInputTotalQuantity, trigger: "blur" }
        ]
      },
      Foods: [],
      tableDatas: [],
      bLoading: false
    };
  },
  components: {
    vSfood
  },
  watch: {},
  mounted() {
    // var data = {
    //   canorder: 1
    // };
    // this.fetchList(1, data);
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var data = {
            elderid: this.form.elderid,
            eattime: Date.parse(new Date(this.form.eattime)) / 1000,
            mealtime: this.form.mealtime,
            foodmoney: this.form.foodmoney,
            foodordernum: this.form.foodordernum,
            orderitem: this.Foods
          };
          this.saveOrder(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addOrderFalse");
      this.$refs["form"].resetFields();
      this.form.eattime = new Date();
      this.Foods = [];
      var data = {
        canorder: 1
      };
      this.fetchList(1, data);
    },
    saveOrder: async function(data) {
      let url = this.api.addfoodorder;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.addOrderSuccess,
              type: "success"
            });
          this.$parent.fetchList(0, 1);
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
          confirmButtonText:this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    showSelectFood() {
      this.$store.dispatch("selectFoodTrue");
    },
    getFoods(data) {
      this.Foods = data;
      var foodNum = 0;
      var foodMoney = 0;
      for (let i = 0; i < data.length; i++) {
        foodNum = foodNum + data[i].num;
        foodMoney = foodMoney + data[i].foodprice * data[i].num;
      }
      this.form.foodmoney = foodMoney;
      this.form.foodordernum = foodNum;
    },
    fetchList: async function(val, data) {
      let url = this.api.foodlist + "?page=" + val;
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.tableDatas = [];
        var foodLists = res.data.data.data;
        for (let i = 0; i < foodLists.length; i++) {
          var data = {
            foodid: foodLists[i].foodid,
            foodname: foodLists[i].foodname,
            foodprice: foodLists[i].foodprice,
            num: 0
          };
          this.tableDatas.push(data);
        }
        this.total = res.data.data.total;
        this.last_page = res.data.data.last_page;
      }
    }
  },
  computed: mapState(["addOrder"])
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
.addOrder {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
