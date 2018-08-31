<template>
	<div class="addWZDB" v-show="addWZDB">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>物资调拨</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 86%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="申请仓库:" prop="in_repo_id">
									<el-select v-model="form.in_repo_id" clearable placeholder="请选择仓库" style="width: 220px;">
										<el-option v-for="(type, key) in in_repo" :label="type.name" :value="type.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="调出仓库:" prop="out_repo_id">
									<el-select v-model="form.out_repo_id" clearable placeholder="请选择仓库" style="width: 220px;" @change="selectOutRepo">
										<el-option v-for="(type, key) in out_repo" :label="type.name" :value="type.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div>
								<el-form-item label="添加物资:">
									<el-button type="danger" size="mini" @click="addGoods">添加</el-button>
								</el-form-item>
								<el-table ref="singleTable" :data="tableData" style="width: 100%">
									<el-table-column type="index" width="50">
									</el-table-column>
									<el-table-column property="goods_id" label="物资名称" width="250">
										<template slot-scope="scope">
											<el-select v-model="scope.row.goods_id" size="mini" clearable placeholder="请选择物资" @change="selectGood(scope.$index, scope)">
												<el-option v-for="(type, key) in goods" :label="type.goods" :value="type.goods_id" :key="key">
                          <span style="float: left">{{ type.goods }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">数量：{{ type.num }}</span>
                        </el-option>
											</el-select>
										</template>
									</el-table-column>
									<el-table-column property="num" label="数量" width="220">
										<template slot-scope="scope">
                      <el-input-number v-model="scope.row.num" :precision="0" @change="handleChange(scope.$index, scope)" size="mini" :min="1" label="请输入数量" :controls="false"></el-input-number>
										</template>
									</el-table-column>
									<el-table-column label="操作">
										<template slot-scope="scope">
											<el-button v-if="scope.row.isDel" @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
												移除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>
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
  props: ["in_repo", "out_repo"],
  data() {
    var validateOutRepo = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseChoiceOutWarehouse));
      } else {
        if (this.form.in_repo_id === this.form.out_repo_id) {
          callback(new Error(this.message.applyWarehouseNotSame));
        }
        callback();
      }
    };
    return {
      form: {
        in_repo_id: "",
        out_repo_id: ""
      },
      rules: {
        in_repo_id: [
          { required: true, message: this.message.pleaseChoiceApplyWarehouse, trigger: "change" }
        ],
        out_repo_id: [
          { required: true, validator: validateOutRepo, trigger: "change" }
        ]
      },
      loading: false,
      bLoading: false,
      goods: [],
      tableData: [
        {
          goods_id: "",
          num: "",
          maxNum: 1,
          isDel: false
        }
      ]
    };
  },
  watch: {},
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].goods_id == "" ||
              this.tableData[i].num == ""
            ) {
              this.$alert(this.message.noChoiceAmount, "", {
                confirmButtonText: this.message.confirm,
                callback: action => {
                  this.bLoading = false;
                }
              });
              return;
            }
          }
          var data = {
            in_repo_id: this.form.in_repo_id,
            out_repo_id: this.form.out_repo_id,
            goods_list: this.tableData
          };
          this.saveIncome(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addWZDBFalse");
      this.$refs["form"].resetFields();
      this.tableData = [
        {
          goods_id: "",
          num: "",
          maxNum: 1,
          isDel: false
        }
      ];
      this.goods = [];
    },
    saveIncome: async function(data) {
      let url = this.api.allotapply;
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
    },
    addGoods() {
      var data = {
        goods_id: "",
        num: "",
        isDel: true
      };
      this.tableData.push(data);
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    selectOutRepo(val) {
      this.fetchGoods(val);
    },
    fetchGoods: async function(val) {
      let url = this.api.getrepositoryallgoods;
      let data = {
        id: val
      };
      const res = await this.$http.post(url, data);
      this.goods = res.data.data;
    },
    selectGood(index, scope) {
      for (let k = 0; k < this.tableData.length; k++) {
        if (index !== k) {
          if (this.tableData[k].goods_id === scope.row.goods_id) {
            this.$alert(this.message.goodsRepeat, "", {
              confirmButtonText: this.message.confirm,
              callback: action => {
                this.tableData[index].goods_id = "";
              }
            });
            return;
          }
        }
      }
      for (let i = 0; i < this.goods.length; i++) {
        if (this.goods[i].goods_id == scope.row.goods_id) {
          this.tableData[index]["maxNum"] = this.goods[i].num;
        }
      }
    },
    handleChange(index, scope) {
      if (scope.row.num > scope.row.maxNum) {
        this.$alert(this.message.allotAmountWarning, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.tableData[index]["num"] = "";
          }
        });
      }
    }
  },
  computed: mapState(["addWZDB"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 580px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -290px;
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
.addWZDB {
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