<!-- src/views/ProfileView.vue -->
<template>
  <div :class="$style.profilePage">
    <div :class="$style.container">
      <h1 :class="$style.title">Mon profil</h1>

      <div v-if="!user" :class="$style.stateMessage">Chargement de votre profil...</div>

      <template v-else>
        <section :class="$style.card">
          <div :class="$style.sectionHeader">
            <h2 :class="$style.sectionTitle">Informations personnelles</h2>
            <button
              v-if="!isEditing"
              type="button"
              :class="$style.editButton"
              @click="startEditing"
            >
              Modifier mes informations
            </button>
          </div>

          <!-- MODE LECTURE -->
          <div v-if="!isEditing" :class="$style.infoGrid">
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Prénom</span>
              <span :class="$style.infoValue">{{ user.name }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Nom</span>
              <span :class="$style.infoValue">{{ user.lastName }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Pseudo</span>
              <span :class="$style.infoValue">{{ user.pseudo }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Email</span>
              <span :class="$style.infoValue">{{ user.email }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Téléphone</span>
              <span :class="$style.infoValue">{{ user.phoneNumber || '—' }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Adresse</span>
              <span :class="$style.infoValue">{{ user.address }}</span>
            </div>
            <div :class="$style.infoItem">
              <span :class="$style.infoLabel">Date de naissance</span>
              <span :class="$style.infoValue">{{ formatDate(user.birthday) }}</span>
            </div>
          </div>

          <!-- MODE ÉDITION -->
          <form v-else :class="$style.form" @submit.prevent="handleSave">
            <div :class="$style.row">
              <div :class="$style.inputGroup">
                <label for="edit-prenom" :class="$style.label">Prénom</label>
                <input
                  id="edit-prenom"
                  v-model="editForm.prenom"
                  type="text"
                  :class="$style.input"
                  required
                />
              </div>
              <div :class="$style.inputGroup">
                <label for="edit-nom" :class="$style.label">Nom</label>
                <input
                  id="edit-nom"
                  v-model="editForm.nom"
                  type="text"
                  :class="$style.input"
                  required
                />
              </div>
            </div>

            <div :class="$style.inputGroup">
              <label for="edit-pseudo" :class="$style.label">Pseudo</label>
              <input
                id="edit-pseudo"
                v-model="editForm.pseudo"
                type="text"
                :class="$style.input"
                required
              />
            </div>

            <div :class="$style.inputGroup">
              <label for="edit-email" :class="$style.label">Email</label>
              <input
                id="edit-email"
                v-model="editForm.email"
                type="email"
                :class="$style.input"
                required
              />
            </div>

            <div :class="$style.inputGroup">
              <label for="edit-address" :class="$style.label">Adresse</label>
              <input
                id="edit-address"
                v-model="editForm.address"
                type="text"
                :class="$style.input"
                required
              />
            </div>

            <div :class="$style.row">
              <div :class="$style.inputGroup">
                <label for="edit-phone" :class="$style.label">Téléphone</label>
                <input
                  id="edit-phone"
                  v-model="editForm.phoneNumber"
                  type="tel"
                  :class="$style.input"
                />
              </div>
              <div :class="$style.inputGroup">
                <label for="edit-birthday" :class="$style.label">Date de naissance</label>
                <input
                  id="edit-birthday"
                  v-model="editForm.birthday"
                  type="date"
                  :class="$style.input"
                />
              </div>
            </div>

            <div v-if="error" :class="$style.globalError">{{ error }}</div>
            <div v-if="success" :class="$style.globalSuccess">{{ success }}</div>

            <div :class="$style.formActions">
              <button type="button" :class="$style.cancelButton" @click="cancelEditing">
                Annuler
              </button>
              <button type="submit" :disabled="isLoading" :class="$style.saveButton">
                {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </section>

        <section :class="$style.card">
          <h2 :class="$style.sectionTitle">Mes commandes</h2>
          <p :class="$style.emptyState">
            Aucune commande pour le moment. (À brancher sur un futur endpoint commandes)
          </p>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth } from '@/services/api'
import type { UpdateUserData } from '@/services/api'

const { user, isLoading, error, success, updateProfile } = useAuth()

const isEditing = ref(false)

const editForm = reactive<UpdateUserData>({
  prenom: '',
  nom: '',
  pseudo: '',
  email: '',
  address: '',
  phoneNumber: '',
  birthday: null,
})

const formatDate = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR')
}

const startEditing = () => {
  if (!user.value) return
  editForm.prenom = user.value.name
  editForm.nom = user.value.lastName
  editForm.pseudo = user.value.pseudo
  editForm.email = user.value.email
  editForm.address = user.value.address
  editForm.phoneNumber = user.value.phoneNumber || ''
  editForm.birthday = user.value.birthday || null
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const handleSave = async () => {
  const result = await updateProfile({ ...editForm })
  if (result.success) {
    setTimeout(() => {
      isEditing.value = false
    }, 1200)
  }
}
</script>

<style module>
.profilePage {
  width: 100%;
  min-height: calc(100vh - 72px);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  padding: 64px;
  box-sizing: border-box;
}

.container {
  max-width: 720px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 32px;
}

.stateMessage {
  color: var(--color-text-muted);
  font-size: 16px;
}

.card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-bg-elevated);
  padding: 32px;
  margin-bottom: 24px;
}

.sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sectionTitle {
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin: 0;
}

.infoGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.infoItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.infoLabel {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-subtle);
}

.infoValue {
  font-size: 15px;
  color: var(--color-text);
}

.editButton {
  border-radius: 8px;
  border: 2px solid var(--color-accent);
  background-color: transparent;
  color: var(--color-accent);
  font-family: Roboto;
  font-size: 14px;
  padding: 8px 20px;
  cursor: pointer;
  white-space: nowrap;
}

.editButton:hover {
  background-color: var(--color-accent-bg-hover);
}

.emptyState {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 0;
}

/* ---------- FORM ÉDITION ---------- */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  gap: 6px;
}

.label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.input {
  border-radius: 8px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-family: Roboto;
  font-size: 14px;
  padding: 8px 14px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--color-accent);
}

.globalError {
  border-radius: 8px;
  border: 1px solid var(--color-error, #e57373);
  background-color: var(--color-error-bg, rgba(229, 115, 115, 0.1));
  color: var(--color-error, #e57373);
  font-size: 13px;
  padding: 10px 14px;
}

.globalSuccess {
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  background-color: var(--color-accent-bg-hover);
  color: var(--color-accent);
  font-size: 13px;
  padding: 10px 14px;
}

.formActions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancelButton {
  border-radius: 8px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-family: Roboto;
  font-size: 14px;
  padding: 8px 18px;
  cursor: pointer;
}

.cancelButton:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.saveButton {
  border-radius: 8px;
  border: 2px solid var(--color-accent);
  background-color: var(--color-accent);
  color: #fff;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 18px;
  cursor: pointer;
}

.saveButton:hover:not(:disabled) {
  opacity: 0.9;
}

.saveButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .profilePage {
    padding: 32px 24px;
  }

  .infoGrid {
    grid-template-columns: 1fr;
  }

  .row {
    flex-direction: column;
    gap: 16px;
  }
}
</style>