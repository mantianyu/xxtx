<template>
    <el-container style="height: 100%;background: #ffffff;overflow-y: auto">
		<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
			<el-tabs type="border-card" style="width: 100%;box-shadow: 0 0 0 ;border: 0">
				<el-tab-pane label="基础信息"><v-basicInfo :detail="detail" v-loading="loading"></v-basicInfo></el-tab-pane>
				<el-tab-pane label="机构概述"><v-summarize :detail="detail" v-loading="loading"></v-summarize></el-tab-pane>
				<el-tab-pane label="机构设施"><v-facilities :detail="detail" v-loading="loading"></v-facilities></el-tab-pane>
				<el-tab-pane label="商家营销"><v-bussiness :detail="detail" v-loading="loading"></v-bussiness></el-tab-pane>
				<el-tab-pane label="养老公寓图片"><v-photo :detail="detail" v-loading="loading"></v-photo></el-tab-pane>
				<el-tab-pane label="入住须知"><v-notice :detail="detail" v-loading="loading"></v-notice></el-tab-pane>
				<el-tab-pane label="优化设置"><v-optimize :detail="detail" v-loading="loading"></v-optimize></el-tab-pane>
			</el-tabs>
		</el-scrollbar>
    </el-container>
</template>

<script>
import vBasicInfo from './common/basicInfo.vue';
import vSummarize from './common/summarize.vue';
import vBussiness from './common/bussiness.vue';
import vFacilities from './common/facilities.vue';
import vPhoto from './common/photo.vue';
import vNotice from './common/notice.vue';
import vOptimize from './common/optimize.vue';

export default {
	data() {
		return {
			detail: {},
			loading: false,
		};
	},
	components: {
		vBasicInfo,
		vSummarize,
		vBussiness,
		vFacilities,
		vPhoto,
		vNotice,
		vOptimize,
	},
	mounted() {
		this.fetchDetail();
	},
	methods: {
		fetchDetail: async function() {
			this.loading = true;
			let url = this.api.gethotelinfo;
			let data = {};
			const res = await this.$http.post(url, data);
			this.detail = res.data.data.info;
			this.loading = false;
		},
	},
};
</script>

<style scoped>
</style>

