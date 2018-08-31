<template>
    <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="社区居家养老服务：">
            <el-checkbox-group v-model="form.survice" @change="multiselect1">
                <el-checkbox 
                v-for="item in survice"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="文化娱乐设施：">
            <el-checkbox-group v-model="form.entertainment" @change="multiselect2">
                <el-checkbox 
                v-for="item in entertainment"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="房间设备：">
           <el-checkbox-group v-model="form.roomfacilities" @change="multiselect3">
                <el-checkbox 
                v-for="item in roomfacilities"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="医疗康复设备：">
            <el-checkbox-group v-model="form.equipment" @change="multiselect4">
                <el-checkbox 
                v-for="item in equipment"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="安全保障设备：">
            <el-checkbox-group v-model="form.safequipment" @change="multiselect5">
                <el-checkbox 
                v-for="item in safequipment"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="公共服务设施：">
            <el-checkbox-group v-model="form.publicservice" @change="multiselect6">
                <el-checkbox 
                v-for="item in publicservice"
                :key="item.id"
                :label="item.id">
                {{ item.attrname }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-button type="primary" @click="onSubmit('form')" style="margin-left: 47%;">保存</el-button>
    </el-form>
</template>

<script>
export default {
	data() {
		return {
			bLoading: false,
			form: {
				survice: [],
				entertainment: [],
				roomfacilities: [],
				equipment: [],
				safequipment: [],
				publicservice: [],
			},
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
		};
	},
	watch: {
		detail() {
			this.form.survice = [];
			this.form.entertainment = [];
			this.form.roomfacilities = [];
			this.form.equipment = [];
			this.form.safequipment = [];
			this.form.publicservice = [];
			let detailarr = this.detail.attrlist_arr;
			for (let i = 0; i < detailarr.length; i++) {
				if (detailarr[i].pid === 65) {
					this.form.survice.push(detailarr[i].id);
				} else if (detailarr[i].pid === 81) {
					this.form.entertainment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 92) {
					this.form.roomfacilities.push(detailarr[i].id);
				} else if (detailarr[i].pid === 119) {
					this.form.equipment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 128) {
					this.form.safequipment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 106) {
					this.form.publicservice.push(detailarr[i].id);
				} else if (detailarr[i].pid === 1) {
					this.attrlist.push(detailarr[i].id);
				} else if (detailarr[i].pid === 2) {
					this.object.push(detailarr[i].id);
				} else if (detailarr[i].pid === 4) {
					this.environment.push(detailarr[i].id);
				} else if (detailarr[i].pid === 5) {
					this.publicsupport.push(detailarr[i].id);
				}
			}
		},
	},
	props: {
		detail: Object,
	},
	mounted() {
		this.multiselect1();
		this.multiselect2();
		this.multiselect3();
		this.multiselect4();
		this.multiselect5();
		this.multiselect6();
	},
	methods: {
		onSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					var data = this.detail;
					var multiselectArr = [];
					multiselectArr = this.form.survice.concat(this.form.entertainment);
					multiselectArr = multiselectArr.concat(this.form.roomfacilities);
					multiselectArr = multiselectArr.concat(this.form.equipment);
					multiselectArr = multiselectArr.concat(this.form.safequipment);
					multiselectArr = multiselectArr.concat(this.form.publicservice);

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
				console.log(error);
			}
		},
		multiselect1: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 65 };
			const res = await this.$http.post(url, data);
			this.survice = res.data.data;
		},
		multiselect2: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 81 };
			const res = await this.$http.post(url, data);
			this.entertainment = res.data.data;
		},
		multiselect3: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 92 };
			const res = await this.$http.post(url, data);
			this.roomfacilities = res.data.data;
		},
		multiselect4: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 119 };
			const res = await this.$http.post(url, data);
			this.equipment = res.data.data;
		},
		multiselect5: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 128 };
			const res = await this.$http.post(url, data);
			this.safequipment = res.data.data;
		},
		multiselect6: async function() {
			let url = this.api.getattrlist;
			let data = { pid: 106 };
			const res = await this.$http.post(url, data);
			this.publicservice = res.data.data;
		},
	},
};
</script>

<style scoped>
</style>
