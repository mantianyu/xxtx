<template>
	<div class="WZDBApprove" v-show="WZDBApprove">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>物资调拨审核</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 86%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="申请仓库:" prop="in_repo">
                  <el-input v-model="form.in_repo" style="width: 220px;" disabled></el-input>
								</el-form-item>
								<el-form-item label="调出仓库:" prop="out_repo">
                  <el-input v-model="form.out_repo" style="width: 220px;" disabled></el-input>
								</el-form-item>
								<el-form-item label="申请日期:" prop="date">
                  <el-input v-model="form.date" style="width: 220px;" disabled></el-input>
								</el-form-item>
							</div>
							<div>
								<el-table ref="singleTable" :data="tableData" style="width: 100%">
									<el-table-column type="index" width="50">
									</el-table-column>
									<el-table-column property="goods" label="物资名称">
									</el-table-column>
									<el-table-column property="num" label="数量">
									</el-table-column>
									<el-table-column property="realNum" label="实际数量">
									</el-table-column>
                  <el-table-column label="操作">
										<template slot-scope="scope">
                      <el-button type="info" size="small" @click="selectGoods(scope.$index, scope)">选择</el-button>
										</template>
                  </el-table-column>
								</el-table>
							</div>
							<div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
								<el-button type="danger" size="medium" style="margin-left: 30px;" :loading="bLoading1" @click="submitForm(1)">同意</el-button>
								<el-button type="info" size="medium" :loading="bLoading2" @click="submitForm(2)">不同意</el-button>
								<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
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
import { mapState } from "vuex";

export default {
  props: ["Id"],
  data() {
    return {
      form: {
        in_repo: "",
        out_repo: "",
        date: ""
      },
      rules: {},
      loading: false,
      tableData: [],
      repoId: 0,
      goodId: 0,
      total: 0,
      index: 0,
      goodsList: [],
      bLoading1: false,
      bLoading2: false
    };
  },
  components: {
    vCkchoose
  },
  watch: {
    Id() {
      if (this.Id !== 0) {
        this.fetchDetail(this.Id);
      }
    }
  },
  mounted() {},
  methods: {
    submitForm(agree) {
      if (agree === 1) {
        this.bLoading1 = true;
        if(this.goodsList.length === 0){
          this.$alert(this.message,pleaseChoiceOperaAmount, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading1 = false;
            }
          });
          return;
        }
      } else {
        this.bLoading2 = true;
      }
      var data = {
        id: this.Id,
        agree: agree,
        goods_list: this.goodsList
      };
      this.saveApprove(data);
    },
    hideEditFalse() {
      this.$store.dispatch("WZDBApproveFalse");
      this.$refs["form"].resetFields();
      this.tableData = [];
      this.repoId = 0;
      this.index = 0;
      this.goodsList = [];
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.viewallotapply;
      let data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.form.in_repo = res.data.data.in_repo;
          this.form.out_repo = res.data.data.out_repo;
          this.form.date = res.data.data.created_at;
          this.repoId = res.data.data.out_repo_id;
          for (let i = 0; i < res.data.data.goods_list.length; i++) {
            res.data.data.goods_list[i]["realNum"] = "";
            this.tableData.push(res.data.data.goods_list[i]);
          }
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
    saveApprove: async function(data) {
      let url = this.api.allotapprove;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$parent.fetchList(1);
          this.bLoading1 = false;
          this.bLoading2 = false;
          this.hideEditFalse();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading1 = false;
              this.bLoading2 = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading1 = false;
            this.bLoading2 = false;
          }
        });
      }
    },
    selectGoods(index, scope) {
      this.goodId = scope.row.goods_id;
      this.total = scope.row.num;
      this.index = index;
      this.$store.dispatch("CKChooseTrue");
    },
    clean() {
      this.goodId = 0;
      this.total = 0;
    },
    getData(datas, total) {
      this.tableData[this.index]["realNum"] = total;
      for (let i = 0; i < datas.length; i++) {
        var flag = true;
        for(let k = 0; k < this.goodsList.length; k++){
          if(this.goodsList[k].goods_id === datas[i].goods_id && this.goodsList[k].repo_flow_id === datas[i].repo_flow_id){
            this.goodsList[k].num = datas[i].num;
            var flag = false;
            break;
          }
        }
        if(flag){
          this.goodsList.push(datas[i]);
        }
      }
    }
  },
  computed: mapState(["WZDBApprove"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
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
  margin-left: -550px;
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
.WZDBApprove {
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