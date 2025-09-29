<!-- src/views/InscriptionViews.vue -->
<template>
  <div class="inscription-page">
    <!-- Fond avec pattern subtil -->
    <div class="background-pattern"></div>
    
    <!-- Container principal -->
    <div class="inscription-container">
      <!-- Logo/Titre -->
      <div class="inscription-header">
        <div class="logo-section">
          <h1 class="logo-title">
            <span class="logo-forge">Fabrik'</span>
            <span class="logo-miniatures">Miniatures</span>
          </h1>
          <p class="logo-subtitle">Créez votre compte</p>
        </div>
      </div>

      <!-- Formulaire d'inscription -->
      <div class="inscription-form-container">
        <div class="form-header">
          <h2 class="form-title">Inscription</h2>
          <p class="form-subtitle">Rejoignez notre communauté</p>
        </div>

        <form @submit.prevent="handleRegister" class="inscription-form">
          <!-- Prénom et Nom -->
          <div class="name-row">
            <div class="input-group">
              <label for="firstName" class="input-label">Prénom</label>
              <div class="input-wrapper" :class="{ 'input-focused': isFirstNameFocused, 'input-error': firstNameError }">
                <UserIcon class="input-icon" />
                <input
                  id="firstName"
                  v-model="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  class="form-input"
                  @focus="isFirstNameFocused = true"
                  @blur="isFirstNameFocused = false; validateFirstName()"
                  required
                />
              </div>
              <span v-if="firstNameError" class="error-message">{{ firstNameError }}</span>
            </div>

            <div class="input-group">
              <label for="lastName" class="input-label">Nom</label>
              <div class="input-wrapper" :class="{ 'input-focused': isLastNameFocused, 'input-error': lastNameError }">
                <UserIcon class="input-icon" />
                <input
                  id="lastName"
                  v-model="lastName"
                  type="text"
                  placeholder="Votre nom"
                  class="form-input"
                  @focus="isLastNameFocused = true"
                  @blur="isLastNameFocused = false; validateLastName()"
                  required
                />
              </div>
              <span v-if="lastNameError" class="error-message">{{ lastNameError }}</span>
            </div>
          </div>

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
                placeholder="Minimum 6 caractères"
                class="form-input"
                @focus="isPasswordFocused = true"
                @blur="isPasswordFocused = false; validatePassword()"
                required
              />
            </div>
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          </div>

          <!-- Confirmation mot de passe -->
          <div class="input-group">
            <label for="confirmPassword" class="input-label">Confirmer le mot de passe</label>
            <div class="input-wrapper" :class="{ 'input-focused': isConfirmPasswordFocused, 'input-error': confirmPasswordError }">
              <LockIcon class="input-icon" />
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe"
                class="form-input"
                @focus="isConfirmPasswordFocused = true"
                @blur="isConfirmPasswordFocused = false; validateConfirmPassword()"
                required
              />
            </div>
            <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
          </div>

          <!-- Date de naissance (optionnel) -->
          <div class="input-group">
            <label for="birthDate" class="input-label">Date de naissance <span class="optional">(optionnel)</span></label>
            <div class="input-wrapper" :class="{ 'input-focused': isBirthDateFocused }">
              <CalendarIcon class="input-icon" />
              <input
                id="birthDate"
                v-model="birthDate"
                type="date"
                class="form-input"
                @focus="isBirthDateFocused = true"
                @blur="isBirthDateFocused = false"
              />
            </div>
          </div>

          <!-- Conditions d'utilisation -->
          <div class="terms-section">
            <label class="checkbox-container">
              <input v-model="acceptTerms" type="checkbox" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">
                J'accepte les 
                <router-link to="/conditions" class="terms-link">conditions d'utilisation</router-link>
                et la
                <router-link to="/confidentialite" class="terms-link">politique de confidentialité</router-link>
              </span>
            </label>
            <span v-if="termsError" class="error-message">{{ termsError }}</span>
          </div>

          <!-- Newsletter (optionnel) -->
          <div class="newsletter-section">
            <label class="checkbox-container">
              <input v-model="acceptNewsletter" type="checkbox" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">
                Je souhaite recevoir les actualités et promotions par email
              </span>
            </label>
          </div>

          <!-- Bouton d'inscription -->
          <button
            type="submit"
            :disabled="isLoading || !acceptTerms"
            class="submit-button"
            :class="{ 'loading': isLoading, 'disabled': !acceptTerms }"
          >
            <LoaderIcon v-if="isLoading" class="loading-icon" />
            <span v-else>Créer mon compte</span>
          </button>

          <!-- Message d'erreur global -->
          <div v-if="registerError" class="global-error">
            <AlertCircleIcon class="error-icon" />
            <span>{{ registerError }}</span>
          </div>

          <!-- Message de succès -->
          <div v-if="registerSuccess" class="global-success">
            <CheckCircleIcon class="success-icon" />
            <span>{{ registerSuccess }}</span>
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
            <span>S'inscrire avec Google</span>
          </button>
        </div>

        <!-- Lien connexion -->
        <div class="login-link">
          <span class="login-text">Déjà un compte ?</span>
          <router-link to="/connexion" class="login-button">
            Se connecter
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

const UserIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  `
}

const CalendarIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
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

const CheckCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  `
}

// État réactif
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const birthDate = ref('')
const acceptTerms = ref(false)
const acceptNewsletter = ref(false)

const isFirstNameFocused = ref(false)
const isLastNameFocused = ref(false)
const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)
const isConfirmPasswordFocused = ref(false)
const isBirthDateFocused = ref(false)
const isLoading = ref(false)

const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const termsError = ref('')
const registerError = ref('')
const registerSuccess = ref('')

// Fonctions de validation
const validateFirstName = () => {
  if (!firstName.value) {
    firstNameError.value = 'Prénom requis'
  } else if (firstName.value.length < 2) {
    firstNameError.value = 'Minimum 2 caractères'
  } else {
    firstNameError.value = ''
  }
}

const validateLastName = () => {
  if (!lastName.value) {
    lastNameError.value = 'Nom requis'
  } else if (lastName.value.length < 2) {
    lastNameError.value = 'Minimum 2 caractères'
  } else {
    lastNameError.value = ''
  }
}

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
  // Re-valider la confirmation si elle existe
  if (confirmPassword.value) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Confirmation requise'
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Les mots de passe ne correspondent pas'
  } else {
    confirmPasswordError.value = ''
  }
}

const validateTerms = () => {
  if (!acceptTerms.value) {
    termsError.value = 'Vous devez accepter les conditions'
  } else {
    termsError.value = ''
  }
}

const handleRegister = async () => {
  // Validation complète
  validateFirstName()
  validateLastName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  validateTerms()
  
  if (firstNameError.value || lastNameError.value || emailError.value || 
      passwordError.value || confirmPasswordError.value || termsError.value) {
    return
  }

  isLoading.value = true
  registerError.value = ''
  registerSuccess.value = ''

  try {
    // Simulation d'une requête d'inscription
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Ici vous ajouterez votre logique d'inscription
    console.log('Inscription:', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      birthDate: birthDate.value//,
      //acceptNewsletter: acceptNewsletter.value
    })
    
    registerSuccess.value = 'Compte créé avec succès ! Vérifiez votre email.'
    
    // Redirection après inscription réussie (après 2 secondes)
    setTimeout(() => {
      // this.$router.push('/connexion')
    }, 2000)
    
  } catch (error) {
    registerError.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Page principale */
.inscription-page {
  @apply min-h-screen bg-white relative overflow-hidden;
  @apply flex items-center justify-center py-12;
  padding-top: 80px; /* Hauteur de la navbar + marge */
}

/* Pattern de fond subtil */
.background-pattern {
  @apply absolute inset-0 opacity-5;
  background-image: radial-gradient(circle at 1px 1px, #000 1px, transparent 0);
  background-size: 20px 20px;
}

/* Container principal */
.inscription-container {
  @apply relative z-10 w-full max-w-lg mx-auto px-6;
}

/* Header avec logo */
.inscription-header {
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
.inscription-form-container {
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
.inscription-form {
  @apply space-y-5;
}

/* Ligne prénom/nom */
.name-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.input-group {
  @apply space-y-2;
}

.input-label {
  @apply block text-sm font-medium text-gray-300;
}

.optional {
  @apply text-gray-500 font-normal;
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
  @apply w-5 h-5 text-gray-400 ml-4 flex-shrink-0;
}

.form-input {
  @apply flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400;
  @apply px-4 py-3;
}

.error-message {
  @apply text-red-400 text-sm;
}

/* Sections spéciales */
.terms-section,
.newsletter-section {
  @apply space-y-2;
}

.checkbox-container {
  @apply flex items-start space-x-3 cursor-pointer;
}

.checkbox-input {
  @apply sr-only;
}

.checkbox-custom {
  @apply w-5 h-5 border-2 border-gray-400 rounded bg-gray-800 transition-all duration-200;
  @apply flex items-center justify-center flex-shrink-0 mt-0.5;
}

.checkbox-input:checked + .checkbox-custom {
  @apply bg-gradient-to-r from-orange-500 to-red-500 border-orange-500;
}

.checkbox-input:checked + .checkbox-custom::before {
  content: '✓';
  @apply text-white text-sm font-bold;
}

.checkbox-label {
  @apply text-gray-300 text-sm leading-relaxed;
}

.terms-link {
  @apply text-orange-400 hover:text-orange-300 transition-colors underline;
}

/* Bouton d'inscription */
.submit-button {
  @apply w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500;
  @apply text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600;
  @apply transition-all duration-300 transform hover:scale-105;
  @apply flex items-center justify-center space-x-2;
}

.submit-button:disabled,
.submit-button.disabled {
  @apply opacity-50 cursor-not-allowed transform-none;
}

.loading-icon {
  @apply w-5 h-5;
}

/* Messages globaux */
.global-error {
  @apply flex items-center space-x-2 bg-red-900/20 text-red-400 p-3 rounded-lg;
  @apply border border-red-700;
}

.global-success {
  @apply flex items-center space-x-2 bg-green-900/20 text-green-400 p-3 rounded-lg;
  @apply border border-green-700;
}

.error-icon,
.success-icon {
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

/* Lien connexion */
.login-link {
  @apply text-center mt-6 pt-6 border-t border-gray-700;
}

.login-text {
  @apply text-gray-400 text-sm;
}

.login-button {
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
  @apply w-64 h-64 -top-32 -left-32;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  @apply w-48 h-48 -bottom-24 -right-24;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  @apply w-32 h-32 top-1/3 -left-16;
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
  .inscription-container {
    @apply px-4;
  }
  
  .inscription-form-container {
    @apply p-6;
  }
  
  .name-row {
    @apply grid-cols-1;
  }
}
</style>