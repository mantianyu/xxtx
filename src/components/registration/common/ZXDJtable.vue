<template>
    <div>
        <el-table
            v-loading="loading"
            :data="tableDataZX"
            style="width: 100%"
            stripe
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="咨询人姓名">
            </el-table-column>
            <el-table-column
              prop="time"
              label="日期">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话">
            </el-table-column>
            <el-table-column
              prop="elder_name"
              label="老人姓名">
            </el-table-column>
            <el-table-column
              prop="id_number"
              label="身份证号"
              width="170">
            </el-table-column>
            <el-table-column
              prop="method"
              label="咨询方式">
              <template slot-scope="scope">
                  <p>{{method[scope.row.method]}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="channel"
              label="媒体渠道">
              <template slot-scope="scope">
                  <p>{{channel[scope.row.channel]}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
              <template slot-scope="scope">
                  <p>{{scope.row.status == 0 ? '咨询' : scope.row.status == 1 ? '已预约' : '已入住'}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="employee_name"
              label="登记人">
            </el-table-column>
            <el-table-column
              prop="active"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showjdzxManageAdd(scope.row,1)">
                  修改
                </el-button>
                <el-button type="text" size="small" @click="showjdzxManageTrue(scope.row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
        </el-table>
        <div class="fenye">
            <div class="caozuo">
              <el-button type="danger" @click="showjdzxManageAdd(0,0)">新增</el-button>
              <el-button type="success" @click="delold">删除</el-button>
            </div>
            <div style="display: flex;margin-right: 20px;float: right;">
                <el-button type="primary" size="small" @click="JdzxManageList(1)">首页</el-button>
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        layout="prev, pager, next"
                        :total="total">
                </el-pagination>
                <el-button type="primary" size="small" @click="JdzxManageList(last_page)">末页</el-button>
            </div>
        </div>
        <v-medit :elderid="elderid" :elderList="elderList" :self_care="self_care" :relation="relation" :method="method" :channel="channel" :type="type"></v-medit>
    </div>
</template>

<script>
import vMedit from './JdzxManageEdit.vue';

export default {
	props: ['searchData'],
	data() {
		return {
			tableDataZX: [],
			multipleSelection: [],
			elderid: 0,
			relation: [],
			self_care: [],
			method: [],
			channel: [],
			type: [],
			total: 0,
			last_page: 0,
			loading: false,
			elderList: [],
			currentPage: 1,
		};
	},
	components: {
		vMedit,
	},
	watch: {
		searchData() {
			this.JdzxManageList(1);
		},
	},
	mounted() {
		this.JdzxManageList(1);
		this.fetchRelation();
		this.fetchElders();
	},
	methods: {
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleCurrentChange(val) {
			this.JdzxManageList(val);
		},
		JdzxManageList: async function(val) {
			this.loading = true;
			let url = this.api.jdzxdjlist + '?page=' + val;
			let data = this.searchData;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (res.data.data.data.length == 0) {
						this.$notify({
							title: this.message.hint,
							message: this.message.informationNoExist,
							type: 'warning',
						});
					} else {
						this.$notify({
							title: this.message.success,
							message: `为您搜索到${res.data.data.total}条信息`,
							type: 'success',
						});
					}
					this.tableDataZX = [];
					this.tableDataZX = res.data.data.data;
					this.total = res.data.data.total;
					this.total = res.data.data.total;
					this.last_page = res.data.data.last_page;
					this.elderid = 0;
					this.$nextTick(function() {
						this.loading = false;
						this.currentPage = val;
					});
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {},
					});
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
		showjdzxManageAdd(scope, jdzxadd) {
			this.$store.dispatch('JdzxManageEditOpen');
			this.$store.dispatch('JdzxManagechangeClose');
			if (scope == 0) {
				this.elderid = 0;
			} else {
				this.elderid = scope.id;
			}
		},
		showjdzxManageTrue(scope) {
			this.$store.dispatch('JdzxManageEditOpen');
			this.$store.dispatch('JdzxManagechangeOpen');
			this.elderid = scope.id;
		},
		ManageDel: async function(elderid) {
			let url = this.api.delzxdjlist;
			var data = {
				id: elderid,
			};
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				this.$notify({
					title: this.message.success,
					message: this.message.deleteConsultSuccess,
					type: 'success',
				});
				this.JdzxManageList();
			} else {
				this.$alert(res.data.data, '', {
					confirmButtonText: this.message.confirm,
					center: true,
					callback: action => {},
				});
			}
		},
		delold() {
			if (this.multipleSelection.length == 0) {
				this.$alert(this.message.pleaseChoiceRecordToCancel, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {},
				});
				return;
			}
			this.$confirm(this.message.deleteConfirm, '', {
				confirmButtonText: this.message.confirm,
				cancelButtonText: this.message.cancel,
				center: true,
			})
				.then(() => {
					let id_arrdel = this.multipleSelection;
					let delid = '';
					for (let k = 0; k < id_arrdel.length; k++) {
						delid += id_arrdel[k].id + ',';
					}
					if (delid) {
						delid = delid.substring(0, delid.length - 1);
					}
					if (delid) {
						this.ManageDel(delid);
					} else {
						this.$alert(this.message.pleaseChoiceDeleteElder, '', {
							confirmButtonText: this.message.confirm,
							center: true,
							callback: action => {},
						});
					}
				})
				.catch(() => {});
		},
		fetchRelation: async function() {
			let url = this.api.data;
			var data = {
				group: [
					this.data.BEADHOUSE_FAMILY_ELATION,
					this.data.HEALTH_SELF_CARE_ABILITY,
					this.data.BEADHOUSE_CONSULTING_METHOD,
					this.data.BEADHOUSE_MEDIA_CHANNEL,
					this.data.BEADHOUSE_CONSULTING_TYPE,
				],
			};
			const res = await this.$http.post(url, data);
			this.relation = res.data.data[this.data.BEADHOUSE_FAMILY_ELATION];
			this.self_care = res.data.data[this.data.HEALTH_SELF_CARE_ABILITY];
			this.method = res.data.data[this.data.BEADHOUSE_CONSULTING_METHOD];
			this.channel = res.data.data[this.data.BEADHOUSE_MEDIA_CHANNEL];
			this.type = res.data.data[this.data.BEADHOUSE_CONSULTING_TYPE];
		},
		fetchElders: async function() {
			let url = this.api.searchelders;
			var data = {
				type: 4,
			};
			const res = await this.$http.post(url, data);
			this.elderList = res.data.data;
		},
		clean() {
			this.elderid = 0;
		},
	},
};
</script>

<style scoped>
.fenye {
	margin: 20px 0 10px;
	margin-bottom: 0;
	overflow: hidden;
	padding: 0 20px;
	height: 50px;
}
.caozuo {
	float: left;
	overflow: hidden;
}
.caozuo a {
	display: block;
	float: left;
	min-width: 90px;
	text-align: center;
	padding: 0 10px;
	line-height: 40px;
	background: #eee;
	border-radius: 4px;
	margin-right: 20px;
	color: #000;
	font-size: 12px;
}
.caozuo a:hover {
	background: #ff8777;
	color: white;
}
</style>
