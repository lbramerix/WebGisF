import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    //component: () => import("../views/Personal/SignUp.vue"),
    //component: PersonalCenter,
    component: () => import('../views/Home/index.vue')
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("../views/Personal/SignIn.vue"),
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: () => import("../views/Personal/SignUp.vue"),
  },
  {
    path: '/personal',
    name: 'personal',
    component: () => import('../views/Personal/PersonalCenter'),
    children:[
      // {
      //   path: 'bokelist',
      //   name: 'bokelist',
      //   component: BokeList,
      // },
      // {
      //   path: "changeinfo",
      //   name: 'changeinfo',
      //   component: Changeinfo,
      // },
      // {
      //   path: "changepic",
      //   name: "changepic",
      //   component: Changpic
      // },
      {
        path: "spaceinfo",
        name: "spaceinfo",
        component: () => import('../views/Personal/components/spaceinfo')
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
