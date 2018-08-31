<template>
    <div class="header">
        <div class="headerLogo">
            <img src="/static/img/logo.png" style="width: 62px;height: 45px;">
            <span class="logo_tit" style="float: none;font-size: 16px;margin-top: 4px;color: #fff;">家园智能养老管理系统</span>
        </div>
        <ul class="headerNav">
            <li v-for="(nav, index, key) in navs" :key="key" @click="changeNav(nav.id, index)" v-bind:class="[navNum === nav.id ? 'liActive' : '']">
                <img :src="nav.src"/>
                <span>{{ nav.title }}</span>
            </li>
        </ul>
            <!-- <p style="display: flex;align-items: center;justify-content: center;flex-direction: column;cursor: pointer;">
                <img src="/static/img/Message.png"/>
                <span id="UserName" class="UserName">消息</span>
            </p> -->
            <p style="display: flex;align-items: center;justify-content: center;flex-direction: column;cursor: pointer;position: absolute;right: 110px;top: 26px;" @click="showMap">
                <img src="/static/img/2.png"/>
                <span id="WebMap" class="UserName">网站地图</span>
            </p>
            <!-- <p style="display: flex;align-items: center;justify-content: center;flex-direction: column;cursor: pointer;">
                <img src="/static/img/？.png"/>
                <span id="UserName" class="UserName">帮助</span>
            </p> -->
        <el-dropdown class="UserInformation" @command="handleCommand" trigger="click">
            <p style="display: flex;align-items: center;justify-content: center;flex-direction: column;cursor: pointer;">
                <img src="/static/img/index_people.png"/>
                <span id="UserName" class="UserName">{{ name }}</span>
            </p>
            <el-dropdown-menu slot="dropdown" style="background-color: #616c88;width: 120px;padding: 0;border: 0;margin-top: 26px;">
                <el-dropdown-item command="logOut">
                    <img src="/static/img/index_close.png" style="width: 20px;">
                    <span style="font-size: 14px;margin-left: 8px;">退出</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
var setInter;
import localEvent from '@/utils/local';
import { mapState } from 'vuex';

export default {
	props: ['updateLog', 'navs'],
	data() {
		return {
			name: localEvent.StorageGetter('empName'),
			currentdate: '',
		};
	},
	mounted() {
		setInterval(() => {
			this.getNowFormatDate();
		}, 1000);
	},
	methods: {
		handleCommand(command) {
			if (command === 'logOut') {
				this.erpLogout();
			}
		},
		showMap() {
			this.$router.push({ path: '/map' });
		},
		changeNav(navId, index) {
			this.$store.dispatch('navNum', navId);
			switch (index) {
				case 0:
					this.$router.push({ path: '/home' });
					break;
				case 1:
					this.$router.push({ path: '/djgl' });
					break;
				case 2:
					this.$router.push({ path: '/fwgl' });
					break;
				case 3:
					this.$router.push({ path: '/rcsw' });
					break;
				case 4:
					this.$router.push({ path: '/hlgl' });
					break;
				case 5:
					this.$router.push({ path: '/fygl' });
					break;
				case 6:
					this.$router.push({ path: '/tjfx' });
					break;
				case 7:
					this.$router.push({ path: '/xtgl' });
					break;
			}
		},
		getNowFormatDate() {
			var date = new Date();
			var seperator1 = '-';
			var seperator2 = ':';
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			if (month >= 1 && month <= 9) {
				month = '0' + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate;
			}
			if (hour >= 0 && hour <= 9) {
				hour = '0' + hour;
			}
			if (minute >= 0 && minute <= 9) {
				minute = '0' + minute;
			}
			if (second >= 0 && second <= 9) {
				second = '0' + second;
			}
			this.currentdate =
				date.getFullYear() +
				seperator1 +
				month +
				seperator1 +
				strDate +
				' ' +
				hour +
				seperator2 +
				minute +
				seperator2 +
				second;
		},
		erpLogout: async function() {
			let url = this.api.logout;
			const data = {};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
                    this.$http.requestor.setToken(null);
					this.$router.push('/');
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: '确定',
						callback: action => {},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: '确定',
					callback: action => {},
				});
			}
		},
		showUpdate() {
			this.$store.dispatch('updateTrue');
		},
	},
	computed: mapState(['navNum']),
};
</script>
<style scoped>
.header {
	display: flex;
	align-items: center;
	height: 90px;
	background-color: #616c88;
	position: relative;
}

.headerLogo {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 250px;
}

.headerNav {
	height: 90px;
}

.headerNav li {
	height: 90px;
	width: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	float: left;
	cursor: pointer;
}

.headerNav .liActive {
	background-color: #4c5671;
}

.headerNav li:hover {
	background-color: #4c5671;
}

.headerNav li span {
	color: #fff;
	font-size: 14px;
	margin-top: 7px;
}

.UserInformation {
	position: absolute;
	right: 10px;
	top: 26px;
}
.UserInformation p {
	float: left;
	display: block;
	margin-right: 20px;
}
.UserName {
	text-align: center;
	font-size: 12px;
	line-height: 32px;
	color: #fff;
}
.el-dropdown-menu__item {
	background-color: #616c88;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 4px;
}
.el-dropdown-menu__item:hover {
	background-color: #616c88 !important;
	color: #fff !important;
}
</style>