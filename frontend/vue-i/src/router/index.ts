import { createRouter, createWebHistory } from 'vue-router'
import EditingPage from '@/pages/EditingPage.vue'

import HomeView from '@/pages/HomeView.vue'

const routes = [{ path: '/', component: HomeView }, { path: '/editing/:name', name: 'editing', component: EditingPage, props:true }]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
