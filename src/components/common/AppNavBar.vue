<!-- src/components/common/AppNavBar.vue -->
<template>
  <nav class="navbar-spotify">
    <!-- Barre de navigation principale -->
    <div class="navbar-content">
      <!-- Logo premium avec gradient -->
      <router-link to="/" class="navbar-logo">
        <div class="logo-container">
          <span class="logo-text">
            <span class="logo-forge">Fabrik'</span>
            <span class="logo-miniatures">Miniatures</span>
          </span>
        </div>
      </router-link>

      <!-- Menu desktop avec hover effects -->
      <div class="navbar-menu-desktop">
        <router-link 
          to="/" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.name === 'Home' }"
        >
          <span class="nav-text">Accueil</span>
          <div class="nav-underline"></div>
        </router-link>
        
        <router-link 
          to="/catalog" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.name === 'Catalog' }"
        >
          <span class="nav-text">Catalogue</span>
          <div class="nav-underline"></div>
        </router-link>
        
        <router-link 
          to="/contact" 
          class="nav-link"
          :class="{ 'nav-link-active': $route.name === 'Contact' }"
        >
          <span class="nav-text">Contact</span>
          <div class="nav-underline"></div>
        </router-link>
        
        <!-- Menu déroulant "Plus" -->
        <div class="nav-dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <button class="nav-link dropdown-trigger">
            <span class="nav-text">Plus</span>
            <ChevronDownIcon class="dropdown-icon" :class="{ 'rotate': showDropdown }" />
            <div class="nav-underline"></div>
          </button>
          
          <Transition name="dropdown-fade">
            <div v-if="showDropdown" class="dropdown-menu">
              <a href="#" class="dropdown-item">
                <span class="dropdown-emoji">📰</span>
                <div>
                  <div class="dropdown-title">Actualités</div>
                  <div class="dropdown-desc">Dernières sorties</div>
                </div>
              </a>
              <a href="#" class="dropdown-item">
                <span class="dropdown-emoji">🎁</span>
                <div>
                  <div class="dropdown-title">Promotions</div>
                  <div class="dropdown-desc">Offres spéciales</div>
                </div>
              </a>
              <a href="#" class="dropdown-item">
                <span class="dropdown-emoji">✨</span>
                <div>
                  <div class="dropdown-title">Nouveautés</div>
                  <div class="dropdown-desc">Les dernières nouveautés</div>
                </div>
              </a>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Actions utilisateur -->
      <div class="navbar-actions">
        <!-- Recherche premium -->
        <div class="search-container">
          <div class="search-wrapper" :class="{ 'search-focused': isSearchFocused }">
            <SearchIcon class="search-icon" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher..."
              class="search-input"
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
              @keyup.enter="handleSearch"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
              ✕
            </button>
          </div>
        </div>

        <!-- Panier (optionnel) -->
        <button class="cart-button">
          <CartIcon class="cart-icon" />
          <span v-if="cartItems > 0" class="cart-badge">{{ cartItems }}</span>
        </button>

        <!-- Connexion premium -->
        <router-link to="/connexion" class="btn-premium">
          <UserIcon class="btn-icon" />
          <span>Connexion</span>
        </router-link>
      </div>
    </div>

    <!-- Menu mobile premium -->
    <Transition name="mobile-slide">
      <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
        <div class="mobile-menu-content" @click.stop>
          <!-- Header mobile -->
          <div class="mobile-menu-header">
            <div class="mobile-logo">
              <div class="logo-icon">🏎️</div>
              <span class="mobile-logo-text">Forge Miniatures</span>
            </div>
            <button @click="closeMobileMenu" class="mobile-close-button">
              ✕
            </button>
          </div>
          
          <!-- Navigation mobile -->
          <div class="mobile-menu-nav">
            <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
              <div class="mobile-nav-icon">🏠</div>
              <div>
                <div class="mobile-nav-title">Accueil</div>
                <div class="mobile-nav-desc">Page principale</div>
              </div>
            </router-link>
            
            <router-link to="/catalog" class="mobile-nav-link" @click="closeMobileMenu">
              <div class="mobile-nav-icon">📚</div>
              <div>
                <div class="mobile-nav-title">Catalogue</div>
                <div class="mobile-nav-desc">Toutes nos miniatures</div>
              </div>
            </router-link>
            
            <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">
              <div class="mobile-nav-icon">📧</div>
              <div>
                <div class="mobile-nav-title">Contact</div>
                <div class="mobile-nav-desc">Nous contacter</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Icônes SVG simples
const SearchIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  `
}

const ChevronDownIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  `
}

const CartIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  `
}

const UserIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  `
}

// État réactif
const searchQuery = ref('')
const isSearchFocused = ref(false)
const isMobileMenuOpen = ref(false)
const showDropdown = ref(false)
const cartItems = ref(3) // Exemple

// Fonctions
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Recherche:', searchQuery.value)
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth >= 1024 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Navbar principale - Style Spotify/Netflix */
.navbar-spotify {
  @apply fixed top-0 left-0 right-0 z-50;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

/* Contenu */
.navbar-content {
  @apply max-w-7xl mx-auto px-6 lg:px-8;
  @apply flex items-center justify-between h-16;
}

/* Logo premium avec gradient */
.navbar-logo {
  @apply flex items-center space-x-3 text-white hover:text-gray-200 transition-colors;
  text-decoration: none;
}

.logo-container {
  @apply flex items-center space-x-3;
}

.logo-icon {
  @apply text-2xl;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
}

.logo-text {
  @apply font-bold text-xl;
}

.logo-forge {
  @apply text-white;
}

.logo-miniatures {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Menu desktop premium */
.navbar-menu-desktop {
  @apply hidden lg:flex items-center space-x-8;
}

.nav-link {
  @apply relative px-4 py-2 text-gray-300 hover:text-white font-medium transition-all duration-300;
  text-decoration: none;
}

.nav-link:hover .nav-underline {
  @apply w-full bg-gradient-to-r from-orange-500 to-red-500;
}

.nav-link-active {
  @apply text-white;
}

.nav-link-active .nav-underline {
  @apply w-full bg-gradient-to-r from-orange-500 to-red-500;
}

.nav-underline {
  @apply absolute bottom-0 left-4 right-4 h-0.5 w-0 transition-all duration-300;
}

/* Menu déroulant */
.nav-dropdown {
  @apply relative;
}

.dropdown-trigger {
  @apply flex items-center space-x-1;
}

.dropdown-icon {
  @apply w-4 h-4 transition-transform duration-200;
}

.dropdown-icon.rotate {
  @apply rotate-180;
}

.dropdown-menu {
  @apply absolute top-full left-0 mt-2 w-64 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700;
  @apply py-2;
}

.dropdown-item {
  @apply flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors;
  text-decoration: none;
}

.dropdown-emoji {
  @apply text-xl;
}

.dropdown-title {
  @apply font-medium text-white;
}

.dropdown-desc {
  @apply text-sm text-gray-400;
}

/* Actions utilisateur */
.navbar-actions {
  @apply flex items-center space-x-4;
}

/* Recherche premium */
.search-container {
  @apply hidden md:block;
}

.search-wrapper {
  @apply relative flex items-center bg-gray-800/50 rounded-full px-4 py-2;
  @apply border border-gray-700 transition-all duration-300;
}

.search-wrapper.search-focused {
  @apply bg-gray-800 border-orange-500 ring-2 ring-orange-500/20;
}

.search-icon {
  @apply w-5 h-5 text-gray-400;
}

.search-input {
  @apply bg-transparent border-none outline-none text-white placeholder-gray-400 ml-3 pr-8;
  @apply w-48 transition-all duration-300;
}

.search-wrapper.search-focused .search-input {
  @apply w-64;
}

.clear-search {
  @apply absolute right-3 text-gray-400 hover:text-white transition-colors;
}

/* Panier */
.cart-button {
  @apply relative p-3 text-gray-300 hover:text-white transition-colors;
  @apply bg-gray-800/50 rounded-lg hover:bg-gray-700 border border-gray-700;
}

.cart-icon {
  @apply w-6 h-6;
  stroke: currentColor;
  fill: none;
}

.cart-badge {
  @apply absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs;
  @apply rounded-full w-5 h-5 flex items-center justify-center font-bold;
}

/* Bouton connexion premium */
.btn-premium {
  @apply flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500;
  @apply text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600;
  @apply transition-all duration-300 transform hover:scale-105;
  text-decoration: none;
}

.btn-icon {
  @apply w-5 h-5;
}

/* Menu mobile burger - masqué sur desktop */
.mobile-menu-button {
  @apply lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all;
  @apply flex flex-col justify-center items-center w-10 h-10 space-y-1;
}

.hamburger-line {
  @apply w-6 h-0.5 bg-current transition-all duration-300;
}

.mobile-menu-button.active .hamburger-line:nth-child(1) {
  @apply rotate-45 translate-y-1.5;
}

.mobile-menu-button.active .hamburger-line:nth-child(2) {
  @apply opacity-0;
}

.mobile-menu-button.active .hamburger-line:nth-child(3) {
  @apply -rotate-45 -translate-y-1.5;
}

/* Overlay mobile */
.mobile-menu-overlay {
  @apply fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden;
}

.mobile-menu-content {
  @apply absolute right-0 top-0 h-full w-80 max-w-full;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  @apply shadow-2xl;
}

.mobile-menu-header {
  @apply flex items-center justify-between p-6 border-b border-gray-700;
}

.mobile-logo {
  @apply flex items-center space-x-2 text-white;
}

.mobile-logo-text {
  @apply font-bold;
}

.mobile-close-button {
  @apply p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors;
}

.mobile-menu-nav {
  @apply p-4 space-y-1;
}

.mobile-nav-link {
  @apply flex items-center space-x-4 p-4 text-gray-300 hover:text-white hover:bg-gray-800;
  @apply rounded-lg transition-colors duration-200;
  text-decoration: none;
}

.mobile-nav-icon {
  @apply text-xl;
}

.mobile-nav-title {
  @apply font-medium text-white;
}

.mobile-nav-desc {
  @apply text-sm text-gray-400;
}

.mobile-menu-actions {
  @apply absolute bottom-6 left-4 right-4;
}

.mobile-btn-premium {
  @apply block w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500;
  @apply text-white font-medium rounded-lg;
  text-decoration: none;
}

/* Animations */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: all 0.3s ease;
}

.mobile-slide-enter-from .mobile-menu-content,
.mobile-slide-leave-to .mobile-menu-content {
  transform: translateX(100%);
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    @apply hidden;
  }
  
  .cart-button {
    @apply hidden;
  }
}
</style>