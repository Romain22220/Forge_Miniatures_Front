import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from "../views/ContactView.vue"
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import CollectionView from '../views/CollectionView.vue'
import CategoryView from '../views/CategoryView.vue'
import ProductView from '../views/ProductView.vue'
import SubtypeView from '../views/SubtypeView.vue'
import DashboardView from '../views/DashboardView.vue'
import ArticleCreateView from '../views/ArticleCreateView.vue'
import ArticleEditView from '../views/ArticleEditView.vue'

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
    { 
      path: '/serie/:subtype',
      name: 'subtype', 
      component: SubtypeView 
    },
    { path: '/dashboard', 
      name: 'dashboard', 
      component: DashboardView, 
      meta: { requiresAdmin: true } 
    },
  { path: '/dashboard/articles/create',
     name: 'article-create',
      component: ArticleCreateView,
       meta: { requiresAdmin: true } 
  },
  { path: '/dashboard/articles/:id/edit',
     name: 'article-edit',
      component: ArticleEditView,
       meta: { requiresAdmin: true } 
  },
],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth || to.meta.requiresAdmin) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return { path: '/connexion' }
    }
  }

  if (to.meta.requiresAdmin) {
    const storedUser = localStorage.getItem('auth_user')
    const isAdmin = storedUser ? JSON.parse(storedUser)?.admin === true : false
    if (!isAdmin) {
      return { path: '/' } // ou une page 403 dédiée si tu préfères
    }
  }
})
export default router
