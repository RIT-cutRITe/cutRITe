import { createRouter, createWebHistory } from 'vue-router'
import EditingPage from '@/pages/EditingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/editing', name: 'editing', component: EditingPage },
  ],
})

export default router
