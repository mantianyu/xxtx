<template>
    <el-scrollbar class="scrollbar" style="height: 100%">
      <div class="system">
        <h6 class="main_Top_tit">系统管理快捷方式</h6>       
        <ul class="shortcut">
            <li v-for="(data, key) in sideArr" :key="key">
                <router-link :to="{path: data.url}">
                    <img :src="data.src">
                    <p>{{ data.title }}</p>
                </router-link>
            </li>
            <!-- <li>
                <router-link :to="{path: '/xtgl/sjzd'}">
                    <img src="../../../static/img/system2.png">
                    <p>数据字典</p>
                </router-link>
            </li>
            <li>
                <router-link :to="{path: '/xtgl/manager'}">
                    <img src="../../../static/img/system3.png">
                    <p>角色权限</p>
                </router-link> 
            </li>
            <li>
                <router-link :to="{path: '/xtgl/system'}">
                    <img src="../../../static/img/system4.png">
                    <p>操作日志</p>
                </router-link>      
            </li> -->
            <!-- <li>
                <img src="../../../static/img/system5.png">
                <p>系统通知</p>
            </li>
            <li>
                <img src="../../../static/img/system6.png">
                <p>硬件设置</p>
            </li>
            <li>
                <img src="../../../static/img/system7.png">
                <p>系统手册</p>
            </li> -->
        </ul>
      </div>
	  
    </el-scrollbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			sideArr: [],
		};
	},
	watch: {
		sideData() {
			if (this.sideData[99]) {
				if (this.sideData[99].child) {
					this.sideArr = [];
					let data = this.sideData[99].child;
					for (let i = 0; i < data.length; i++) {
						if (data[i].title === '数据字典') {
							this.sideArr.push(data[i]);
						}
						if (data[i].title === '操作日志') {
							this.sideArr.push(data[i]);
						}
						if (data[i].child.length !== 0) {
							if (data[i].child[0].title === '员工信息') {
								this.sideArr.push(data[i].child[0]);
							}
							if (data[i].child[0].title === '用户管理') {
								this.sideArr.push(data[i].child[0]);
							}
						}
					}
				}
			}
		},
	},
	mounted() {
		if (this.sideData[99]) {
			if (this.sideData[99].child) {
				this.sideArr = [];
				let data = this.sideData[99].child;
				for (let i = 0; i < data.length; i++) {
					if (data[i].title === '数据字典') {
						this.sideArr.push(data[i]);
					}
					if (data[i].title === '操作日志') {
						this.sideArr.push(data[i]);
					}
					if (data[i].child.length !== 0) {
						if (data[i].child[0].title === '员工信息') {
							this.sideArr.push(data[i].child[0]);
						}
						if (data[i].child[0].title === '用户管理') {
							this.sideArr.push(data[i].child[0]);
						}
					}
				}
			}
		}
	},
	methods: {},
	computed: mapState(['sideData']),
};
</script>

<style scoped>
.main_Top_tit {
	height: 15px;
	font-size: 16px;
	line-height: 16px;
	margin-left: 1%;
	color: #666666;
	padding-left: 20px;
	margin-top: 20px;
	border-left: 4px solid #f56c6c;
}
.system {
	background-color: #fff;
	height: 700px;
	width: 97%;
	float: left;
	margin: 20px;
}
.shortcut {
	margin: 50px 0 0 30px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}
.shortcut li {
	float: left;
	width: 140px;
	height: 140px;
	margin: 0 30px 70px 0;
}
.shortcut img {
	margin-left: 11px;
}
.shortcut p {
	font-size: 12px;
	color: #666;
	text-align: center;
}
</style>
