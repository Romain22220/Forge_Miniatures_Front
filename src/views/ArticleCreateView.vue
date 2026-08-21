<!-- src/views/admin/ArticleCreateView.vue -->
<template>
  <div :class="$style.formPage">
    <div :class="$style.container">
      <h1 :class="$style.title">Nouvel article</h1>

      <form :class="$style.form" @submit.prevent="handleSubmit">
        <div :class="$style.row">
          <div :class="$style.inputGroup">
            <label :class="$style.label">Nom</label>
            <input v-model="form.name" type="text" :class="$style.input" required />
          </div>
          <div :class="$style.inputGroup">
            <label :class="$style.label">Marque</label>
            <input v-model="form.marque" type="text" :class="$style.input" required />
          </div>
        </div>

        <div :class="$style.inputGroup">
          <label :class="$style.label">Description</label>
          <textarea v-model="form.description" :class="$style.textarea" rows="4"></textarea>
        </div>

        <div :class="$style.row">
          <div :class="$style.inputGroup">
            <label :class="$style.label">Prix (€)</label>
            <input v-model.number="form.price" type="number" step="0.01" min="0" :class="$style.input" required />
          </div>
          <div :class="$style.inputGroup">
            <label :class="$style.label">Quantité</label>
            <input v-model.number="form.quantite" type="number" min="0" :class="$style.input" required />
          </div>
        </div>

        <div :class="$style.row">
          <div :class="$style.inputGroup">
            <label :class="$style.label">Échelle</label>
            <select v-model.number="form.scaleId" :class="$style.select" required>
              <option value="" disabled>Choisir...</option>
              <option v-for="scale in scales" :key="scale.idt_scale" :value="scale.idt_scale">{{ scale.scale }}</option>
            </select>
          </div>
          <div :class="$style.inputGroup">
            <label :class="$style.label">Référence</label>
            <select v-model.number="form.referenceId" :class="$style.select" required>
              <option value="" disabled>Choisir...</option>
              <option v-for="ref in references" :key="ref.idt_reference" :value="ref.idt_reference">{{ ref.nom_reference }}</option>
            </select>
          </div>
        </div>

        <div v-if="errorMessage" :class="$style.globalError">{{ errorMessage }}</div>
        <div v-if="successMessage" :class="$style.globalSuccess">{{ successMessage }}</div>

        <div :class="$style.actions">
          <router-link to="/dashboard" :class="$style.cancelButton">Annuler</router-link>
          <button type="submit" :disabled="isSubmitting" :class="$style.submitButton">
            {{ isSubmitting ? 'Création...' : "Créer l'article" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import type { Article, Scale, Reference } from '@/types'

const router = useRouter()

const form = reactive<Partial<Article>>({
  name: '',
  marque: '',
  description: '',
  price: 0,
  quantite: 0,
  scaleId: undefined,
  referenceId: undefined,
})

const scales = ref<Scale[]>([])
const references = ref<Reference[]>([])
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  try {
    const [allScales, allReferences] = await Promise.all([
      apiService.getAllScales(),
      apiService.getAllReferences(),
    ])
    scales.value = allScales
    references.value = allReferences
  } catch (e) {
    console.error('Erreur chargement échelles/références:', e)
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const created = await apiService.createArticle(form)
    successMessage.value = 'Article créé avec succès !'
    setTimeout(() => {
      router.push(`/dashboard/articles/${created.id}/edit`)
    }, 1200)
  } catch (e) {
    const err = e as Error
    errorMessage.value = err.message || "Impossible de créer l'article."
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style module>
.formPage {
  width: 100%;
  min-height: calc(100vh - 72px);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  padding: 64px;
  box-sizing: border-box;
}

.container {
  max-width: 640px;
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-bg-elevated);
  padding: 32px;
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

.input,
.select,
.textarea {
  border-radius: 8px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-family: Roboto;
  font-size: 14px;
  padding: 8px 14px;
  box-sizing: border-box;
  outline: none;
}

.input:focus,
.select:focus,
.textarea:focus {
  border-color: var(--color-accent);
}

.textarea {
  resize: vertical;
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

.globalSuccess {
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  background-color: var(--color-accent-bg-hover);
  color: var(--color-accent);
  font-size: 13px;
  padding: 10px 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancelButton {
  border-radius: 8px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  text-decoration: none;
  font-family: Roboto;
  font-size: 14px;
  padding: 8px 18px;
  display: inline-flex;
  align-items: center;
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

@media (max-width: 640px) {
  .formPage {
    padding: 32px 24px;
  }

  .row {
    flex-direction: column;
    gap: 20px;
  }
}
</style>