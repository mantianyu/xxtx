<template>
  <el-container style="height: 100%;background: #ffffff;">
      <el-header style="height: 75px;">
        <div class="top-tit">
          <h5>费用类别</h5>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-aside width="200px" style="padding-left: 10px;"><el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree></el-aside>
        </el-aside>
        <el-main style="position: relative;">
          <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;">
            <el-table
              v-loading="loading"
              :data="tableDataFYLB"
              style="width: 100%"
              stripe
              @selection-change="handleSelectionChange">
              <el-table-column
                type="index"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="fee_type"
                label="费用性质">
                <template slot-scope="scope">
                  <p>{{payType[scope.row.fee_type]}}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="收费标准">
              </el-table-column>
              <el-table-column
                prop="introduction"
                label="备注">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="showEditFalse(scope.row)" v-if="scope.row.is_adjustment != 1">修改</el-button>
                  <el-button type="text" size="small" @click="ManageDel(scope.row.id)" v-if="scope.row.is_fixed != 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div  style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
              <div>
                <el-button type="success" @click="showEditFalse(0)">新增</el-button>
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
          </el-scrollbar>
        </el-main>
        <v-fylbt :cid="cid" :payType="payType"></v-fylbt>
      </el-container>
    </el-container>
</template>

<script>
import VFylbt from "./common/FYLBTable.vue";
export default {
  data() {
    return {
      data: [
        {
          label: "费用性质",
          id: 0,
          children: [
            {
              label: "日常",
              id: 1
            },
            {
              label: "月收",
              id: 2
            },
            {
              label: "年收",
              id: 3
            },
            {
              label: "特殊",
              id: 4
            },
            {
              label: "押金",
              id: 5
            },
            {
              label: "阶段性收费",
              id: 6
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      oldVisitId: 0,
      cprice_mode: [],
      tableDataFYLB: [],
      multipleSelection: [],
      cid: 0,
      total: 0,
      last_page: 0,
      typeId: 0,
      loading: false,
      payType: {
        "1": "日常",
        "2": "月收",
        "3": "年收",
        "4": "特殊",
        "5": "押金",
        "6": "阶段性收费"
      },
      currentPage: 1
    };
  },
  components: {
    VFylbt
  },
  mounted() {
    this.fetchList(1);
  },
  methods: {
    handleNodeClick(data) {
      if (data.id) {
        this.typeId = data.id;
        this.fetchList(1);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getcosttypelist + "?page=" + val;
      var data = {
        type_id: this.typeId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableDataFYLB = [];
          this.tableDataFYLB = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.cid = 0;
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
    showEditFalse(scope) {
      this.$store.dispatch("fylbEditTrue");
      if (scope == 0) {
        this.cid = 0;
      } else {
        this.cid = scope.id;
      }
    },
    ManageDel: async function(id) {
      let url = this.api.costtypedel;
      var data = {
        cid: id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.fetchList(1);
      }
    },
    clean() {
      this.cid = 0;
    }
  }
};
</script>

<style scoped>
.fylb {
  background-color: #fff;
  min-height: 100%;
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
