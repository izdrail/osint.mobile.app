import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/phone-investigation'
  },
  {
    path: '/phone-investigation',
    component: () => import ('../views/phone-investigation.vue')
  },
  {
    path: '/phone-investigation/:scanID',
    component: import ('../views/phone-investigation-result.vue'),

  },
  {
    path: '/about',
    component: () => import ('../views/about.vue')
  },
  {
    path: '/domain-investigation',
    component: () => import ('../views/domain-investigation.vue')
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
