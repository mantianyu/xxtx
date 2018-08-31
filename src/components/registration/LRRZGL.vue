<template>
  <el-container style="height: 100%;background: #ffffff;" @click="hbuild">
    <el-header style="min-height: 60px;height: auto;border-bottom: 1px solid #ddd; " @click="hbuild">
		<div class="top-tit">
	        <h5>老人视图</h5>
	    </div>
    </el-header>
    <el-main style="position: relative;overflow: hidden;" @click="hbuild">
  		<el-scrollbar style="width: 100%;height: 100%;overflow-x: hidden;overflow-y: auto; position: absolute;">
			<div class="typelist" style="overflow: hidden;margin-bottom: 20px">
				<span>入住类型：</span>
				<div v-bind:class="['status1', bed_status === 1 ? 'clickBG' : '']" @click="ruzhu(1)">入住</div>
				<div v-bind:class="['status2', bed_status === 2 ? 'clickBG' : '']" @click="ruzhu(2)">已预约</div>
				<div v-bind:class="['status3', bed_status === 3 ? 'clickBG' : '']" @click="ruzhu(3)">待退房</div>
				<div v-bind:class="['status4', bed_status === 4 ? 'clickBG' : '']" @click="ruzhu(4)">待清理</div>
				<div v-bind:class="['status5', bed_status === 5 ? 'clickBG' : '']" @click="ruzhu(5)">占用</div>
				<div v-bind:class="['status6', bed_status === 6 ? 'clickBG' : '']" @click="ruzhu(6)">亲属使用</div>
				<div v-bind:class="['status7', bed_status === 7 ? 'clickBG' : '']" @click="ruzhu(7)">维修中</div>
				<div v-bind:class="['status8', bed_status === 8 ? 'clickBG' : '']" @click="ruzhu(8)">未缴费</div>
				<div v-bind:class="['status0', bed_status === 0 ? 'clickBG' : '']" @click="ruzhu(0)">空闲</div>
			</div>
			<div>
				<div class="nurselist" style="overflow: hidden;float: left">
					<span>护理类型：</span>
					<div v-for="(care, key) in selfCare" v-bind:class="[self_care === key ? 'clickBG' : '']" :key="key" @click="huli(key)">{{ care }}</div>
				</div>
				<div class="sexlist" style="overflow: hidden;float: left; margin-left: 40px">
					<span>老人性别：</span>
					<div v-bind:class="[elder_gender === 1 ? 'clickBG' : '']" @click="xingbie(1)">男</div>
					<div v-bind:class="[elder_gender === 2 ? 'clickBG' : '']" @click="xingbie(2)">女</div>
				</div>
			</div>
			<div class="buildList" style="display: flex;align-items: center;margin-top: 60px;">
				<span>选择楼层：</span>
				<v-hbuild :hbuildnone="hbuildnone" :buildsList="buildsList"></v-hbuild>
			</div>
			<div style="padding: 20px;color: #999;font-size: 12px;margin-top: 20px;" @click="hbuild">
				共{{ floornum ? floornum : '0' }}层，当前第{{ current ? current : '0' }}层，{{ roomnum ? roomnum : '0' }}个房间，{{ bednum ? bednum : '0' }}个床位,{{ checkinnum ? checkinnum : '0' }}，{{ freebednum ? freebednum : '0' }}个空闲床位{{ mannum ? '，男' + mannum : '' }}{{ womannum ? '，女' + womannum : '' }}。
			</div>
			<v-floor :roomsList="roomsList"></v-floor>
      	</el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import vHbuild from './common/HeaderBuild.vue';
import vFloor from './common/floorInfo.vue';

export default {
	data() {
		return {
			hbuildnone: false,
			buildsList: [],
			roomsList: [],
			floornum: 0,
			roomnum: 0,
			bednum: 0,
			checkinnum: 0,
			freebednum: 0,
			mannum: 0,
			womannum: 0,
			current: 0,
			bed_status: '',
			self_care: '',
			elder_gender: '',
			bid: 0,
			fid: 0,
			selfCare: [],
		};
	},
	components: {
		vHbuild,
		vFloor,
	},
	watch: {
		bid() {
			this.fetchList();
		},
		fid() {
			this.fetchList();
		},
		bed_status() {
			this.fetchList();
		},
		self_care() {
			this.fetchList();
		},
		elder_gender() {
			this.fetchList();
		},
	},
	mounted() {
		this.fetchList();
		this.fetchData();
	},
	methods: {
		hbuild() {
			this.hbuildnone = !this.hbuildnone;
		},
		ruzhu(id) {
			if (this.bed_status !== id) {
				this.bed_status = id;
			} else {
				this.bed_status = '';
			}
		},
		huli(id) {
			if (this.self_care !== id) {
				this.self_care = id;
			} else {
				this.self_care = '';
			}
		},
		xingbie(id) {
			if (this.elder_gender !== id) {
				this.elder_gender = id;
			} else {
				this.elder_gender = '';
			}
		},
		getbfid(bid, fid) {
			this.bid = bid;
			this.fid = fid;
		},
		fetchList: async function() {
			let url = this.api.manageindex;
			if (this.fid != 0 && this.bid != 0) {
				var data = {
					buildingid: this.bid,
					floorid: this.fid,
					bed_status: this.bed_status,
					self_care: this.self_care,
					elder_gender: this.elder_gender,
				};
			} else {
				var data = {
					bed_status: this.bed_status,
					self_care: this.self_care,
					elder_gender: this.elder_gender,
				};
			}
			const res = await this.$http.post(url, data);
			if (res.data.data.length != 0) {
				this.buildsList = res.data.data.building.building;
				this.roomsList = res.data.data.room.room;
				this.floornum = res.data.data.building.floornum;
				this.roomnum = res.data.data.floor.roomnum;
				this.bednum = res.data.data.floor.bednum;
				this.checkinnum = res.data.data.floor.checkinnum;
				this.freebednum = res.data.data.floor.freebednum;
				this.mannum = res.data.data.floor.mannum;
				this.womannum = res.data.data.floor.womannum;
				this.current = res.data.data.current;
			}
		},
		fetchData: async function() {
			let url = this.api.data;
			let data = {
				group: this.data.HEALTH_SELF_CARE_ABILITY,
			};
			const res = await this.$http.post(url, data);
			this.selfCare = res.data.data;
		},
	},
};
</script>

<style scoped>
.LRRZGLBG {
	background-color: #fff;
	min-height: 100%;
	position: relative;
}
.top-tit {
	padding: 20px;
	overflow: hidden;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.top-tit h5 {
	color: #ff8777;
	font-weight: normal;
	float: left;
	line-height: 30px;
	margin: 0;
	font-size: 18px;
}
.line {
	width: 100%;
	height: 1px;
	background-color: #ddd;
}
.typelist span,
.nurselist span,
.sexlist span {
	float: left;
	font-size: 14px;
	color: #333;
	margin-right: 12px;
	line-height: 30px;
}
.buildList span {
	float: left;
	font-size: 14px;
	color: #333;
	margin-right: 12px;
	line-height: 30px;
	margin-top: 20px;
}
.typelist div {
	float: left;
	width: 80px;
	height: 30px;
	border-radius: 4px;
	margin-right: 10px;
	text-align: center;
	color: #fff;
	font-size: 14px;
	line-height: 30px;
	cursor: pointer;
}
.nurselist div,
.sexlist div {
	float: left;
	width: 80px;
	height: 30px;
	border-radius: 4px;
	margin-right: 10px;
	text-align: center;
	color: #666;
	font-size: 14px;
	line-height: 30px;
	cursor: pointer;
	border: 1px solid #ddd;
	border-radius: 4px;
	background: #fff;
}
.typelist div:hover {
	background: #dbe4f0;
}
.nurselist div:hover {
	background: #dbe4f0;
}
.sexlist div:hover {
	background: #dbe4f0;
}
.clickBG {
	background: #dbe4f0 !important;
}
.status1 {
	background: #3ad0bf;
}
.status2 {
	background: #58a5e1;
}
.status3 {
	background: #fe7cbf;
}
.status4 {
	background: #96a3db;
}
.status5 {
	background: #616c88;
}
.status6 {
	background: #a74072;
}
.status7 {
	background: #f26464;
}
.status8 {
	background: #ddb451;
}
.status0 {
	background: #cccccc;
}
</style>
