import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/notes',
    name: 'Notes',
    meta: { requireAuth: true },
    component: () => import(/* webpackChunkName: "notes" */ '../views/Notes.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  ,
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "sign-up" */ '../views/SignUp.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const protectedRoute = to.matched.some(record => record.meta.requireAuth)
  if (protectedRoute && !store.state.token) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
