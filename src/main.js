import Vue from 'vue'

import App from './App.vue'
import router from './router'
// import * as echarts from 'echarts'
import './utils/mixins'
import axios from "axios";
import store from './store'

import ElementUI from 'element-ui'

// 加载 element 组件库的样式
// import locale from 'element-ui/lib/theme-chalk/index.css'


import {
  loading,
  borderBox8,
  decoration3,
  decoration5,
  decoration10,
  activeRingChart,
} from '@jiaminghi/data-view'
Vue.use(ElementUI)
Vue.use(loading)
Vue.use(borderBox8)
Vue.use(decoration3)
Vue.use(decoration5)
Vue.use(decoration10)
Vue.use(activeRingChart)

//
// const app = createApp(App)
// app.use(store)
// app.use(router)
// app.use(ElementUI,{locale})


// Vue.config.globalProperties.$echarts=echarts;

Vue.config.productionTip = false
// Vue.prototype.$echarts = echarts
Vue.prototype.axios=axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
