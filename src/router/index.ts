import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/domain-investigation'
  },
  {
    path: '/domain-investigation',
    component: () => import ('../views/domain-investigation.vue')
  },
  {
    path: '/ip-investigation',
    component: () => import ('../views/ip-investigation.vue')
  },
  {
    path: '/phone-investigation',
    component: () => import ('../views/phone-investigation.vue')
  },
  {
    path: '/email-investigation',
    component: () => import ('../views/email-investigation.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
