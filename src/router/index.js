import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/overview' },
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('../views/Overview.vue'),
    meta: { title: '总览' }
  },
  {
    path: '/eclipse',
    name: 'Eclipse',
    component: () => import('../views/SunMoonEclipse.vue'),
    meta: { title: '日月交辉' }
  },
  {
    path: '/stargallery',
    name: 'StarGallery',
    component: () => import('../views/StarGallery.vue'),
    meta: { title: '星河入梦' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
