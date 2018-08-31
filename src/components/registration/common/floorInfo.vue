<template>
	<div class="floorBG">
		<div class="floorRooms" v-for="(room,index) in roomsList" :key="index">
			<p class="floorRoom">房间号{{ room.roomname }}</p>
			<div style="display: flex;flex-wrap: wrap;justify-content: space-around;padding-left: 20px;padding-right: 20px;margin-top: 15px;">
				<div v-for="(bed,index) in room.bed" :class="[{'roomInfo':true}, 'emptyBG1']" :key="index">
					<div style="width: 100%;padding:3px 0;">
						<div style="width: 100px; height: 100px;margin: 20px">
							<img  v-if="bed.bedstatus != 0" :src="bed.elderphoto ? bed.elderphoto : '/static/img/elderly_bed.png'">
						</div>
						<div style="width: 56%;overflow: hidden;margin-left:3px;" class="elder_info">
							<p :class="[{'bad_num':true}]">{{ bed.bedname }}</p>
							<div style="float: left">
								<span v-if="bed.bedstatus != 0" class="elder_name">姓名：{{bed.eldername}}</span>
								<span v-if="bed.bedstatus != 0" class="elder_sex">性别：{{ bed.eldergender == 1 ? '男' : bed.eldergender == 2 ? '女' : ''}}</span>
							</div>
							<div style="float: right">
								<span v-if="bed.bedstatus != 0" class="elder_age">年龄：{{ bed.age }} 岁</span>
								<span v-if="bed.bedstatus != 0" class="elder_type">护理类型：{{ bed.self_care }}</span>
							</div>	
						</div>
					</div>
					<div style="display:flex;justify-content: center;">
						<div :class="['button' , bed.bedstatus == 1  ? 'bedstatus1': bed.bedstatus == 2 ? 'bedstatus2': bed.bedstatus == 3  ? 'bedstatus3' : bed.bedstatus == 4 ? 'bedstatus4' : bed.bedstatus == 5 ? 'bedstatus5' : bed.bedstatus == 7 ? 'bedstatus7' :  bed.bedstatus == 8 ? 'bedstatus8' : 'bedstatus0']">{{ bed.bedstatus == 0 ? '空闲' : bed.bedstatus == 1 ? '入住' : bed.bedstatus == 2  ? '已预订' : bed.bedstatus == 3 ? '待退房' : bed.bedstatus == 4 ? '待清理' : bed.bedstatus == 5 ? '占用' : bed.bedstatus == 6 ? '亲属使用' : bed.bedstatus == 7 ? '维修中' : '未缴费'}}</div>
						<div :class="['button', bed.if_out == true ? 'bedstatus8' : 'none']">{{ bed.if_out == true ? '外出' : ""}}</div>
						<div :class="['button', bed.if_arrearage == true ? 'bedstatus7' : 'none']">{{ bed.if_arrearage == true ? '欠费' : ""}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	export default{
		props:['roomsList'],
		data() {
	      	return {
	        	
	      	};
	    },
	    components:{
	      	
	    },
	    watch:{
	    	
	    },
	    mounted(){
	    	
	    },
	    methods: {
		    
	    },
	}
</script>

<style>
	.floorBG{
		padding: 20px;
		display: flex;
    	flex-wrap: wrap;
	}
	.floorRoom{
		font-size: 14px;
		color: #999;
	}
	.floorRooms{
		width: 100%;
		border-radius: 6px;
		background: #f8f8f8;
		margin-bottom: 20px;
		margin-right: 40px;
	}
	.floorRooms .floorRoom{
		font-size: 14px;
		color: #666666;
		font-weight: normal;
		margin-left: 20px;
		margin-top: 10px;
	}
	.floorRooms .roomInfo{
		width: 390px;
		height: 200px;
		margin-bottom: 20px;
		position: relative;
		border-radius: 4px;
		border: 1px solid #ddd;
		background: #fff;
	}
	.floorRooms .roomInfo div{
		float: left;
	}
	.floorRooms .roomInfo .bad_num{
		font-size: 16px;
		color: #333;
		line-height: 25px;
		margin: 20px 0;
	}
	.floorRooms .elder_info span{
		font-size: 14px;
		color: #333;
		line-height: 22px;
		display: block;
		margin-bottom: 10px;
	}
	.floorRooms .roomInfo img{
		width: 100%;
		height: 100%;
	}
	.button{
		width: 110px;
		height: 30px;
		margin: 10px;
		text-align: center;
		line-height: 30px;
		font-size: 14px;
		color: #fff;
		border-radius: 4px;
	}
	.emptyFontColor{
		color: #666666;
	}
	.emptyBG1{
		background-color: #fff;
		border: 1px solid #a7a7a7;
	}
	.emptyBG2{
		background-color: #fff;
		border: 1px solid #a9a9a9;
	}
	.inFontColor{
		color: #000;
	}
	.inBG1{
		background-color: #fff;
		border: 1px solid #a7a7a7;
	}
	.noPayFontColor{
		color: #000;
	}
	.noPayBG1{
		background-color: #fff;
		border: 1px solid #a7a7a7;
	}
	
	.bedstatus1{
		background: #3ad0bf;
	}
	.bedstatus2{
		background: #58a5e1;
	}
	.bedstatus3{
		background: #fe7cbf;
	}
	.bedstatus4{
		background: #96a3db;
	}
	.bedstatus5{
		background: #616c88;
	}
	.bedstatus6{
		background: #a74072;
	}
	.bedstatus7{
		background: #f26464;
	}
	.bedstatus8{
		background: #ddb451;
	}
	.bedstatus0{
		background: #cccccc;
	}
	.none{
		display: none;
	}
</style>