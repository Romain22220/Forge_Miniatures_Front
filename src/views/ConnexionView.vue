<!-- src/views/ConnexionViews.vue -->
<template>
  <div class="connexion-page">
    <!-- Fond avec pattern subtil -->
    <div class="background-pattern"></div>
    
    <!-- Container principal -->
    <div class="connexion-container">
      <!-- Logo/Titre -->
      <div class="connexion-header">
        <div class="logo-section">
          <h1 class="logo-title">
            <span class="logo-forge">Fabrik'</span>
            <span class="logo-miniatures">Miniatures</span>
          </h1>
          <p class="logo-subtitle">Connectez-vous à votre espace</p>
        </div>
      </div>

      <!-- Formulaire de connexion -->
      <div class="connexion-form-container">
        <div class="form-header">
          <h2 class="form-title">Connexion</h2>
          <p class="form-subtitle">Accédez à votre compte</p>
        </div>

        <form @submit.prevent="handleLogin" class="connexion-form">
          <!-- Email -->
          <div class="input-group">
            <label for="email" class="input-label">Email</label>
            <div class="input-wrapper" :class="{ 'input-focused': isEmailFocused, 'input-error': emailError }">
              <MailIcon class="input-icon" />
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="votre@email.com"
                class="form-input"
                @focus="isEmailFocused = true"
                @blur="isEmailFocused = false; validateEmail()"
                required
              />
            </div>
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>

          <!-- Mot de passe -->
          <div class="input-group">
            <label for="password" class="input-label">Mot de passe</label>
            <div class="input-wrapper" :class="{ 'input-focused': isPasswordFocused, 'input-error': passwordError }">
              <LockIcon class="input-icon" />
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Votre mot de passe"
                class="form-input"
                @focus="isPasswordFocused = true"
                @blur="isPasswordFocused = false; validatePassword()"
                required
              />
            </div>
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          </div>

          <!-- Options -->
          <div class="form-options">
            <label class="checkbox-container">
              <input v-model="rememberMe" type="checkbox" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Se souvenir de moi</span>
            </label>
            <router-link to="/mot-de-passe-oublie" class="forgot-password">
              Mot de passe oublié ?
            </router-link>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="isLoading"
            class="submit-button"
            :class="{ 'loading': isLoading }"
          >
            <LoaderIcon v-if="isLoading" class="loading-icon" />
            <span v-else>Se connecter</span>
          </button>

          <!-- Message d'erreur global -->
          <div v-if="loginError" class="global-error">
            <AlertCircleIcon class="error-icon" />
            <span>{{ loginError }}</span>
          </div>
        </form>

        <!-- Séparateur -->
        <div class="separator">
          <div class="separator-line"></div>
          <span class="separator-text">ou</span>
          <div class="separator-line"></div>
        </div>

        <!-- Connexion sociale -->
        <div class="social-login">
          <button class="social-button google">
            <div class="social-icon google-icon">G</div>
            <span>Continuer avec Google</span>
          </button>
        </div>

        <!-- Lien inscription -->
        <div class="signup-link">
          <span class="signup-text">Pas encore de compte ?</span>
          <router-link to="/inscription" class="signup-button">
            S'inscrire
          </router-link>
        </div>
      </div>
    </div>

    <!-- Décoration -->
    <div class="decoration-circles">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Icônes SVG
const MailIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  `
}

const LockIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  `
}

const EyeIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  `
}

const EyeOffIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  `
}

const LoaderIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
    </svg>
  `
}

const AlertCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  `
}

// État réactif
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const loginError = ref('')

// Fonctions
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'Email requis'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Format email invalide'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Mot de passe requis'
  } else if (password.value.length < 6) {
    passwordError.value = 'Minimum 6 caractères'
  } else {
    passwordError.value = ''
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  // Validation
  validateEmail()
  validatePassword()
  
  if (emailError.value || passwordError.value) {
    return
  }

  isLoading.value = true
  loginError.value = ''

  try {
    // Simulation d'une requête de connexion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Ici vous ajouterez votre logique de connexion
    console.log('Connexion:', { email: email.value, password: password.value, rememberMe: rememberMe.value })
    
    // Redirection après connexion réussie
    // this.$router.push('/')
    
  } catch (error) {
    loginError.value = 'Email ou mot de passe incorrect'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Page principale */
.connexion-page {
  @apply min-h-screen bg-white relative overflow-hidden;
  @apply flex items-center justify-center;
  padding-top: 64px; /* Hauteur de la navbar */
}

/* Pattern de fond subtil */
.background-pattern {
  @apply absolute inset-0 opacity-5;
  background-image: radial-gradient(circle at 1px 1px, #000 1px, transparent 0);
  background-size: 20px 20px;
}

/* Container principal */
.connexion-container {
  @apply relative z-10 w-full max-w-md mx-auto px-6;
}

/* Header avec logo */
.connexion-header {
  @apply text-center mb-8;
}

.logo-section {
  @apply mb-6;
}

.logo-title {
  @apply text-4xl font-bold mb-2;
}

.logo-forge {
  @apply text-gray-800;
}

.logo-miniatures {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-subtitle {
  @apply text-gray-600 text-lg;
}

/* Formulaire container */
.connexion-form-container {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  @apply rounded-3xl p-8 shadow-2xl border border-gray-800;
  backdrop-filter: blur(20px);
}

.form-header {
  @apply text-center mb-8;
}

.form-title {
  @apply text-2xl font-bold text-white mb-2;
}

.form-subtitle {
  @apply text-gray-400;
}

/* Formulaire */
.connexion-form {
  @apply space-y-6;
}

.input-group {
  @apply space-y-2;
}

.input-label {
  @apply block text-sm font-medium text-gray-300;
}

.input-wrapper {
  @apply relative flex items-center bg-gray-800/50 rounded-lg border border-gray-700;
  @apply transition-all duration-300;
}

.input-wrapper.input-focused {
  @apply border-orange-500 ring-2 ring-orange-500/20 bg-gray-800;
}

.input-wrapper.input-error {
  @apply border-red-500 ring-2 ring-red-500/20;
}

.input-icon {
  @apply w-5 h-5 text-gray-400 ml-4;
}

.form-input {
  @apply flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400;
  @apply px-4 py-3;
}

.password-toggle {
  @apply p-2 text-gray-400 hover:text-white transition-colors;
}

.toggle-text {
  @apply text-lg select-none;
}

.error-message {
  @apply text-red-400 text-sm;
}

/* Options */
.form-options {
  @apply flex items-center justify-between;
}

.checkbox-container {
  @apply flex items-center space-x-2 cursor-pointer;
}

.checkbox-input {
  @apply sr-only;
}

.checkbox-custom {
  @apply w-4 h-4 border-2 border-gray-400 rounded bg-gray-700 transition-all duration-200;
  position: relative;
}

.checkbox-input:checked + .checkbox-custom {
  @apply bg-gradient-to-r from-orange-500 to-red-500 border-orange-500;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  @apply absolute inset-0 flex items-center justify-center text-white text-xs font-bold;
}

.checkbox-label {
  @apply text-gray-300 text-sm;
}

.forgot-password {
  @apply text-orange-400 hover:text-orange-300 text-sm transition-colors;
  text-decoration: none;
}

/* Bouton de connexion */
.submit-button {
  @apply w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500;
  @apply text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600;
  @apply transition-all duration-300 transform hover:scale-105;
  @apply flex items-center justify-center space-x-2;
}

.submit-button:disabled {
  @apply opacity-70 cursor-not-allowed transform-none;
}

.loading-icon {
  @apply w-5 h-5;
}

/* Erreur globale */
.global-error {
  @apply flex items-center space-x-2 bg-red-900/20 text-red-400 p-3 rounded-lg;
  @apply border border-red-700;
}

.error-icon {
  @apply w-5 h-5 flex-shrink-0;
}

/* Séparateur */
.separator {
  @apply flex items-center my-6;
}

.separator-line {
  @apply flex-1 h-px bg-gray-700;
}

.separator-text {
  @apply px-4 text-gray-400 text-sm;
}

/* Connexion sociale */
.social-login {
  @apply space-y-3;
}

.social-button {
  @apply w-full flex items-center justify-center space-x-3 py-3 px-4;
  @apply bg-gray-800/50 hover:bg-gray-800 border border-gray-700;
  @apply text-gray-300 hover:text-white rounded-lg transition-all duration-200;
}

.social-icon {
  @apply w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold;
}

.google-icon {
  @apply bg-white text-gray-800;
}

.facebook-icon {
  @apply bg-blue-600 text-white;
}

/* Lien inscription */
.signup-link {
  @apply text-center mt-6 pt-6 border-t border-gray-700;
}

.signup-text {
  @apply text-gray-400 text-sm;
}

.signup-button {
  @apply ml-2 text-orange-400 hover:text-orange-300 font-medium transition-colors;
  text-decoration: none;
}

/* Décoration */
.decoration-circles {
  @apply absolute inset-0 pointer-events-none overflow-hidden;
}

.circle {
  @apply absolute rounded-full opacity-10;
  background: linear-gradient(45deg, #ff6b35, #f7931e);
}

.circle-1 {
  @apply w-64 h-64 -top-32 -right-32;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  @apply w-48 h-48 -bottom-24 -left-24;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  @apply w-32 h-32 top-1/2 -right-16;
  animation: float 4s ease-in-out infinite;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .connexion-container {
    @apply px-4;
  }
  
  .connexion-form-container {
    @apply p-6;
  }
}
</style>