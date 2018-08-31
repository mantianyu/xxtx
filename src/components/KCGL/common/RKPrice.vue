<template>
	<div class="RKPrice" v-if="RKPrice">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>价格修改</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 86%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-table ref="singleTable" :data="tableData" style="width: 100%">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column property="goods" label="物资名称">
                </el-table-column>
                <el-table-column property="price" label="单价" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.price" size="mini" placeholder="请输入单价"></el-input>
                    </template>
                </el-table-column>
                <el-table-column property="num" label="数量">
                </el-table-column>
                <el-table-column property="supplier" label="供应商">
                </el-table-column>
            </el-table>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="saveIncome">确认</el-button>
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
  props: ["Id"],
  data() {
    return {
      loading: false,
      tableData: [],
      bLoading: false
    };
  },
  watch: {
    Id() {
      if (this.Id !== 0) {
        this.fetchDetail(this.Id);
      }
    }
  },
  methods: {
    hideEditFalse() {
      this.$store.dispatch("RKPriceFalse");
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      let url = this.api.viewinventoryincome;
      let data = {
        id: id
      };
      const res = await this.$http.post(url, data);
      this.tableData = res.data.data.goods_list;
    },
    saveIncome: async function() {
      this.bLoading = true;
      let datas = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let data = {
          goods_id: this.tableData[i].goods_id,
          price: this.tableData[i].price
        };
        datas.push(data);
      }
      let url = this.api.modifyinventoryincome;
      let data = {
        id: this.Id,
        goods_list: datas
      };
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
    }
  },
  computed: mapState(["RKPrice"])
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
.RKPrice {
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