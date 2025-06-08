import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from "../views/ContactView.vue"
import ConnexionView from '../views/ConnexionView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView
},
   {
     path: '/connexion',
     name: 'Connexion',
     component: ConnexionView
   }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
