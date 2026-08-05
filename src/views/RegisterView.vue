<!-- src/views/RegisterView.vue -->
<template>
  <div :class="$style.registerPage">
    <div :class="$style.card">
      <div :class="$style.header">
        <h1 :class="$style.logoTitle">
          <span>Fabrik'</span><span :class="$style.accent">Miniatures</span>
        </h1>
        <p :class="$style.subtitle">Créez votre compte collectionneur</p>
      </div>

      <div v-if="success" :class="$style.globalSuccess">
        {{ success }}
      </div>

      <form v-else :class="$style.form" @submit.prevent="handleRegister">
        <div :class="$style.row">
          <div :class="$style.inputGroup">
            <label for="name" :class="$style.label">Prénom</label>
            <div :class="[$style.inputWrapper, { [$style.inputError]: fieldError('name') }]">
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Jean"
                :class="$style.input"
                required
              />
            </div>
            <span v-if="fieldError('name')" :class="$style.errorMessage">{{ fieldError('name') }}</span>
          </div>

          <div :class="$style.inputGroup">
            <label for="lastName" :class="$style.label">Nom</label>
            <div :class="[$style.inputWrapper, { [$style.inputError]: fieldError('lastName') }]">
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                placeholder="Dupont"
                :class="$style.input"
                required
              />
            </div>
            <span v-if="fieldError('lastName')" :class="$style.errorMessage">{{ fieldError('lastName') }}</span>
          </div>
        </div>

        <div :class="$style.inputGroup">
          <label for="pseudo" :class="$style.label">Pseudo</label>
          <div :class="[$style.inputWrapper, { [$style.inputError]: fieldError('pseudo') }]">
            <input
              id="pseudo"
              v-model="form.pseudo"
              type="text"
              placeholder="jdupont43"
              :class="$style.input"
              required
            />
          </div>
          <span v-if="fieldError('pseudo')" :class="$style.errorMessage">{{ fieldError('pseudo') }}</span>
        </div>

        <div :class="$style.inputGroup">
          <label for="email" :class="$style.label">Email</label>
          <div
            :class="[$style.inputWrapper, { [$style.inputFocused]: isEmailFocused, [$style.inputError]: emailError || fieldError('email') }]"
          >
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="votre@email.com"
              :class="$style.input"
              @focus="isEmailFocused = true"
              @blur="isEmailFocused = false; validateEmail()"
              required
            />
          </div>
          <span v-if="emailError || fieldError('email')" :class="$style.errorMessage">
            {{ emailError || fieldError('email') }}
          </span>
        </div>

        <div :class="$style.inputGroup">
          <label for="address" :class="$style.label">Adresse</label>
          <div :class="[$style.inputWrapper, { [$style.inputError]: fieldError('address') }]">
            <input
              id="address"
              v-model="form.address"
              type="text"
              placeholder="12 rue des Miniatures, 75000 Paris"
              :class="$style.input"
              required
            />
          </div>
          <span v-if="fieldError('address')" :class="$style.errorMessage">{{ fieldError('address') }}</span>
        </div>

        <div :class="$style.row">
          <div :class="$style.inputGroup">
            <label for="phoneNumber" :class="$style.label">Téléphone <span :class="$style.optional">(optionnel)</span></label>
            <div :class="$style.inputWrapper">
              <input
                id="phoneNumber"
                v-model="form.phoneNumber"
                type="tel"
                placeholder="06 12 34 56 78"
                :class="$style.input"
              />
            </div>
          </div>

          <div :class="$style.inputGroup">
            <label for="birthday" :class="$style.label">Naissance <span :class="$style.optional">(optionnel)</span></label>
            <div :class="$style.inputWrapper">
              <input
                id="birthday"
                v-model="form.birthday"
                type="date"
                :class="$style.input"
              />
            </div>
          </div>
        </div>

        <div :class="$style.inputGroup">
          <label for="password" :class="$style.label">Mot de passe</label>
          <div
            :class="[$style.inputWrapper, { [$style.inputFocused]: isPasswordFocused, [$style.inputError]: passwordError || fieldError('password') }]"
          >
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="8 caractères minimum"
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
          <span v-if="passwordError || fieldError('password')" :class="$style.errorMessage">
            {{ passwordError || fieldError('password') }}
          </span>
        </div>

        <button type="submit" :disabled="isLoading" :class="$style.submitButton">
          {{ isLoading ? 'Création en cours...' : 'Créer mon compte' }}
        </button>

        <div v-if="error && !hasFieldErrors" :class="$style.globalError">
          {{ error }}
        </div>
      </form>

      <div v-if="!success" :class="$style.loginLink">
        <span>Déjà un compte ?</span>
        <router-link to="/connexion" :class="$style.loginButton">Se connecter</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useAuth } from '@/services/api'
import type { UserRegistrationData } from '@/services/api'

const { isLoading, error, success, validationErrors, register } = useAuth()

const form = reactive<UserRegistrationData>({
  name: '',
  lastName: '',
  pseudo: '',
  email: '',
  address: '',
  password: '',
  phoneNumber: '',
  birthday: null,
})

const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    emailError.value = 'Email requis'
  } else if (!emailRegex.test(form.email)) {
    emailError.value = 'Format email invalide'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    passwordError.value = 'Mot de passe requis'
  } else if (form.password.length < 8) {
    passwordError.value = 'Minimum 8 caractères'
  } else {
    passwordError.value = ''
  }
}

// Erreurs de validation renvoyées par le back (champ par champ)
const fieldError = (field: string) => validationErrors.value?.[field] || ''
const hasFieldErrors = computed(() => !!validationErrors.value)

const handleRegister = async () => {
  validateEmail()
  validatePassword()
  if (emailError.value || passwordError.value) return

  await register({ ...form })
}
</script>

<style module>
.registerPage {
  width: 100%;
  min-height: calc(100vh - 72px);
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
  max-width: 520px;
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
  gap: 18px;
}

.row {
  display: flex;
  gap: 16px;
}

.row .inputGroup {
  flex: 1;
  min-width: 0;
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

.optional {
  font-size: 12px;
  color: var(--color-text-subtle);
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
  margin-top: 8px;
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

.globalSuccess {
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  background-color: var(--color-accent-bg-hover);
  color: var(--color-accent);
  font-size: 14px;
  padding: 16px;
  text-align: center;
}

.loginLink {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text-muted);
}

.loginButton {
  margin-left: 6px;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
}

.loginButton:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .registerPage {
    padding: 32px 24px;
  }

  .card {
    padding: 28px;
  }

  .row {
    flex-direction: column;
    gap: 18px;
  }
}
</style>