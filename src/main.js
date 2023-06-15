import Vue from 'vue'
//import iView from 'iview'
//import { Message } from 'iview'

import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
import './utils/mixins'
import axios from "axios";
import store from './store'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入和风天气图标
import 'qweather-icons/font/qweather-icons.css'

// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'


import {
  loading,
  borderBox7,
  borderBox8,
  borderBox9,
  borderBox10,
  borderBox12,
  decoration3,
  decoration5,
  decoration10,
  decoration11,
  activeRingChart,
} from '@jiaminghi/data-view'
Vue.use(ElementUI)
Vue.use(echarts)
Vue.use(loading)
Vue.use(borderBox7)
Vue.use(borderBox8)
Vue.use(borderBox9)
Vue.use(borderBox10)
Vue.use(borderBox12)
Vue.use(decoration3)
Vue.use(decoration5)
Vue.use(decoration10)
Vue.use(decoration11)
Vue.use(activeRingChart)
//Vue.use(iView)


//
// const app = createApp(App)
// app.use(store)
// app.use(router)
// app.use(ElementUI,{locale})


// Vue.config.globalProperties.$echarts=echarts;

Vue.config.productionTip = false
// Vue.prototype.$echarts = echarts
Vue.prototype.axios=axios;

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.id) {
    if (to.path !== '/sign-in') { // 避免重复重定向
      next('/sign-in'); // 跳转到登录页
    } else {
      next(); // 继续路由跳转
    }
  } else {
    next(); // 继续路由跳转
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
