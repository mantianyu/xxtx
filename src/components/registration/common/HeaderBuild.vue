<template>
	<div class="build" @click="noneStyle">
		<div class="builds" v-for="(bList,$index) in bLists" :key="$index" style="position: relative">
			<div :class="[{'buildname':true}, {'buildnamehover':bList.click}, $index == bnum ? 'buildnamehover' : '']" @click.stop="selectStyle(bList,$index)">
				{{ bList.buildingname }}
				<div class="triangle_border_down"></div>
			</div>
			<ul :class="{'buildFloor': true, 'buildFloorShow':bList.floorShow}">
				<li v-for="(floor,index) in bList.floor" :key="index" @click="changeFloor(bList.buildingid,floor.floorid,$index,index)" :class="[$index == bnum ? index == fnum ? 'lihover' : '' : '']">
			    	{{(index+1)+floorUnit}}
			    </li>
			</ul>
		</div>
	</div>
</template>

<script>
import localEvent from '@/utils/local';
import Vue from 'vue';

export default {
	props: ['hbuildnone', 'buildsList'],
	data() {
		return {
			floorUnit: this.message.floor,
			bLists: [],
			bnum: 0,
			fnum: 0,
		};
	},
	watch: {
		hbuildnone() {
			this.bLists.forEach(function(bList) {
				Vue.set(bList, 'click', false);
				Vue.set(bList, 'floorShow', false);
			});
		},
		buildsList() {
			this.bLists = this.buildsList;
		},
	},
	mounted() {},
	methods: {
		changeFloor(bid, fid, bnum, fnum) {
			this.bnum = bnum;
			this.fnum = fnum;
			this.$parent.$parent.$parent.$parent.getbfid(bid, fid);
		},
		selectStyle(nav, index) {
			this.bLists.forEach(function(bList) {
				Vue.set(bList, 'click', false);
				Vue.set(bList, 'floorShow', false);
			});
			Vue.set(nav, 'click', true);
			Vue.set(nav, 'floorShow', true);
		},
		noneStyle() {
			this.bLists.forEach(function(bList) {
				Vue.set(bList, 'floorShow', false);
			});
		},
	},
};
</script>

<style scoped>
.build {
	width: 80%;
	display: flex;
	align-items: center;
	/* justify-content: flex-end;
		flex-wrap: wrap;
		position: relative;
		top: -72px;
		left: 19%; */
}
.builds {
	width: 100px;
	height: 33px;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 20px;
}
.buildname {
	width: 100%;
	height: 100%;
	font-size: 14px;
	position: absolute;
	top: 0;
	left: 0;
	text-align: center;
	line-height: 33px;
	color: #000;
	border-radius: 5px;
	background-color: #f3f3f3;
	cursor: pointer;
}
.buildnamehover {
	background-color: #616c88;
	color: #fff;
}
.buildFloor {
	width: 100%;
	display: none;
	position: absolute;
	top: 33px;
	left: 0;
	border: solid 1px #e4e4e4;
	margin-top: 5px;
	border-radius: 5px;
	z-index: 100;
}
.buildFloorShow {
	display: block;
}
.buildFloor li {
	width: 100%;
	height: 33px;
	line-height: 33px;
	color: #000;
	font-size: 14px;
	background-color: #f3f3f3;
	text-align: center;
	cursor: pointer;
}
.buildFloor li:hover {
	width: 100%;
	height: 33px;
	line-height: 33px;
	color: #fff;
	font-size: 14px;
	background-color: #616c88;
}
.buildFloor .lihover {
	width: 100%;
	height: 33px;
	line-height: 33px;
	color: #fff;
	font-size: 14px;
	background-color: #616c88;
}
.triangle_border_down {
	width: 0;
	height: 0;
	border-width: 10px 6px 0;
	border-style: solid;
	border-color: #999 transparent transparent; /*灰 透明 透明 */
	position: absolute;
	right: 6px;
	top: 12px;
}
</style>