<template>
	<div class="table">
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
		      prop="drugcode"
		      label="药品编码">
		    </el-table-column>
		    <el-table-column
		      prop="drugname"
		      label="药品名称">
		    </el-table-column>
		    <el-table-column
		      prop="drugtype"
		      label="类别">
		      	<template slot-scope="scope">
		      		<p>{{drugType[scope.row.drugtype]}}</p>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      prop="drugspecification"
		      label="最小规格">
		      	<template slot-scope="scope">
		      		<p>{{drugSpecifical[scope.row.drugspecification]}}</p>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      prop="drugform"
		      label="剂型">
		      	<template slot-scope="scope">
		      		<p>{{drugForm[scope.row.drugform]}}</p>
		      	</template>
		    </el-table-column>
		    <el-table-column
		      prop="drugmanufacturer"
		      label="生产厂家">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
        <el-button type="success" @click="showAdd(0)">新增</el-button>
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
	    <v-drug :drugId="drugId" :drugType="drugType" :drugForm="drugForm" :drugSpecifical="drugSpecifical" :drugAttribute="drugAttribute"></v-drug>
	</div>
</template>

<script>
import vDrug from "./addDrug.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      drugId: 0,
      total: 0,
      last_page: 0,
      drugType: [],
      drugForm: [],
      drugSpecifical: [],
      loading: false,
      currentPage: 1,
      drugAttribute: []
    };
  },
  components: {
    vDrug
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchDrugType();
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
      let url = this.api.druglist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.data.length == 0) {
            this.$notify({
              title: this.message.hint,
              message: this.message.informationNoExist,
              type: "warning"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: `为您搜索到${res.data.data.total}条信息`,
              type: "success"
            });
          }
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.drugId = 0;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
            }
          });
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
    deleteDrug: async function(id) {
      let url = this.api.deldrug;
      var data = {
        drugid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteDictionarySuccess,
              type: "success"
            });
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
        this.$alert(this.message.pleaseChoiceMedicineWarn, "", {
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
              let id = id_arr[k].drugid;
              data.push(id);
            }
            this.deleteDrug(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addDrugTrue");
      if (scope != 0) {
        this.drugId = scope.drugid;
      } else {
        this.drugId = 0;
      }
    },
    clean() {
      this.drugId = 0;
    },
    fetchDrugType: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.BEADHOUSE_DRUG_TYPE,
          this.data.BEADHOUSE_DRUG_FORM,
          this.data.BEADHOUSE_DRUG_MINIMUM_SPECIFICATION,
          this.data.Drug_Attribute
        ]
      };
      const res = await this.$http.post(url, data);
      this.drugType = res.data.data[this.data.BEADHOUSE_DRUG_TYPE];
      this.drugForm = res.data.data[this.data.BEADHOUSE_DRUG_FORM];
      this.drugSpecifical =
        res.data.data[this.data.BEADHOUSE_DRUG_MINIMUM_SPECIFICATION];
      this.drugAttribute =
        res.data.data[this.data.Drug_Attribute];
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