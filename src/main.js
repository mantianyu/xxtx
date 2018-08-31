// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import echarts from 'echarts'
import App from './App'
import router from './router'
import http from './utils/http'
import api from './utils/api'
import data from './utils/data'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
import axios from 'axios'
import VCharts from 'v-charts'
import message from './utils/message'

Vue.use(ElementUI);
Vue.use(VCharts)
Vue.use(vueEventCalendar, {locale: 'zh'})
Vue.prototype.$echarts=echarts
Vue.config.productionTip = false

Vue.prototype.$http = http;
Vue.prototype.api = api;
Vue.prototype.data = data;
Vue.prototype.axios = axios;
Vue.prototype.message = message;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})

