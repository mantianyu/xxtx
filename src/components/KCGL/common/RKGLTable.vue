<template>
    <div class="table">
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column
              prop="repo"
              label="仓库名称">
            </el-table-column>
            <el-table-column
              prop="order_id"
              label="入库单号">
            </el-table-column>
            <el-table-column
              prop="flow_type"
              label="物资来源">
            </el-table-column>
            <el-table-column
              prop="date"
              label="入库时间">
            </el-table-column>
            <el-table-column
              prop="operator"
              label="经办人">
            </el-table-column>
            <el-table-column
              prop="checker"
              label="登记人">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showPrice(scope.row)">价格修改</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
            <el-button type="danger" @click="delMore">删除</el-button>
            <el-button type="success" @click="showEdit">入库登记</el-button>
          </div>
          <div style="display: flex;margin-right: 20px;">
            <el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              layout="prev, pager, next"
              :total="total">
            </el-pagination>
            <el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
          </div>
        </div>
        <v-rkgl :flow="flow" :repo="repo" :operator="operator" :goods="goods"></v-rkgl>
        <v-rkprice :Id="Id"></v-rkprice>
    </div>
</template>

<script>
import vRkgl from "./addRKGL.vue";
import vRkprice from "./RKPrice.vue";

export default {
  props: ["searchData", "repo", "operator", "goods"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      Id: 0,
      total: 0,
      last_page: 0,
      elders: [],
      loading: false,
      emps: [],
      currentPage: 1,
      flow: [],
    };
  },
  components: {
    vRkgl, vRkprice
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchData();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getinventoryincomelist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.page_count;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
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
    fetchData: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.GOODS_FLOW_FROM,
        ]
      };
      const res = await this.$http.post(url, data);
      this.flow = res.data.data;
    },
    delList: async function(id) {
      let url = this.api.delinventoryincome;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.fetchList(1);
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
        this.$alert(this.message.pleaseChoiceDelete, "", {
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
              let id = id_arr[k].id;
              data.push(id);
            }
            this.delList(data);
          })
          .catch(() => {});
      }
    },
    showEdit() {
      this.$store.dispatch("addRKGLTrue");
    },
    showPrice(scope) {
      this.Id = scope.id;
      this.$store.dispatch("RKPriceTrue");
    },
    clean() {
      this.Id = 0;
    }
  }
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
</style>
