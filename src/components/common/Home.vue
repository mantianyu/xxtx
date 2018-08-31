<template>
<el-container style="height: 100%;">
  <el-header style="height: 90px;">
    <v-head :updateLog="updateLog" :navs="navs"></v-head>
  </el-header>
  <el-container style="height: 100%;">
    <el-aside v-if="!leftShow" style="height: 100%;width: 225px;background-color: #fff;">
        <el-container style="height: 100%;">
            <el-header class="sidelogo">
                <img style="width: 22px;" :src="navPic"/>
                <span class="logo_tit" style="font-size: 14px;margin-left: 20px;">{{ navName }}</span>
            </el-header>
            <el-main style="padding: 0;position: relative;">
                <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;">
                    <v-sidebar v-if="!leftShow" :leftShow="leftShow" :sideData="sideData"></v-sidebar>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-aside>
    <el-container style="height: 100%;">
        <el-main class="fatherMain" style="background:#f1f1f1;padding: 14px;height: 100%;overflow: hidden;position: relative;">
            <router-view></router-view>
            <v-update :updateData="updateData"></v-update>
        </el-main>
        <el-footer style="height: 50px;color: #999999;font-size: 12px;text-align: center;line-height: 50px;position: relative;">
            ©2017 青岛孝心天下网络科技有限公司版权所有 鲁ICP备18000386号-1
            <p style="position: absolute;bottom: 0;right: 200px;">版本号：{{ version }}</p>
            <p style="position: absolute;bottom: 0;right: 40px;">服务热线：400-0019-521</p>
        </el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './sideBars.vue';
import vUpdate from './update.vue';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			editableTabs: [],
			updateData: [],
			updateLog: '',
			version: '',
			navs: [],
			sideData: [],
			navName: '',
			navPic: '',
			leftShow: true,
		};
	},
	components: {
		vHead,
		vSidebar,
		vUpdate,
	},
	watch: {
		navNum() {
			this.getTitle();
		},
		$route() {
			let path = this.$route.path.split('/');
			let navPath = `/${path[1]}`;
			for (let i = 0; i < this.navs.length; i++) {
				if (navPath === this.navs[i].url) {
					this.$store.dispatch('navNum', this.navs[i].id);
					break;
				}
			}
			if (navPath === '/home' || navPath === '/map') {
				this.leftShow = true;
			} else {
				this.leftShow = false;
			}
		},
	},
	mounted() {
		this.fetchUpdate();
		this.fetchList();
		let path = this.$route.path.split('/');
		let navPath = `/${path[1]}`;
		if (navPath === '/home' || navPath === '/map') {
			this.leftShow = true;
		} else {
			this.leftShow = false;
		}
	},
	methods: {
		getTitle() {
			for (let i = 0; i < this.navs.length; i++) {
				if (this.navNum === this.navs[i].id) {
					this.navName = this.navs[i].title;
					this.navPic = this.navs[i].src;
					break;
				}
			}
		},
		fetchUpdate: async function() {
			let url = this.api.versionlogs;
			let data = {};
			const res = await this.$http.post(url, data);
			if (res.data.data.data != 0) {
				this.updateData = res.data.data.data;
				this.updateLog = `更新内容：${res.data.data.data[0].title}`;
				this.version = res.data.data.data[0].version;
			}
		},
		fetchList: async function() {
			let url = this.api.penulist;
			var data = {};
			const res = await this.$http.post(url, data);
			this.navs = res.data.data.top;
			this.sideData = res.data.data.menu;
			this.$store.dispatch('sideBarSave', res.data.data.menu);
			this.$nextTick(() => {
				this.getTitle();
				this.highLight();
			});
		},
		highLight() {
			let path = this.$route.path.split('/');
			let navPath = `/${path[1]}`;
			for (let i = 0; i < this.navs.length; i++) {
				if (navPath === this.navs[i].url) {
					this.$store.dispatch('navNum', this.navs[i].id);
					break;
				}
			}
		},
	},
	computed: mapState(['navNum']),
};
</script>
<style scoped>
.sidelogo {
	height: 60px;
	background-color: #4c5671;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
