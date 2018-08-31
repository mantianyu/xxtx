<template>
	<div class="PDCheck" v-show="PDCheck">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>查看</h5>
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
                style="width: 100%">
                <el-table-column 
                    type="index" 
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="in_order_id"
                    label="入库单号">
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
                    label="单价">
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
                    label="操作数量">
                </el-table-column>
            </el-table>
					</div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["goods_id"],
  data() {
    return {
      tableData: [],
      loading: false
    };
  },
  watch: {
    goods_id() {
      if (this.goods_id !== 0) {
        this.fetchList();
      }
    }
  },
  mounted() {},
  methods: {
    hideEditFalse() {
      this.$store.dispatch("PDCheckFalse");
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.viewgoodscheck;
      let data = {
        id: this.goods_id
      };
      try {
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
              this.$store.dispatch("PDCheckFalse");
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.$store.dispatch("PDCheckFalse");
          }
        });
      }
    }
  },
  computed: mapState(["PDCheck"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
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
.PDCheck {
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