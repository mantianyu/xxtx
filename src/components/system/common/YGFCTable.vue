<template>
    <div>
        <el-table v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
            <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
            <el-table-column prop="id" label="员工ID">
            </el-table-column>
            <el-table-column prop="name" label="员工姓名">
            </el-table-column>
            <el-table-column prop="position" label="员工职位">
				<template slot-scope="scope">
					<p>{{ scope.row.position === 0 ? '护工' :scope.row.position === 1 ? '院长' : ''  }}</p>
				</template>
            </el-table-column>
            <el-table-column prop="brief_intro" label="员工简介" show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column prop="status" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <p>{{ scope.row.status === 0 ? '禁用' : '正常'  }}</p>
                </template>
            </el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showStaff(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
                <el-button type="success" @click="showStaff(0)">新增</el-button>
                <el-button type="danger" @click="deleteStaff">删除</el-button>
            <!-- <el-button type="danger" @click="exportList">导出</el-button> -->
          </div>
          <div style="display: flex;margin-right: 20px;">
            <el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" background layout="prev, pager, next" :total="total">
            </el-pagination>
            <el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
          </div>
        </div>
        <v-staff v-if="showAddStaff" :scope="scope" :empArr="empArr"></v-staff>
    </div>
</template>

<script>
import vStaff from './addStaff.vue';

export default {
	data() {
		return {
			tableData: [],
			multipleSelection: [],
			total: 0,
			last_page: 0,
			loading: false,
			currentPage: 1,
			showAddStaff: false,
			scope: 0,
			empArr: [],
		};
	},
	components: {
		vStaff,
	},
	mounted() {
		this.fetchList(1);
		this.fetchEmp();
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
			let url = this.api.nursingworker + '?page=' + val;
			var data = {};
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
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.loading = false;
					},
				});
			}
		},
		deleteStaff() {
			if (this.multipleSelection.length == 0) {
				this.$alert(this.message.pleaseChoiceDelete, '', {
					confirmButtonText: this.message.confirm,
					center: true,
					callback: action => {},
				});
			} else {
				this.$confirm(this.message.whetherDelete, '', {
					confirmButtonText: this.message.confirm,
					cancelButtonText: this.message.cancel,
					center: true,
				})
					.then(() => {
						var data = [];
						let id_arr = this.multipleSelection;
						for (let k = 0; k < id_arr.length; k++) {
							let id = id_arr[k].id;
							data.push(id);
						}
						this.deleteStaffList(data);
					})
					.catch(() => {});
			}
		},
		deleteStaffList: async function(id) {
			let url = this.api.delnursingworker;
			var data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
                    this.fetchList(1);
                    this.fetchEmp();
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						center: true,
						callback: action => {},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {},
				});
			}
		},
		showStaff(scope) {
			this.showAddStaff = true;
			if (scope != 0) {
				this.scope = scope;
			} else {
				this.scope = 0;
			}
		},
		fetchEmp: async function() {
			let url = this.api.getunuseduserlist;
			let data = {};
			const res = await this.$http.post(url, data);
			this.empArr = res.data.data;
		},
	},
};
</script>

<style scoped>
</style>
