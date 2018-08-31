<template>
	<div class="table">
		<el-button @click="goback" type="danger" size="small" style="position: absolute;top: 12px;right: 30px;z-index: 99">
			<i class="el-icon-arrow-left el-icon--left">返回</i>
		</el-button>
		<el-row class="roomtcj">
			<el-col :span="5" :offset="1">{{splbname}}</el-col>
		</el-row>
		<el-table v-loading="loading" :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="week" label="执行时间">
			</el-table-column>
			<el-table-column prop="start_date" label="开始时间">
			</el-table-column>
			<el-table-column prop="end_date" label="结束时间">
			</el-table-column>
			<el-table-column prop="price" label="价格">
			</el-table-column>
			<el-table-column prop="status" label="状态">
				<template slot-scope="scope">
					<p>{{ scope.row.status === 0 ? '未发布':'已发布' }}</p>
				</template>
			</el-table-column>
			<el-table-column prop="employee_id" label="设置人">
			</el-table-column>
			<el-table-column prop="address" label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="exportRecipe(scope.row.id)">导出</el-button>
					<el-button v-if="scope.row.status === 0" type="text" size="small" @click="publish(scope.row)">发布</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
				<el-button type="success" @click="showAdd(0)">新增</el-button>
			</div>
			<div style="display: flex;margin-right: 20px;">
				<el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
				<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" layout="prev, pager, next" :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
			</div>
		</div>
		<v-recipe :typeId="typeId" :recipeId="recipeId" :mealName="mealName" :spicys="spicy" :textures="texture" :tastes="taste" :diseases="diseases" :meals="meals" :weeks="weeks"></v-recipe>
	</div>
</template>

<script>
import vRecipe from "./addRecipe.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      recipeId: 0,
      total: 0,
      last_page: 0,
      typeId: this.$route.params.rid,
      mealName: [],
      spicy: [],
      texture: [],
      taste: [],
      diseases: [],
      meals: [],
      weeks: [],
      loading: false,
      splbname: "",
      currentPage: 1,
    };
  },
  created: function() {
    this.splbname = this.$route.query.splbname;
  },
  components: {
    vRecipe
  },
  watch: {
    searchData(){
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchMealName();
    this.fetchType();
    this.fetchWeek();
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.recipescheduledschemesList + "?page=" + val;
      var data = {
        type_id: this.$route.params.rid
      }
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.recipeId = 0;
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
    deleteRecipe: async function(id) {
      let url = this.api.delrecipescheduledschemes;
      var data = {
        recipe_id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.fetchList(1);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    delMore() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceDelete, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherDelete, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            var data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].id;
              data.push(id);
            }
            this.deleteRecipe(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("recipeTrue");
      if (scope != 0) {
        this.recipeId = scope.id;
      } else {
        this.recipeId = 0;
      }
    },
    publish: async function(scope) {
      let url = this.api.releaserecipescheduledschemes;
      var data = {
        recipe_id: scope.id
      };
      const res = await this.$http.post(url, data);
      this.fetchList(1);
    },
    goback: async function() {
      this.$router.go(-1);
    },
    fetchType: async function(val) {
      let url = this.api.recipesdetail;
      var data = {
        id: this.$route.params.rid
      };
      const res = await this.$http.post(url, data);
      this.meals = res.data.data.suitable_meals;
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
    clean() {
      this.recipeId = 0;
    },
    fetchWeek: async function() {
      let url = this.api.recipeweek;
      var data = {};
      const res = await this.$http.post(url, data);
      this.weeks = res.data.data;
    },
    exportRecipe: async function(id) {
      let url = this.api.recipeexport;
      var data = {
        id: id
      };
      const res = await this.$http.post(url, data);
      window.open(res.data.data);
    }
  }
};
</script>

<style scoped>
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}

.roomtcj {
  color: #ff8777;
  line-height: 55px;
  border-bottom: 1px solid rgb(224, 224, 224);
}
</style>