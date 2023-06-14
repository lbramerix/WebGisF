import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: false },
    component: () => import('../views/Home/index.vue')
  },
  {
    path: "/sign-in",
    name: "sign-in",
    meta: { requiresAuth: false },
    component: () => import("../views/Personal/SignIn.vue"),
  },
  {
    path: "/sign-up",
    name: "sign-up",
    meta: { requiresAuth: false },
    component: () => import("../views/Personal/SignUp.vue"),
  },
  {
    path: '/personal',
    name: 'personal',
    meta: { requiresAuth: true },
    component: () => import('../views/Personal/PersonalCenter'),
    children:[
      {
        path: 'collect-list',
        name: 'collect-list',
        component: () => import('../views/Personal/components/collectList')
      },
      {
        path: "change-info",
        name: 'change-info',
        component: () => import('../views/Personal/components/changeInfo')
      },
      {
        path: "change-pwd",
        name: "change-pwd",
        component: () => import('../views/Personal/components/changePwd')
      },
      {
        path: "space-info",
        name: "space-info",
        component: () => import('../views/Personal/components/spaceInfo')
      },
      {
        path: "exit",
        name: "exit",
        component: () => import('../views/Personal/components/exit')
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
