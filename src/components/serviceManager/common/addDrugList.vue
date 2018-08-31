<template>
	<div class="addDrugList" v-show="addDrugList">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
						<h5>选择药品</h5>
						<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 87%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<div class="find">
							<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
								<el-form-item label="药品名称" prop="drugname" style="margin: 0;">
									<el-input type="text" v-model="ruleForm.drugname" style="width:100px" size="small" auto-complete="off"></el-input>
								</el-form-item>
								<el-form-item label="药品简码" prop="drugcode" style="margin: 0;">
									<el-input type="text" v-model="ruleForm.drugcode" style="width:100px" size="small" auto-complete="off"></el-input>
								</el-form-item>
								<div style="margin-left: 10px">
									<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
								</div>
							</el-form>
						</div>
						<el-table
							v-loading="loading"
									ref="multipleTable"
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
						</el-table>
						<div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
							<div>
								<el-button type="info" plain @click="postDrug">确定</el-button>
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
					</div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      ruleForm: {
        drugname: "",
        drugcode: ""
      },
      rules: {},
      tableData: [],
      multipleSelection: [],
      total: 0,
      last_page: 0,
      drugType: [],
      drugForm: [],
      drugSpecifical: [],
      loading: false,
      currentPage: 1,
      searchData: {},
      selectDrug: []
    };
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    postDrug() {
      this.$parent.getDrugList(this.selectDrug);
      this.hideEditFalse();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            drugname: this.ruleForm.drugname,
            drugcode: this.ruleForm.drugcode
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      for(let i = 0; i < val.length; i++){
        let flag = true;
        for(let k = 0; k < this.selectDrug.length; k++){
          if(val[i].drugid === this.selectDrug[k].drugid){
            flag = false;
            return;
          }
        }
        this.selectDrug.push(val[i]);
      }
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
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(() => {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
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
    hideEditFalse() {
      this.$store.dispatch("addDrugListFalse");
      this.$refs["ruleForm"].resetFields();
      this.toggleSelection();
      this.ruleForm.drugname = "";
      this.ruleForm.drugcode = "";
      this.selectDrug = [];
    },
    fetchDrugType: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.BEADHOUSE_DRUG_TYPE,
          this.data.BEADHOUSE_DRUG_FORM,
          this.data.BEADHOUSE_DRUG_MINIMUM_SPECIFICATION
        ]
      };
      const res = await this.$http.post(url, data);
      this.drugType = res.data.data[this.data.BEADHOUSE_DRUG_TYPE];
      this.drugForm = res.data.data[this.data.BEADHOUSE_DRUG_FORM];
      this.drugSpecifical = res.data.data[this.data.BEADHOUSE_DRUG_MINIMUM_SPECIFICATION];
    }
  },
  computed: mapState(["addDrugList"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 420px;
  margin: auto;
  z-index: 300;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -210px;
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
.addDrugList {
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
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>