import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import EditingPage from '@/pages/EditingPage.vue'

import HomeView from '@/pages/HomeView.vue'

const routes = [{ path: '/', component: HomeView }, { path: '/editing/:name', name: 'editing', component: EditingPage, props: (route: RouteLocationNormalized) => ({ name: route.params.name, advanced: route.query.advanced === 'true' }) }]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
