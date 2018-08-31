<template>
	<div class="table">
		<el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%">
		    <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="eldername"
		      label="老人姓名">
		    </el-table-column>
		    <el-table-column
		      prop="bedsnumber"
		      label="床号">
		    </el-table-column>
		    <el-table-column
		      prop="eatdate"
		      label="就餐日期">
		    </el-table-column>
		    <el-table-column
		      prop="eatmeal"
		      label="就餐时间段">
		      	<template slot-scope="scope">
		          	<p>{{mealName[scope.row.eatmeal]}}</p>
		        </template>
		    </el-table-column>
		    <el-table-column
		      prop="employeename"
		      label="登记人">
		    </el-table-column>
		    <el-table-column
		      prop="createdat"
		      label="登记时间">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button v-if="scope.row.foodorderstatus == 0" type="text" size="small" disabled>点餐中</el-button>
		          	<el-button v-if="scope.row.foodorderstatus == 1" type="text" size="small" @click="fooddelivery(scope)">送餐</el-button>
		          	<el-button v-if="scope.row.foodorderstatus == 2" type="text" size="small" disabled>已送餐</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
		      	<el-button type="success" @click="showAdd">新增</el-button>
			</div>
			<div style="display: flex;margin-right: 20px;">
				<el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
				<el-pagination
				  background
				  @current-change="handleCurrentChange"
					    :current-page="currentPage"
				  layout="prev, pager, next"
				  :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
			</div>
	    </div>
	    <v-order :mealName="mealName" :spicys="spicy" :textures="texture" :tastes="taste" :diseases="diseases" :elders="elders"></v-order>
	    <v-delivery :foodorderid="foodorderid" :mealName="mealName" :eatmeal="eatmeal" :EMPs="EMP"></v-delivery>
	</div>
</template>

<script>
import vOrder from "./addOrder.vue";
import vDelivery from "./foodDelivery.vue";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      last_page: 0,
      mealName: [],
      spicy: [],
      texture: [],
      taste: [],
      diseases: [],
      areas: [],
      foodorderid: [],
      eatmeal: 0,
      EMP: [],
      elders: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vOrder,
    vDelivery
  },
  mounted() {
    this.fetchList(1);
    this.fetchMealName();
    this.fetchArea(1);
    this.fetchEMP();
    this.fetchElders();
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.foodorderlist + "?page=" + val;
      var data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.foodorderid = 0;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    showAdd() {
      this.$store.dispatch("addOrderTrue");
    },
    fetchMealName: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.BEADHOUSE_MEAL_NAME,
          this.data.BEADHOUSE_FOOD_SPICY_LEVEL,
          this.data.BEADHOUSE_FOOD_TEXTURE,
          this.data.BEADHOUSE_FOOD_TASTE,
          this.data.HEALTH_DISEASES
        ]
      };
      const res = await this.$http.post(url, data);
      this.mealName = res.data.data[this.data.BEADHOUSE_MEAL_NAME];
      this.spicy = res.data.data[this.data.BEADHOUSE_FOOD_SPICY_LEVEL];
      this.texture = res.data.data[this.data.BEADHOUSE_FOOD_TEXTURE];
      this.taste = res.data.data[this.data.BEADHOUSE_FOOD_TASTE];
      this.diseases = res.data.data[this.data.HEALTH_DISEASES];
    },
    fetchArea: async function(val) {
      let url = this.api.deliveryAreasList + "?page=" + val;
      var data = {};
      const res = await this.$http.post(url, data);
      this.areas = res.data.data.data;
    },
    fooddelivery(scope) {
      this.$store.dispatch("deliveryTrue");
      this.foodorderid = scope.row.foodorderid;
      this.eatmeal = scope.row.eatmeal;
    },
    fetchEMP: async function() {
      let url = this.api.getallemployeelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.EMP = res.data.data;
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    },
    clean(){
      this.eatmeal = 0;
    }
  }
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
</style>