<template>
	<div class="PDChoose" v-loading="loading">
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
            <fieldset v-for="(data, index, key) in datas" :key="key" style="border: 1px solid rgb(229, 229, 229)">
              <legend style="color: #333">物资名称：{{ data.goods }}</legend>
              <p style="color: #333; font-size: 15px;margin-bottom: 10px;">理论在库数量：{{ data.sys_num }}&nbsp;&nbsp;&nbsp;&nbsp;实际在库数量：{{ data.real_num }}&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: red;font-weight: normal;">{{ data.sys_num > data.real_num ? '盘亏：' : '盘盈：' }}{{ data.real_num - data.sys_num }}</b></p>
              <el-table
                :data="data.tableData"
                stripe
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
                prop="supplier"
                label="供应商">
                </el-table-column>
                <el-table-column
                prop="price"
                label="单价"
                width="70">
                </el-table-column>
                <el-table-column
                prop="product_time"
                label="生产日期">
                </el-table-column>
                <el-table-column
                prop="expire_time"
                label="有效期">
                </el-table-column>
                <el-table-column
                prop="num"
                label="库存"
                width="70">
                </el-table-column>
                <el-table-column
                prop="operate_num"
                label="操作数量">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.operate_num" size="mini" :min="-scope.row.num" label="请输入数量" :controls="false" style="width: 100px;"></el-input-number>
                </template>
                </el-table-column>
              </el-table>
            </fieldset>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
            <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
              <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm">完成</el-button>
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
  data() {
    return {
      datas: [],
      loading: false,
      bLoading: false
    };
  },
  watch: {},
  mounted() {
    if (this.repo_id !== 0) {
      for (let i = 0; i < this.PDChooseList.length; i++) {
        let data = {
          goods_id: this.PDChooseList[i].goods_id,
          tableData: this.PDChooseList[i].goods_list,
          multipleSelection: [],
          real_num: this.PDChooseList[i].real_num,
          sys_num: this.PDChooseList[i].sys_num,
          num: this.PDChooseList[i].real_num - this.PDChooseList[i].sys_num,
          goods: this.PDChooseList[i].goods
        };
        this.datas.push(data);
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      for (let i = 0; i < this.datas.length; i++) {
        if(val.length !== 0){
          if (this.datas[i].goods_id === val[0].goods_id) {
            this.datas[i].multipleSelection = val;
            break;
          }
        }
      }
    },
    submitForm() {
      this.bLoading = true;
      let flag = 0;
      let list = [];
      for (let i = 0; i < this.datas.length; i++) {
        if (this.datas[i].multipleSelection.length !== 0) {
          var total = 0;
          for (let k = 0; k < this.datas[i].multipleSelection.length; k++) {
            if (this.datas[i].multipleSelection[k].operate_num) {
              total = total + this.datas[i].multipleSelection[k].operate_num;
              let data = {
                goods_id: this.datas[i].multipleSelection[k].goods_id,
                repo_flow_id: this.datas[i].multipleSelection[k].repo_flow_id,
                num: this.datas[i].multipleSelection[k].operate_num,
              };
              list.push(data);
            }
          }
          if (total === this.datas[i].num) {
            flag = 1;
          } else {
            flag = 2;
            this.$alert(this.message.pleaseCorrectFill + this.datas[i].goods + this.message.operateAmount, "", {
              confirmButtonText: this.message.confirm,
              callback: action => {
                this.bLoading = false;
              }
            });
            return;
          }
        }else{
          this.$alert(this.message.pleaseCheckGoods, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
          return;
        }
      }
      if (flag === 1) {
        let data = {
          repo_id: this.repo_id,
          goods_list: list
        };
        this.savePDChoose(data);
      }
    },
    hideEditFalse() {
      this.$store.dispatch("PDChooseFalse");
    },
    savePDChoose: async function(data) {
      let url = this.api.addinventorycheck;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$store.dispatch("PDRepoFalse");
          this.$store.dispatch("addKCPDFalse");
          this.bLoading = false;
          this.hideEditFalse();
          this.$store.dispatch("repoId", 0);
          this.$parent.fetchList(1);
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
  computed: mapState(["PDChooseList", "repo_id"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1200px;
  height: 680px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -340px;
  left: 50%;
  margin-left: -600px;
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
.PDChoose {
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