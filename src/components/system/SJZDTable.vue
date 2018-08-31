<template>
	<div class="table">
		<el-table
      		v-loading="loading"
		    :data="tableData"
			empty-text="请从左侧选择分组进行管理"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55"
          :selectable="checkSelectable">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="名称">
		    </el-table-column>
		    <el-table-column
		      label="操作">
		        <template slot-scope="scope">
		          <el-button v-if="scope.row.is_readonly !== 1" type="text" size="small" @click="showAddSJZD(scope)">修改</el-button>
		        </template>
		    </el-table-column>
		</el-table>
	    <div v-if="$route.params.group != 0 && $route.params.group != 1 && $route.params.group != 2 && $route.params.group != 3 && $route.params.group != 4" style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;">
	      <el-button type="danger" @click="delMore">删除</el-button>
	      <el-button v-if="canAdd === 1" type="success" @click="showAddSJZD(0)">添加</el-button>
	    </div>
	    <v-addsjzd :name="name" :id="id"></v-addsjzd>
	</div>
</template>

<script>
import vAddsjzd from './addSJZD.vue';

export default {
	data() {
		return {
			tableData: [],
			name: '',
			id: 0,
			loading: false,
      multipleSelection: [],
      canAdd: 0
		};
	},
	components: {
		vAddsjzd,
	},
	mounted() {
    this.fetchList();
    this.canAdd = this.$route.query.canAdd;
	},
	watch: {
		'$route.params.group'() {
			this.fetchList();
		},
		'$route.query.canAdd'() {
			this.canAdd = this.$route.query.canAdd;
		},
	},
	methods: {
		checkSelectable(row, index) {
			return row.is_fixed !== 1;
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		fetchList: async function() {
			if (this.$route.params.group >= 5) {
				this.loading = true;
				let url = this.api.dictionaryList;
				var data = {
					group: this.$route.params.group,
				};
				try {
					const res = await this.$http.post(url, data);
					if (res.data.status_code == 200) {
						this.tableData = [];
						if (res.data.data) {
							this.tableData = res.data.data;
						}
						this.$nextTick(function() {
							this.loading = false;
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
					this.$alert(this.message.timeOut, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {},
					});
				}
			}
		},
		showAddSJZD(scope) {
			this.$store.dispatch('addSJZDTrue');
			if (scope == 0) {
				this.name = '';
				this.id = 0;
			} else {
				this.name = scope.row.name;
				this.id = scope.row.id;
			}
		},
		delete: async function(id) {
			let url = this.api.delete;
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
		delMore() {
			if (this.multipleSelection.length == 0) {
				this.$alert(this.message.pleaseChoiceDeleteData, '', {
					confirmButtonText: this.message.confirm,
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
						this.delete(data);
					})
					.catch(() => {});
			}
		},
		clean() {
			this.name = '';
			this.id = 0;
		},
	},
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
	background: #ff8777;
	border-color: #ff8777;
}
a {
	color: #606266;
}
</style>