<template>
  <el-menu v-if="!leftShow" class="el-menu-vertical-demo" router unique-opened :default-active="activeIndex" text-color="#666666" active-text-color="#ff8777">
    <el-menu-item-group v-for="(main, key) in sideBar" :key="key">
      <el-menu-item v-if="main.child.length === 0" :index="main.url ? main.url : '1-'+key">
        <div class="itemDiv" style="font-size: 14px;">
          {{ main.title }}
        </div>
      </el-menu-item>
      <el-submenu v-if="main.child.length !== 0" :index="main.url ? main.url : '1-'+key">
        <template slot="title">
          <div class="itemDiv">
            {{ main.title }}
          </div>
        </template>
        <el-menu-item v-for="(mainInfo, key, index) in main.child" :index="mainInfo.url ? mainInfo.url : '2-' + index" :key="key">
          <div class="itemDiv">
            {{ mainInfo.title }}
           </div>
        </el-menu-item>
      </el-submenu>
    </el-menu-item-group>
  </el-menu>
</template>

<script>
import { mapState } from 'vuex';

export default {
	props: ['sideData', 'leftShow'],
	data() {
		return {
			activeIndex: '',
			sideBar: [],
		};
	},
	created() {
		let path = this.$route.path.split('/');
		this.activeIndex = '/' + path[1] + '/' + path[2];
	},
	watch: {
		navNum() {
			if (this.navNum !== 1) {
				this.sideBar = this.sideData[this.navNum].child;
			} else {
				this.sideBar = [];
			}
		},
		$route() {
			let path = this.$route.path.split('/');
			this.activeIndex = '/' + path[1] + '/' + path[2];
		},
	},
	mounted() {
		if (this.navNum !== 1) {
			this.sideBar = this.sideData[this.navNum].child;
		} else {
			this.sideBar = [];
		}
		let path = this.$route.path.split('/');
		this.activeIndex = '/' + path[1] + '/' + path[2];
	},
	methods: {},
	computed: mapState(['navNum']),
};
</script>

<style scoped>
.el-menu {
	border: 0;
	height: 100%;
}
.el-menu-item .itemDiv {
	text-align: center;
	font-size: 12px;
}
.el-menu-item:hover {
	background-color: #f5f7fa;
}
.el-menu-item .itemDiv:hover {
	color: rgb(255, 135, 119) !important;
	border-radius: 6px;
	background-color: #dbe4f0;
}
.el-menu-item.is-active {
	background-color: #f5f7fa;
}
.el-submenu__title .itemDiv {
	font-size: 14px;
	text-align: center;
}
.is-opened {
	background-color: #f5f7fa !important;
}
.is-opened .el-submenu__title .itemDiv {
	color: #ff8777 !important;
}
</style>
