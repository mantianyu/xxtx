<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>养老院公告</h5>
        </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
            <el-table 
                v-loading="loading"
                :data="tableData"
                stripe
                style="width: 99%">
                <el-table-column
                    prop="title"
                    label="标题">
                </el-table-column>
                <el-table-column
                    prop="send_time"
                    label="发布时间">
                </el-table-column>
                <el-table-column
                    prop="sender"
                    label="发布人">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteRow(scope.row)">移除</el-button>
                    <el-button type="text" size="small" @click="seeNotice(scope.row)">查看</el-button>
                </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div>
                    <el-button type="success" @click="showAdd(0)">新增公告</el-button>
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
    <v-notice v-show="isShow"></v-notice>
    <v-see v-if="seeContent" :detail="detail"></v-see>
    </el-container>
</template>

<script>
import vSee from './common/noticeDetail.vue';
import vNotice from './addNotice.vue';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			tableData: [],
			loading: false,
			isShow: false,
			currentPage: 1,
			total: 0,
			seeContent: false,
			detail: {},
		};
	},
	components: {
		vNotice,
		vSee,
	},
	mounted() {
		this.fetchList(1);
	},
	methods: {
		handleCurrentChange(val) {
			this.fetchList(val);
		},
		deleteRow(scope) {
			this.$confirm(this.message.whetherDelete, '', {
				confirmButtonText: this.message.confirm,
				cancelButtonText: this.message.cancel,
				center: true,
			})
				.then(() => {
					var data = scope.id;
					this.deletenotice(data);
				})
				.catch(() => {});
		},
		deletenotice: async function(id) {
			let url = this.api.deletenotice;
			var data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.fetchList();
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
		fetchList: async function(val) {
			this.loading = true;
			let url = this.api.noticelist + '?page=' + val;
			var data = this.searchData;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.tableData = [];
					this.tableData = res.data.data.data;
					this.total = res.data.data.total;
					this.last_page = res.data.data.last_page;
					this.id = 0;
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
		showAdd(scope) {
			this.isShow = true;
		},
		close() {
			this.isShow = false;
		},
		seeNotice(scope) {
			// console.log(scope)
			this.seeContent = true;
			this.detail = scope;
		},
	},
};
</script>

<style scoped>
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
</style>