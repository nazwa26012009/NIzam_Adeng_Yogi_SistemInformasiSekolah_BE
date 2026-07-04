// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import LoginView from '@/loginview.vue'
// @ts-ignore
import DashboardView from '@/dashboardview.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/dashboard' && !token) {
    next('/')
  } else if (to.path === '/' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
