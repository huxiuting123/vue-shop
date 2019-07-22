import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/Login.vue'
import Home from '../views/home/Home.vue'
import Wlecome from '../views/home/welcome'
import Users from '../views/users'
import Rrights from '../views/home/power/rights'
import Roles from '../views/home/power/roles'
import Categories from '../views/home/goods/categories'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home',
      component: Home,
      redirect: '/users',
      children: [
        {
          path: '/welcome',
          component: Wlecome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rrights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        }
      ]
    }
  ]
})
// 路由安全守卫通过beforeEach方法，是vuerouter里面提供的方法
// to是从哪里来 from是到哪里去 next是回调函数 意思是放行的意思
router.beforeEach((to, from, next) => {
  // 如果地址重登录页面来 就直接放行
  if (to.path === '/login') return next()
  // 通过本地存储过token 如果有token就放行 否则强制跳转到登录页面
  const tokenstr = sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})
export default router
