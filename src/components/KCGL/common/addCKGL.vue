<template>
	<div class="addCKGL" v-show="addCKGL">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>出库管理</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 90%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="出库单号:" prop="order_id">
                    <el-input disabled v-model="form.order_id" placeholder="新建后自动生成单号" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="物资去向:" prop="flow_type">
                    <el-select v-model="form.flow_type" clearable placeholder="请选择物资去向" style="width: 220px;">
                        <el-option v-for="(type, key) in flow" :label="type" :value="key * 1" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库:" prop="repo_id">
                    <el-select v-model="form.repo_id" clearable placeholder="请选择仓库" style="width: 220px;" @change="selectRepo">
                        <el-option v-for="(type, key) in repo" :label="type.name" :value="type.id" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出库时间" prop="date">
                    <el-date-picker type="date" placeholder="选择日期" style="width: 220px;" v-model="form.date"></el-date-picker>
                </el-form-item>
								<el-form-item label="经办人:" prop="operator_id">
									<el-select v-model="form.operator_id" clearable placeholder="请选择经办人" style="width: 220px;">
										<el-option v-for="(type, key) in operator" :label="type.name" :value="type.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="登记人:" prop="checker">
									<el-input disabled v-model="form.checker" style="width: 220px;"></el-input>
								</el-form-item>
							</div>
							<div>
								<el-form-item label="添加物资:">
									<el-button type="danger" size="mini" @click="addGoods">添加</el-button>
								</el-form-item>
								<el-table ref="singleTable" :data="tableData" style="width: 100%">
									<el-table-column type="index" width="50">
									</el-table-column>
									<el-table-column property="goods_id" label="物资名称" width="200">
										<template slot-scope="scope">
											<el-select v-model="scope.row.goods_id" size="mini" clearable placeholder="请选择物资" @change="selectGood(scope.$index, scope)">
												<el-option v-for="(type, key) in goods" :label="type.goods" :value="type.goods_id" :key="key"></el-option>
											</el-select>
										</template>
									</el-table-column>
									<el-table-column property="num" label="数量" width="140">
									</el-table-column>
									<el-table-column property="user_id" label="员工" width="190">
										<template slot-scope="scope">
											<el-select v-model="scope.row.user_id" size="mini" clearable placeholder="请选择员工" @change="selectUser(scope)">
												<el-option v-for="(type, key) in operator" :label="type.name" :value="type.id" :key="key"></el-option>
											</el-select>
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
    <v-ckchoose :repoId="repoId" :goodId="goodId" :total="total"></v-ckchoose>
	</div>
</template>

<script>
import vCkchoose from "./CKChoose.vue";
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["flow", "repo", "operator"],
  data() {
    return {
      form: {
        order_id: "",
        flow_type: "",
        repo_id: "",
        date: "",
        operator_id: "",
        checker: localEvent.StorageGetter("empName")
      },
      rules: {
        flow_type: [
          { required: true, message: this.message.pleaseChoiceGoodsOrigin, trigger: "change" }
        ],
        repo_id: [{ required: true, message: this.message.pleaseChoiceWarehouse, trigger: "change" }],
        date: [
          { required: true, message: this.message.pleaseChoiceWarehouseTime, trigger: "change" }
        ],
        operator_id: [
          { required: true, message: this.message.pleaseChoiceAgent, trigger: "change" }
        ]
      },
      tableData: [
        {
          goods_id: "",
          num: "",
          isDel: false
        }
      ],
      loading: false,
      goods: [],
      repoId: 0,
      goodId: 0,
      index: 0,
      goodsList: [],
      total: 0,
      bLoading: false
    };
  },
  components: {
    vCkchoose
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
            flow_type: this.form.flow_type,
            repo_id: this.form.repo_id,
            operator_id: this.form.operator_id,
            date: Date.parse(this.form.date) / 1000,
            goods_list: this.goodsList
          };
          this.saveIncome(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addCKGLFalse");
      this.$refs["form"].resetFields();
      this.tableData = [
        {
          goods_id: "",
          num: "",
          isDel: false
        }
      ];
      this.goods = [];
      this.goodsList = [];
      this.index = 0;
    },
    fetchDetail: async function(id) {
      let url = this.api.viewinventoryoutcome;
      let data = {
        id: id
      };
      const res = await this.$http.post(url, data);
    },
    saveIncome: async function(data) {
      let url = this.api.addinventoryoutcome;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.fetchList(1);
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
    selectRepo: async function(val) {
      let url = this.api.getrepositoryallgoods;
      let data = {
        id: val
      };
      const res = await this.$http.post(url, data);
      this.goods = res.data.data;
      this.tableData = [
        {
          goods_id: "",
          num: "",
          isDel: false
        }
      ];
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
          this.tableData[index]["maxNum"] = this.goods[i].num * 1;
          this.repoId = this.form.repo_id;
          this.goodId = scope.row.goods_id;
          this.index = index;
          this.$store.dispatch("CKChooseTrue");
        }
      }
    },
    clean() {
      this.repoId = 0;
      this.goodId = 0;
    },
    getData(datas, total) {
      this.tableData[this.index]["num"] = total;
      for (let i = 0; i < datas.length; i++) {
        var flag = true;
        for(let k = 0; k < this.goodsList.length; k++){
          if(this.goodsList[k].goods_id === datas[i].goods_id && this.goodsList[k].in_order_id === datas[i].in_order_id){
            this.goodsList[k].num = datas[i].num;
            var flag = false;
            break;
          }
        }
        if(flag){
          datas[i]["user_id"] = this.tableData[this.index].user_id;
          this.goodsList.push(datas[i]);
        }
      }
    },
    selectUser(scope) {
      if (this.goodsList.length !== 0) {
        for (let i = 0; i < this.goodsList.length; i++) {
          if (this.goodsList[i].goods_id === scope.row.goods_id) {
            this.goodsList[i]["user_id"] = scope.row.user_id;
          }
        }
      }
    }
  },
  computed: mapState(["addCKGL"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 540px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -270px;
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
.addCKGL {
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