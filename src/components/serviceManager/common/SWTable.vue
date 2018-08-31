<template>
	<el-container style="height: 100%;width: 100%;position: absolute;">
		<el-header style="height: 67px;border-bottom: 1px solid #ddd;position: relative">
			<div>
				<h5 style="color: #ff8777;margin-left: 30px;padding-top: 20px;margin-bottom: 20px;">食物</h5>
			</div>
			<div class="find" style="position: absolute;top: 14px;right: 30px;">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" @submit.native.prevent>
					<el-form-item label="食物名称" prop="foodname" style="margin: 0;">
						<el-input type="text" v-model="ruleForm.foodname" style="width:100px" size="small" auto-complete="off"></el-input>
					</el-form-item>
					<div style="margin-left: 10px">
						<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
					</div>
				</el-form>
			</div>
		</el-header>
		<el-main style="padding: 0;position: relative;">
			<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
				<div>
					<el-table
						v-loading="loading"
							:data="tableData"
							stripe
							style="width: 100%"
							@selection-change="handleSelectionChange">
							<el-table-column
								type="selection"
								width="55">
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
								prop="introduction"
								label="食物说明">
							</el-table-column>
							<el-table-column
								prop="contraindications"
								label="食物禁忌症">
							</el-table-column>
							<el-table-column
								prop="address"
								label="操作">
									<template slot-scope="scope">
											<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
									</template>
							</el-table-column>
					</el-table>
					<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
						<div>
							<el-button type="danger" @click="delMore">删除</el-button>
              <el-button type="success" @click="showAdd(0)">新增</el-button>
						</div>
						<div style="display: flex;margin-right: 20px;">
							<el-button type="primary" size="small" @click="fetchList(0,1)">首页</el-button>
							<el-pagination
								background
								@current-change="handleCurrentChange"
					    		:current-page="currentPage"
								layout="prev, pager, next"
								:total="total">
							</el-pagination>
							<el-button type="primary" size="small" @click="fetchList(0,last_page)">末页</el-button>
						</div>
					</div>
					<v-food v-if="addFood" :foodId="foodId" :fyid="fyid" :spicys="spicy" :textures="texture" :tastes="taste" :diseases="diseases"></v-food>
				</div>
			</el-scrollbar>
		</el-main>
	 </el-container>
</template>

<script>
import vFood from "./addFood.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      ruleForm: {
        foodname: ""
      },
      rules: {},
      tableData: [],
      multipleSelection: [],
      foodId: 0,
      total: 0,
      last_page: 0,
      fyid: this.$route.params.fyid,
      spicy: [],
      texture: [],
      taste: [],
      loading: false,
      diseases: [],
      splbname: "",
      foodname: "",
      currentPage: 1
    };
  },

  components: {
    vFood
  },
  watch: {
    '$route.params.fyid'(){
      this.fetchList(this.foodname, 1);
    }
  },
  mounted() {
    this.fetchList(this.foodname, 1);
    this.getSpicy();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.foodname = this.ruleForm.foodname;
          this.fetchList(this.foodname, 1);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      this.fetchList(this.foodname, val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchList: async function(foodname, val) {
      this.loading = true;
      let url = this.api.foodlist + "?page=" + val;
      if (foodname === "") {
        var data = {
          fyid: this.$route.params.fyid
        };
      } else {
        var data = {
          fyid: this.$route.params.fyid,
          foodname: foodname
        };
      }
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.foodId = 0;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
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
    deleteFood: async function(id) {
      let url = this.api.fooddel;
      var data = {
        erid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteFoodSuccess,
              type: "success"
            });
          this.fetchList(this.foodname, 1);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
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
    delMore() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceFood, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherDelete, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            var data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].foodid;
              data.push(id);
            }
            this.deleteFood(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addFoodTrue");
      if (scope != 0) {
        this.foodId = scope.foodid;
      } else {
        this.foodId = 0;
      }
    },
    clean() {
      this.foodId = 0;
    },
    getSpicy: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.BEADHOUSE_FOOD_SPICY_LEVEL,
          this.data.BEADHOUSE_FOOD_TEXTURE,
          this.data.BEADHOUSE_FOOD_TASTE,
          this.data.HEALTH_DISEASES
        ]
      };
      const res = await this.$http.post(url, data);
      this.spicy = res.data.data[this.data.BEADHOUSE_FOOD_SPICY_LEVEL];
      this.texture = res.data.data[this.data.BEADHOUSE_FOOD_TEXTURE];
      this.taste = res.data.data[this.data.BEADHOUSE_FOOD_TASTE];
      this.diseases = res.data.data[this.data.HEALTH_DISEASES];
    }
  },
  computed: mapState(["addFood"])
};
</script>

<style scoped>
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
</style>