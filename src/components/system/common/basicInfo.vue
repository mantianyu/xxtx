<template>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="公寓名称：" prop="title">
            <el-input v-model="form.title" placeholder="请输入公寓名称"></el-input>
        </el-form-item>
        <el-form-item label="公寓卖点：" prop="sellpoint">
            <el-input v-model="form.sellpoint" placeholder="请输入公寓卖点，如高端、大气"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：">
          <div style="display: flex;">
            <el-form-item prop="province">
              <el-select
                v-model="form.province"
                @change="choseCity"
                placeholder="省级地区">
                <el-option
                    v-for="item in province"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="municipal" style="margin-left: 20px;">
            <el-select
                v-model="form.municipal"
                @change="choseBlock"
                placeholder="市级地区">
                <el-option
                    v-for="item in municipal"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="district" style="margin-left: 20px;">
              <el-select
                v-model="form.district"
                placeholder="区级地区">
                <el-option
                    v-for="item in district"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
            <el-input v-model="form.address" placeholder="请输入具体地址"></el-input>
        </el-form-item>
        <el-form-item label="坐标：">
            <el-form-item label="经度（Lng）：" style="float: left" prop="lng">
                <el-input v-model="center.lng" style="width: 180px" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="纬度（Lat）：" style="float: left" prop="lat">
                <el-input v-model="center.lat" style="width: 180px" :disabled="true"></el-input>
            </el-form-item>
            <el-button @click="getMap()" style="margin-left: 20px">点击获取</el-button>
            <el-button @click="closeMap()" style="margin-left: 20px">关闭地图</el-button>
            <div v-show="showMap" style="margin-top: 20px">
              <baidu-map v-bind:style="mapStyle" class="bm-view" ak="GA0ESDlD5qr8D5rgXBD3TDil182KsZ0Z"
                  :center="center" 
                  :zoom="zoom" 
                  :scroll-wheel-zoom="true" 
                  @click="getClickInfo"
                  @moving="syncCenterAndZoom" 
                  @moveend="syncCenterAndZoom" 
                  @zoomend="syncCenterAndZoom">
                  <bm-view style="width: 100%; height:500px;"></bm-view>
                  <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
                  </bm-marker>
                  <bm-control offset="{width: '10px', height: '10px'}">
                  <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
                      <input type="text" placeholder="请输入搜索关键字" class="serachinput">
                  </bm-auto-complete>
                  </bm-control>
                  <bm-local-search :keyword="keyword" :auto-viewport="true" style="width:0px;height:0px;overflow: hidden;"></bm-local-search>
              </baidu-map>
            </div>

        </el-form-item>
        <el-form-item label="交通信息：" prop="traffic">
            <el-input type="textarea" v-model="form.traffic"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkman">
            <el-input v-model="form.linkman" placeholder="请输入联系人" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="telephone">
            <el-input v-model="form.telephone" placeholder="请输入联系电话" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="绑定手机1：" prop="bindphoneone">
            <el-input v-model="form.bindphoneone" placeholder="请输入绑定手机1" style="width:200px"></el-input>
            <span style="margin-left: 15px">
                <i style="color: red;margin-right: 10px;font-size: 18px">*</i>
                此手机号用于接收通知信息，请谨慎正确填写
            </span>
        </el-form-item>
        <el-form-item label="绑定手机2：" prop="bindphonetwo">
            <el-input v-model="form.bindphonetwo" placeholder="请输入绑定手机2" style="width:200px"></el-input>
            <span style="margin-left: 15px">
                <i style="color: red;margin-right: 10px;font-size: 18px">*</i>
                此手机号功能同上，请谨慎正确填写
            </span>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email">
            <el-input v-model="form.email" placeholder="请输入电子邮箱" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="企业网站：" prop="website">
            <el-input v-model="form.website" placeholder="请输入企业网站" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="建立时间：" prop="opentime">
            <el-input v-model="form.opentime" placeholder="请输入建立时间" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="特色服务：" prop="attrlist">
            <el-checkbox-group v-model="form.attrlist">
                <el-checkbox 
                v-for="item in attrlist"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="收住对象：" prop="object">
            <el-checkbox-group v-model="form.object">
                <el-checkbox 
                v-for="item in object"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="环境设施：" prop="environment">
            <el-checkbox-group v-model="form.environment">
                <el-checkbox 
                v-for="item in environment"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="养老公共配套：" prop="publicsupport">
            <el-checkbox-group v-model="form.publicsupport">
                <el-checkbox 
                v-for="item in publicsupport"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="性质：" prop="nature_id">
            <el-select v-model="form.nature_id" placeholder="请选择性质">
            <el-option
                v-for="item in nature"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="连锁机构：" prop="is_chain">
            <el-radio-group v-model="form.is_chain">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="床位数：" prop="bed_count">
            <el-input v-model="form.bed_count" placeholder="请输入床位数" style="width:200px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="价格区间：" prop="reference_price">
          <el-input v-model="form.reference_price" placeholder="100.00元-2000.00元" style="width:200px" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="异地老人：" prop="elsewhere">
            <el-radio-group v-model="form.elsewhere">
            <el-radio :label="1">接收</el-radio>
            <el-radio :label="0">不接收</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="医养结合：" prop="is_yyjh">
            <el-radio-group v-model="form.is_yyjh">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="医疗服务方式：" prop="medical_service">
            <el-input type="textarea" v-model="form.medical_service"></el-input>
        </el-form-item>
        <div style="display: flex;justify-content: center;">
        <el-button :loading="bLoading" type="primary" @click="submitForm('form')">保存</el-button>
        </div>
    </el-form>
</template>

<script>
import { BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker } from 'vue-baidu-map';

export default {
	data() {
		return {
			form: {
				title: '',
				sellpoint: '',
				province: '',
				municipal: '',
				district: '',
				address: '',
				traffic: '',
				linkman: '',
				telephone: '',
				bindphoneone: '',
				bindphonetwo: '',
				email: '',
				website: '',
				opentime: '',
				attrlist: [],
				object: [],
				environment: [],
				publicsupport: [],
				nature_id: '',
				is_chain: '',
				bed_count: '',
				// reference_price: '',
				elsewhere: '',
				is_yyjh: '',
				medical_service: '',
			},
			rules: {
				title: [{ required: true, message: '请输入公寓名称', trigger: 'blur' }],
				sellpoint: [{ required: true, message: '请输入公寓卖点', trigger: 'blur' }],
				province: [{ required: true, message: '请选择省', trigger: 'change' }],
				municipal: [{ required: true, message: '请选择市', trigger: 'change' }],
				district: [{ required: true, message: '请选择区', trigger: 'change' }],
				address: [{ required: true, message: '请输入具体地址', trigger: 'blur' }],
				traffic: [{ required: true, message: '请输入交通信息', trigger: 'blur' }],
				linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
				telephone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
				bindphoneone: [{ required: true, message: '请输入绑定手机1', trigger: 'blur' }],
				bindphonetwo: [{ required: true, message: '请输入绑定手机2', trigger: 'blur' }],
				email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur' }],
				website: [{ required: true, message: '请输入企业网站', trigger: 'blur' }],
				opentime: [{ required: true, message: '请输入建立时间', trigger: 'blur' }],
				attrlist: [{ required: true, message: '请选择特色服务', trigger: 'change' }],
				object: [{ required: true, message: '请选择收住对象', trigger: 'change' }],
				environment: [{ required: true, message: '请选择环境设施', trigger: 'change' }],
				publicsupport: [{ required: true, message: '请选择养老公共配套', trigger: 'change' }],
				nature_id: [{ required: true, message: '请选择性质', trigger: 'change' }],
				is_chain: [{ required: true, message: '请选择是否为连锁机构', trigger: 'change' }],
				bed_count: [{ required: true, message: '请输入床位数', trigger: 'blur' }],
				elsewhere: [
					{
						required: true,
						message: '请选择是否接收异地老人',
						trigger: 'change',
					},
				],
				is_yyjh: [{ required: true, message: '请选择是否医养结合', trigger: 'change' }],
				medical_service: [{ required: true, message: '请输入医疗服务方式', trigger: 'blur' }],
			},
			province: [],
			municipal: [],
			district: [],
			attrlist: [],
			object: [],
			environment: [],
			publicsupport: [],
			survice: [],
			entertainment: [],
			roomfacilities: [],
			equipment: [],
			safequipment: [],
			publicservice: [],
			nature: [],
			mapStyle: {
				width: '100%',
				height: this.mapHeight + 'px',
			},
			center: { lng: 116.404, lat: 39.915 },
			zoom: 15,
			keyword: '',
			showMapComponent: '',
			showMap: false,
			bLoading: false,
		};
	},
	components: {
		BaiduMap,
		BmControl,
		BmView,
		BmAutoComplete,
		BmLocalSearch,
		BmMarker,
	},
	watch: {
		value: function(currentValue) {
			this.showMapComponent = currentValue;
			if (currentValue) {
				this.keyword = '';
			}
		},
		detail() {
			this.form.title = this.detail.title;
			this.form.sellpoint = this.detail.sellpoint;
			this.form.province = this.detail.province;
			this.form.municipal = this.detail.city;
			this.form.district = this.detail.district;
			this.form.address = this.detail.address;
			this.form.traffic = this.detail.traffic;
			this.form.linkman = this.detail.linkman;
			this.form.telephone = this.detail.telephone;
			this.form.bindphoneone = this.detail.bindphoneone;
			this.form.bindphonetwo = this.detail.bindphonetwo;
			this.form.email = this.detail.email;
			this.form.website = this.detail.website;
			this.form.opentime = this.detail.opentime;
			this.form.attrlist = [];
			this.form.object = [];
			this.form.environment = [];
      		this.form.publicsupport = [];
			let detailarr = this.detail.attrlist_arr;
			for (let i = 0; i < detailarr.length; i++) {
				if (detailarr[i].pid === 1) {
					this.form.attrlist.push(detailarr[i].id);
				} else if (detailarr[i].pid === 2) {
					this.form.object.push(detailarr[i].id);
				} else if (detailarr[i].pid === 4) {
					this.form.environment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 5) {
					this.form.publicsupport.push(detailarr[i].id);
				} else if (detailarr[i].pid === 65) {
					this.survice.push(detailarr[i].id);
				} else if (detailarr[i].pid === 81) {
					this.entertainment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 92) {
					this.roomfacilities.push(detailarr[i].id);
				} else if (detailarr[i].pid === 119) {
					this.equipment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 128) {
					this.safequipment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 106) {
					this.publicservice.push(detailarr[i].id);
				}
			}
			this.form.nature_id = this.detail.nature_id;
			this.form.is_chain = this.detail.is_chain;
			this.form.bed_count = this.detail.bed_count;
			// this.form.reference_price = this.detail.reference_price;
			this.form.elsewhere = this.detail.elsewhere;
			this.form.is_yyjh = this.detail.is_yyjh;
			this.form.medical_service = this.detail.medical_service;
			this.choseCitys(this.detail.province, 1);
			this.choseBlocks(this.detail.city, 1);
		},
	},
	props: {
		value: Boolean,
		mapHeight: {
			type: Number,
			default: 500,
		},
		detail: Object,
	},
	mounted() {
		this.choiceProvince();
		this.multiselect1();
		this.multiselect2();
		this.multiselect3();
		this.multiselect4();
		this.choiceNature();
	},
	methods: {
		// 选省
		choiceProvince: async function() {
			let url = this.api.getdistrictlist;
			let data = { pid: 0 };
			const res = await this.$http.post(url, data);
			this.province = res.data.data;
		},
		// 选市
		choseCity(id) {
			this.choseCitys(id, 0);
		},
		choseCitys: async function(id, status) {
			if (status !== 1) {
				this.form.municipal = '';
				this.form.district = '';
				this.municipal = [];
				this.district = [];
			}
			let url = this.api.getdistrictlist;
			let data = { pid: id };
			const res = await this.$http.post(url, data);
			this.municipal = res.data.data;
		},
		// 选区
		choseBlock(id) {
			this.choseBlocks(id, 0);
		},
		choseBlocks: async function(id, status) {
			if (status !== 1) {
				this.form.district = '';
				this.district = [];
			}
			let url = this.api.getdistrictlist;
			let data = { pid: id };
			const res = await this.$http.post(url, data);
			this.district = res.data.data;
		},
		//多选框
		multiselect1: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 1 };
			const res = await this.$http.post(url, data);
			this.attrlist = res.data.data;
		},
		multiselect2: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 2 };
			const res = await this.$http.post(url, data);
			this.object = res.data.data;
		},
		multiselect3: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 4 };
			const res = await this.$http.post(url, data);
			this.environment = res.data.data;
		},
		multiselect4: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 5 };
			const res = await this.$http.post(url, data);
			this.publicsupport = res.data.data;
		},
		choiceNature: async function() {
			let url = this.api.gethotelnaturelist;
			let data = {};
			const res = await this.$http.post(url, data);
			this.nature = res.data.data;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
          this.bLoading = true;
					var data = this.detail;
					data.title = this.form.title;
					data.sellpoint = this.form.sellpoint;
					data.province = this.form.province;
					data.municipal = this.form.municipal;
					data.district = this.form.district;
					data.address = this.form.address;
					data.traffic = this.form.traffic;
					data.linkman = this.form.linkman;
					data.telephone = this.form.telephone;
					data.bindphoneone = this.form.bindphoneone;
					data.bindphonetwo = this.form.bindphonetwo;
					data.email = this.form.email;
					data.website = this.form.website;
					data.opentime = this.form.opentime;
					data.nature_id = this.form.nature_id;
					data.is_chain = this.form.is_chain;
					data.bed_count = this.form.bed_count;
					data.elsewhere = this.form.elsewhere;
					data.is_yyjh = this.form.is_yyjh;
					data.medical_service = this.form.medical_service;
					var multiselectArr = [];
					multiselectArr = this.form.attrlist.concat(this.form.object);
					multiselectArr = multiselectArr.concat(this.form.environment);
					multiselectArr = multiselectArr.concat(this.form.publicsupport);
					multiselectArr = multiselectArr.concat(this.survice);
					multiselectArr = multiselectArr.concat(this.entertainment);
					multiselectArr = multiselectArr.concat(this.roomfacilities);
					multiselectArr = multiselectArr.concat(this.equipment);
					multiselectArr = multiselectArr.concat(this.safequipment);
					multiselectArr = multiselectArr.concat(this.publicservice);
					data.attrlist = multiselectArr;
					this.saveInfo(data);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		saveInfo: async function(data) {
			let url = this.api.savehotelinfo;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.bLoading = false;
						},
					});
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.bLoading = false;
						},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.bLoading = false;
					},
				});
			}
		},
		//地图获取经纬度
		getClickInfo(e) {
			this.center.lng = e.point.lng;
			this.center.lat = e.point.lat;
		},
		syncCenterAndZoom(e) {
			const { lng, lat } = e.target.getCenter();
			this.center.lng = lng;
			this.center.lat = lat;
			this.zoom = e.target.getZoom();
		},
		//开关地图
		getMap() {
			this.showMap = true;
		},
		closeMap() {
			this.showMap = false;
		},
	},
};
</script>

<style scoped>
.serachinput {
	width: 300px;
	box-sizing: border-box;
	padding: 9px;
	border: 1px solid #dddee1;
	line-height: 20px;
	font-size: 16px;
	height: 38px;
	color: #333;
	position: relative;
	border-radius: 4px;
	-webkit-box-shadow: #666 0px 0px 10px;
	-moz-box-shadow: #666 0px 0px 10px;
	box-shadow: #666 0px 0px 10px;
}
</style>

