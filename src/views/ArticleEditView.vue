<!-- src/views/admin/ArticleEditView.vue -->
<template>
  <div :class="$style.formPage">
    <div :class="$style.container">
      <h1 :class="$style.title">Modifier l'article</h1>

      <div v-if="isLoading" :class="$style.stateMessage">Chargement...</div>

      <form v-else :class="$style.form" @submit.prevent="handleSubmit">
        <!-- mêmes champs que ArticleCreateView -->
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
              <option v-for="scale in scales" :key="scale.idt_scale" :value="scale.idt_scale">{{ scale.scale }}</option>
            </select>
          </div>
          <div :class="$style.inputGroup">
            <label :class="$style.label">Référence</label>
            <select v-model.number="form.referenceId" :class="$style.select" required>
              <option v-for="ref in references" :key="ref.idt_reference" :value="ref.idt_reference">{{ ref.nom_reference }}</option>
            </select>
          </div>
        </div>

        <div v-if="errorMessage" :class="$style.globalError">{{ errorMessage }}</div>
        <div v-if="successMessage" :class="$style.globalSuccess">{{ successMessage }}</div>

        <div :class="$style.actions">
          <button type="button" :class="$style.deleteButton" @click="handleDelete">
            Supprimer l'article
          </button>
          <div :class="$style.rightActions">
            <router-link to="/dashboard" :class="$style.cancelButton">Annuler</router-link>
            <button type="submit" :disabled="isSubmitting" :class="$style.submitButton">
              {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import type { Article, Scale, Reference } from '@/types'

const route = useRoute()
const router = useRouter()

const form = reactive<Partial<Article>>({})
const scales = ref<Scale[]>([])
const references = ref<Reference[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    const [article, allScales, allReferences] = await Promise.all([
      apiService.getArticleById(id),
      apiService.getAllScales(),
      apiService.getAllReferences(),
    ])
    Object.assign(form, article)
    scales.value = allScales
    references.value = allReferences
  } catch (e) {
    console.error('Erreur chargement article:', e)
    errorMessage.value = "Impossible de charger cet article."
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  /*try {
    // ⚠️ Suppose un endpoint PUT /api/articles/{id}/update à créer côté back.
    // apiService.updateArticle() n'existe pas encore dans api.ts, à ajouter :
    // async updateArticle(id: number, article: Partial<Article>): Promise<Article> {
    //   return this.request<Article>(`/articles/${id}/update`, {
    //     method: 'PUT',
    //     body: JSON.stringify(article),
    //   })
    // }
    await apiService.updateArticle(Number(route.params.id), form)
    successMessage.value = 'Article mis à jour avec succès !'
  } catch (e) {
    const err = e as Error
    errorMessage.value = err.message || 'Impossible de mettre à jour cet article.'
  } finally {
    isSubmitting.value = false
  }*/
}

const handleDelete = async () => {
  if (!confirm('Supprimer définitivement cet article ?')) return
  try {
    await apiService.deleteArticle(Number(route.params.id))
    router.push('/dashboard')
  } catch (e) {
    const err = e as Error
    errorMessage.value = err.message || "Impossible de supprimer cet article."
  }
}
</script>

<style module>
/* Styles identiques à ArticleCreateView.vue, + ces ajouts : */

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

.stateMessage {
  color: var(--color-text-muted);
  font-size: 15px;
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.rightActions {
  display: flex;
  gap: 12px;
}

.deleteButton {
  background: transparent;
  border: 1px solid var(--color-error, #e57373);
  color: var(--color-error, #e57373);
  font-family: Roboto;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.deleteButton:hover {
  background-color: var(--color-error-bg, rgba(229, 115, 115, 0.1));
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

.submitButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>