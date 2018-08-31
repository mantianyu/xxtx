<template>
  <div class="fytz">
    <div class="top-tit">
      <h5>费用调整</h5>
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="tableDataFYTZ"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="elder_name"
          label="老人姓名">
        </el-table-column>
        <el-table-column
          prop="bed_name"
          label="床位号">
        </el-table-column>
        <el-table-column
          prop="price"
          label="总费用">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" >详情</el-button><!--@click="showCheckOut(scope.row)"-->
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <div style="display: flex;margin: 20px;float: right;">
          <el-button type="primary" size="small" @click="FytzManageList(1)">首页</el-button>
          <el-pagination
            background
            @current-change="handleCurrentChange"
					    :current-page="currentPage"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
          <el-button type="primary" size="small" @click="FytzManageList(last_page)">末页</el-button>
        </div>
      </div>
    </div>
    <!--<v-fytzt></v-fytzt>-->
  </div>
</template>

<script>
import VFytzt from "./common/FYTZTable.vue";

export default {
  data() {
    return {
      ruleForm: {},
      rules: {},
      tableDataFYTZ: [],
      multipleSelection: [],
      total: 0,
      last_page: 0,
      loading: false,
      currentPage: 1
    };
  },
  components: {
    VFytzt
  },
  mounted() {
    this.FytzManageList(1);
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.FytzManageList(val);
    },
    FytzManageList: async function(val) {
      this.loading = true;
      let url = this.api.addeldersnursingscheme + "?page=" + val;
      let data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableDataFYTZ = [];
          this.tableDataFYTZ = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
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
    }
  }
};
</script>

<style scoped>
.fytz {
  background-color: #fff;
  min-height: 100%;
  position: relative;
}
.top-tit {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}
.top-tit h5 {
  color: #ff8777;
  font-weight: normal;
  float: left;
  line-height: 30px;
  margin: 0;
  font-size: 18px;
}
.demo-ruleForm {
  display: flex;
}
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
