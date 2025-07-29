import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  { path: '/', redirect: '/app/' },
  { path: '/app/', name: 'dashboard', component: Dashboard },
  { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
