<template>
	<el-container style="height: 100%;">
		<el-header style="height: 67px;border-bottom: 1px solid #ddd;">
			<div>
        <h5 style="color: #ff8777;margin-left: 30px;padding-top: 20px;margin-bottom: 20px;">物资</h5>
      </div>
			<div class="find" style="position: absolute;top: 14px;right: 30px;">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" @submit.native.prevent>
					<el-form-item label="物资名称" prop="name" style="margin: 0;">
						<el-input type="text" v-model="ruleForm.name" style="width:100px" size="small"></el-input>
					</el-form-item>
					<div style="margin-left: 10px">
						<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
					</div>
				</el-form>
			</div>
		</el-header>
		<el-main style="padding: 0;position: relative;">
			<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
				<div>
					<el-table
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                label="物资名称">
            </el-table-column>
            <el-table-column
                prop="category"
                label="所属类别">
            </el-table-column>
            <el-table-column
                prop="specification"
                label="规格">
            </el-table-column>
            <el-table-column
                prop="description"
                label="物资描述">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="tableData.length != 0" type="text" size="small" @click="showAddWZSZ(scope)">修改</el-button>
                </template>
            </el-table-column>
					</el-table>
					<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
						<div>
              <el-button type="danger" @click="delMore">删除</el-button>
              <el-button type="success" @click="showAddWZSZ(0)">添加</el-button>
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
          <v-wz :goodsId="goodsId" :typeLists="typeLists"></v-wz>
				</div>
			</el-scrollbar>
		</el-main>
	</el-container>
	
</template>

<script>
import vWz from "./addWZ.vue";

export default {
  data() {
    return {
      ruleForm: {
        name: ""
      },
      rules: {},
      tableData: [],
      name: "",
      multipleSelection: [],
      total: 0,
      last_page: 0,
      goodsId: 0,
      loading: false,
      currentPage: 1,
      typeLists: []
    };
  },
  components: {
    vWz
  },
  mounted() {
    this.fetchList(1);
  },
  watch: {
    "$route.params.id"() {
      this.fetchList(1);
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.name = this.ruleForm.name;
          this.fetchList(1);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getgoodslist + "?page=" + val;
      var data = {
        category_id: this.$route.params.id,
        name: this.name
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
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
    },
    fetchTypeList: async function() {
      let url = this.api.getgoodscategorylist;
      let data = {};
      const res = await this.$http.post(url, data);
      this.typeLists = res.data.data;
    },
    showAddWZSZ(scope) {
      this.$store.dispatch("addWZTrue");
      this.fetchTypeList();
      if (scope == 0) {
        this.goodsId = 0;
      } else {
        this.goodsId = scope.row.id;
      }
    },
    delete: async function(id) {
      let url = this.api.delgoods;
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
        this.$alert(this.message.pleaseChoicePro, "", {
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
            this.delete(data);
          })
          .catch(() => {});
      }
    },
    clean() {
      this.goodsId = 0;
    }
  }
};
</script>

<style scoped>
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
a {
  color: #606266;
}
</style>