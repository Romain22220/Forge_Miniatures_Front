<!-- src/components/CreateCollectionModal.vue -->
<template>
  <Teleport to="body">
    <div :class="$style.overlay" @click.self="$emit('close')">
      <div :class="$style.modal" role="dialog" aria-modal="true">
        <div :class="$style.header">
          <h2 :class="$style.title">Créer une collection</h2>
          <button type="button" :class="$style.closeButton" aria-label="Fermer" @click="$emit('close')">
            ✕
          </button>
        </div>

        <form :class="$style.form" @submit.prevent="handleSubmit">
          <div :class="$style.inputGroup">
            <label for="collection-name" :class="$style.label">Nom de la collection</label>
            <input
              id="collection-name"
              v-model="name"
              type="text"
              placeholder="Ma collection WRC"
              :class="$style.input"
              required
              maxlength="60"
            />
          </div>

          <div :class="$style.inputGroup">
            <label for="collection-type" :class="$style.label">Type de collection</label>
            <select id="collection-type" v-model="collectionType" :class="$style.select" required>
              <option value="OWNED">Possédée</option>
              <option value="WISHLIST">Liste de souhaits</option>
              <option value="RESERVED">Réservée</option>
            </select>
          </div>

          <div v-if="errorMessage" :class="$style.globalError">{{ errorMessage }}</div>

          <div :class="$style.actions">
            <button type="button" :class="$style.cancelButton" @click="$emit('close')">
              Annuler
            </button>
            <button type="submit" :disabled="isSubmitting" :class="$style.submitButton">
              {{ isSubmitting ? 'Création...' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiService } from '@/services/api'

const emit = defineEmits<{
  close: []
  created: [collection: Awaited<ReturnType<typeof apiService.createCollection>>]
}>()

type CollectionType = 'OWNED' | 'WISHLIST' | 'RESERVED'

const name = ref('')
const collectionType = ref<CollectionType>('OWNED')
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const created = await apiService.createCollection({
      name: name.value.trim(),
      type: collectionType.value,
    })
    emit('created', created)
  } catch (e) {
    const err = e as Error
    errorMessage.value = err.message || 'Impossible de créer la collection.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style module>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 420px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  font-family: Roboto;
  color: var(--color-text);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.closeButton {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
}

.closeButton:hover {
  color: var(--color-text);
}

.form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.input,
.select {
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

.input:focus,
.select:focus {
  border-color: var(--color-accent);
}

.select option {
  background-color: var(--color-bg-elevated);
  color: var(--color-text);
}

.globalError {
  border-radius: 8px;
  border: 1px solid var(--color-error, #e57373);
  background-color: var(--color-error-bg, rgba(229, 115, 115, 0.1));
  color: var(--color-error, #e57373);
  font-size: 13px;
  padding: 10px 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
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

.submitButton {
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

.submitButton:hover:not(:disabled) {
  opacity: 0.9;
}

.submitButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>