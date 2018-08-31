<template>
	<div class="CKChoose" v-show="CKChoose">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>选择</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 84%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
            <el-table
                :data="tableData"
                stripe
                v-loading="loading"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                prop="in_order_id"
                label="入库单编号">
                </el-table-column>
                <el-table-column
                prop="goods"
                label="物资名称">
                </el-table-column>
                <el-table-column
                prop="num"
                label="库存"
                width="90">
                </el-table-column>
                <el-table-column
                prop="out_num"
                label="出库数量">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.out_num" size="mini" :precision="0" @change="handleChange(scope.$index, scope)" :min="0" label="请输入数量" :controls="false" style="width: 80px;"></el-input-number>
                </template>
                </el-table-column>
              </el-table>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
            <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
              <el-button type="danger" size="medium" style="margin-left: 30px;" @click="submitForm">完成</el-button>
            </div>
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
  props: ["repoId", "goodId", "total"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      loading: false
    };
  },
  watch: {
    goodId() {
      if (this.goodId !== 0) {
        this.fetchList();
      }
    }
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    hideEditFalse() {
      this.$store.dispatch("CKChooseFalse");
      this.tableData = [];
      this.$parent.clean();
    },
    submitForm() {
      if (this.multipleSelection.length === 0) {
        this.$alert(this.message.pleaseChoiceGoods, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
        return;
      }
      let datas = [];
      let total = 0;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (!this.multipleSelection[i].out_num) {
          this.$alert(this.message.pleaseChoiceGoodsAmount, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {}
          });
          return;
        } else {
          total = total + this.multipleSelection[i].out_num;
        }
        if (this.total === 0) {
          let data = {
            goods_id: this.multipleSelection[i].goods_id,
            num: this.multipleSelection[i].out_num,
            in_order_id: this.multipleSelection[i].in_order_id
          };
          datas.push(data);
        } else {
          let data = {
            goods_id: this.multipleSelection[i].goods_id,
            num: this.multipleSelection[i].out_num,
            repo_flow_id: this.multipleSelection[i].repo_flow_id
          };
          datas.push(data);
        }
      }
      this.$parent.getData(datas, total);
      this.hideEditFalse();
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.getrepositorygoodsorderlist;
      let data = {
        id: this.repoId,
        goods_id: this.goodId
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.tableData = res.data.data;
        this.$nextTick(() => {
          this.loading = false;
        });
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    handleChange(index, scope) {
      if (scope.row.out_num > scope.row.num) {
        this.$alert(this.message.outWarehouseWarning, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.tableData[index]["out_num"] = "";
          }
        });
        return;
      }
      if (this.total !== 0) {
        let totalNum = 0;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].out_num) {
            totalNum = totalNum + this.tableData[i].out_num;
          }
        }
        if (totalNum > this.total) {
          this.$alert(this.message.outWarehouseApplyWarning, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.tableData[index]["out_num"] = "";
            }
          });
          return;
        }
      }
    }
  },
  computed: mapState(["CKChoose"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 480px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -240px;
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
  padding: 20px;
  margin-top: 25px;
  padding-top: 0;
}
.CKChoose {
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