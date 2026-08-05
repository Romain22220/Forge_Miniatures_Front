<!-- src/views/LoginView.vue -->
<template>
  <div :class="$style.loginPage">
    <div :class="$style.card">
      <div :class="$style.header">
        <h1 :class="$style.logoTitle">
          <span>Fabrik'</span><span :class="$style.accent">Miniatures</span>
        </h1>
        <p :class="$style.subtitle">Connectez-vous à votre espace</p>
      </div>

      <form :class="$style.form" @submit.prevent="handleLogin">
        <div :class="$style.inputGroup">
          <label for="email" :class="$style.label">Email</label>
          <div
            :class="[$style.inputWrapper, { [$style.inputFocused]: isEmailFocused, [$style.inputError]: emailError }]"
          >
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              :class="$style.input"
              @focus="isEmailFocused = true"
              @blur="isEmailFocused = false; validateEmail()"
              required
            />
          </div>
          <span v-if="emailError" :class="$style.errorMessage">{{ emailError }}</span>
        </div>

        <div :class="$style.inputGroup">
          <label for="password" :class="$style.label">Mot de passe</label>
          <div
            :class="[$style.inputWrapper, { [$style.inputFocused]: isPasswordFocused, [$style.inputError]: passwordError }]"
          >
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Votre mot de passe"
              :class="$style.input"
              @focus="isPasswordFocused = true"
              @blur="isPasswordFocused = false; validatePassword()"
              required
            />
            <button
              type="button"
              :class="$style.togglePassword"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            >
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="passwordError" :class="$style.errorMessage">{{ passwordError }}</span>
        </div>

        <div :class="$style.options">
          <label :class="$style.checkboxContainer">
            <input v-model="rememberMe" type="checkbox" />
            <span :class="$style.checkboxLabel">Se souvenir de moi</span>
          </label>
          <router-link to="/mot-de-passe-oublie" :class="$style.link">
            Mot de passe oublié ?
          </router-link>
        </div>

        <button type="submit" :disabled="isLoading" :class="$style.submitButton">
          {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>

        <div v-if="loginError" :class="$style.globalError">
          {{ loginError }}
        </div>
      </form>

      <div :class="$style.signupLink">
        <span>Pas encore de compte ?</span>
        <router-link to="/inscription" :class="$style.signupButton">S'inscrire</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/services/api'

const { isLoading, error: apiError, login } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)
const emailError = ref('')
const passwordError = ref('')
const loginError = ref('')

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
  } else if (password.value.length < 5) {
    passwordError.value = 'Minimum 5 caractères'
  } else {
    passwordError.value = ''
  }
}

const handleLogin = async () => {
  validateEmail()
  validatePassword()
  if (emailError.value || passwordError.value) return

  loginError.value = ''
  const result = await login(email.value, password.value, rememberMe.value)

  if (!result.success) {
    loginError.value = apiError.value || 'Email ou mot de passe incorrect'
  }
}
</script>

<style module>
.loginPage {
  width: 100%;
  min-height: calc(100vh - 72px); /* soustrait la hauteur de la Navbar */
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
  box-sizing: border-box;
}

.card {
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-bg-elevated);
  padding: 40px;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.logoTitle {
  font-size: 28px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 8px;
}

.accent {
  color: var(--color-accent);
}

.subtitle {
  font-size: 15px;
  line-height: 150%;
  color: var(--color-text-muted);
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inputGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  line-height: 150%;
  color: var(--color-text-muted);
}

.inputWrapper {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 2px solid var(--color-border);
  transition: border-color 0.2s;
}

.inputFocused {
  border-color: var(--color-accent);
}

.inputError {
  border-color: var(--color-error, #e57373);
}

.input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text);
  font-family: Roboto;
  font-size: 15px;
  padding: 10px 16px;
  box-sizing: border-box;
}

.input::placeholder {
  color: var(--color-text-subtle);
}

.togglePassword {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0 12px;
  line-height: 1;
}

.errorMessage {
  font-size: 13px;
  color: var(--color-error, #e57373);
}

.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  flex-wrap: wrap;
  gap: 8px;
}

.checkboxContainer {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkboxLabel {
  color: var(--color-text-muted);
}

.link {
  color: var(--color-accent);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.submitButton {
  border-radius: 8px;
  background-color: var(--color-accent);
  border: 2px solid var(--color-accent);
  color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submitButton:hover:not(:disabled) {
  opacity: 0.9;
}

.submitButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.globalError {
  border-radius: 8px;
  border: 1px solid var(--color-error, #e57373);
  background-color: var(--color-error-bg, rgba(229, 115, 115, 0.1));
  color: var(--color-error, #e57373);
  font-size: 13px;
  padding: 10px 16px;
  text-align: center;
}

.signupLink {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text-muted);
}

.signupButton {
  margin-left: 6px;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
}

.signupButton:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .loginPage {
    padding: 32px 24px;
  }

  .card {
    padding: 28px;
  }
}
</style>