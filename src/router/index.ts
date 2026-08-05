import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from "../views/ContactView.vue"
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import CollectionView from '../views/CollectionView.vue'
import CategoryView from '../views/CategoryView.vue'
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      component: LoginView
    },
    {
      path: '/inscription',
      name: 'Inscription',
      component: RegisterView
    },
    { 
      path: '/profil', 
      name: 'profile', 
      component: ProfileView, 
      meta: { requiresAuth: true } 
    },
    { 
      path: '/collection', 
      name: 'collection', 
      component: CollectionView, 
      meta: { requiresAuth: true } 
    },
    { 
      path: '/categorie/:type'
      , name: 'category'
      , component: CategoryView 
    },
    { 
      path: '/produit/:id'
      , name: 'product'
      , component: ProductView 
    },
  ],
})

export default router
