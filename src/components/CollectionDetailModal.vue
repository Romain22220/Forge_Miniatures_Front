<!-- src/components/CollectionDetailModal.vue -->
<template>
  <Teleport to="body">
    <div :class="$style.overlay" @click.self="$emit('close')">
      <div :class="$style.modal" role="dialog" aria-modal="true">
        <div :class="$style.header">
          <div>
            <h2 :class="$style.title">{{ localCollection.name }}</h2>
            <p :class="$style.subtitle">
              {{ localCollection.articleCount ?? 0 }} article{{ (localCollection.articleCount ?? 0) > 1 ? 's' : '' }} ·
              {{ (localCollection.totalCollectionPrice ?? 0).toFixed(2) }}€
            </p>
          </div>
          <div :class="$style.headerActions">
            <button
              type="button"
              :class="$style.deleteButton"
              :disabled="isDeleting"
              aria-label="Supprimer la collection"
              @click="showDeleteConfirm = true"
            >
              🗑 Supprimer
            </button>
            <button type="button" :class="$style.closeButton" aria-label="Fermer" @click="$emit('close')">
              ✕
            </button>
          </div>
        </div>

        <!-- Confirmation avant suppression définitive -->
        <div v-if="showDeleteConfirm" :class="$style.confirmOverlay" @click.self="showDeleteConfirm = false">
          <div :class="$style.confirmBox">
            <p :class="$style.confirmText">
              Supprimer définitivement la collection « {{ localCollection.name }} » ?
              Cette action est irréversible.
            </p>
            <div :class="$style.confirmActions">
              <button type="button" :class="$style.cancelButton" @click="showDeleteConfirm = false">
                Annuler
              </button>
              <button type="button" :class="$style.confirmDeleteButton" :disabled="isDeleting" @click="handleDeleteCollection">
                {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
              </button>
            </div>
          </div>
</div>

        <div :class="$style.body">
          <div v-if="isLoading" :class="$style.stateMessage">Chargement des articles...</div>
          <div v-else-if="loadError" :class="$style.stateMessage">{{ loadError }}</div>
          <div v-else-if="articlesWithQuantity.length === 0" :class="$style.stateMessage">
            Cette collection ne contient aucun article pour le moment.
          </div>

          <ul v-else :class="$style.itemList">
            <li v-for="entry in articlesWithQuantity" :key="entry.article.id" :class="$style.item">
              <div :class="$style.itemImageWrapper">
                <img
                  v-if="entry.article.images && entry.article.images.length"
                  :src="resolveImageUrl(entry.article.images[0])"
                  :alt="entry.article.name"
                  :class="$style.itemImage"
                />
                <div v-else :class="$style.itemImagePlaceholder">—</div>
              </div>

              <div :class="$style.itemInfo">
                <p v-if="entry.article.marque" :class="$style.itemBrand">{{ entry.article.marque }}</p>
                <router-link
                  :to="`/produit/${entry.article.id}`"
                  :class="$style.itemName"
                  @click="$emit('close')"
                >
                  {{ entry.article.name }}
                </router-link>
              </div>

              <div :class="$style.itemQuantity">×{{ entry.quantity }}</div>
              <div :class="$style.itemPrice">{{ (entry.article.price * entry.quantity).toFixed(2) }}€</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'
import type { Article } from '@/types'

const props = defineProps<{ collection: CollectionDTO }>()

interface ArticleWithQuantity {
  article: Article
  quantity: number
}

interface CollectionDTO {
  id: number
  name: string
  articleCount: number
  totalCollectionPrice: number
  items?: CollectionItem[]
  userId: number
  collectionType: string
}

interface CollectionItem {
  articleId: number
  quantity: number
}

const articlesWithQuantity = ref<ArticleWithQuantity[]>([])
const isLoading = ref(true)
const loadError = ref('')

const IMAGE_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api').replace(
  /\/api\/?$/,
  '',
)

const resolveImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${IMAGE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

onMounted(async () => {
  try {
    const items = (props.collection.items || []) as CollectionItem[]
    // Récupère chaque article en parallèle plutôt qu'en séquentiel
    const results = await Promise.all(
      items.map(async (item) => {
        const article = await apiService.getArticleById(item.articleId)
        return { article, quantity: item.quantity }
      }),
    )
    articlesWithQuantity.value = results
  } catch (e) {
    console.error('Erreur chargement des articles de la collection:', e)
    loadError.value = 'Impossible de charger les articles de cette collection.'
  } finally {
    isLoading.value = false
  }
})

const emit = defineEmits<{ close: []; deleted: [collectionId: number] }>()

const localCollection = ref(props.collection)
const errorMessage = ref('')
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const handleDeleteCollection = async () => {
  isDeleting.value = true
  errorMessage.value = ''
  try {
    await apiService.deleteCollection({
      ...localCollection.value,
      items: localCollection.value.items ?? []
    })
    emit('deleted', localCollection.value.id)
    emit('close')
  } catch (e) {
    const err = e as Error
    errorMessage.value = err.message || 'Impossible de supprimer cette collection.'
    showDeleteConfirm.value = false
  } finally {
    isDeleting.value = false
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
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  font-family: Roboto;
  color: var(--color-text);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  gap: 16px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px;
}

.subtitle {
  font-size: 13px;
  color: var(--color-text-subtle);
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
  flex-shrink: 0;
}

.closeButton:hover {
  color: var(--color-text);
}

.body {
  overflow-y: auto;
  padding: 16px 24px 24px;
}

.stateMessage {
  color: var(--color-text-muted);
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
}

.itemList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.itemImageWrapper {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--color-bg-hover);
  flex-shrink: 0;
}

.itemImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.itemImagePlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-subtle);
  font-size: 12px;
}

.itemInfo {
  flex: 1;
  min-width: 0;
}

.itemBrand {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-accent);
  margin: 0 0 2px;
}

.itemName {
  font-size: 14px;
  color: var(--color-text);
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.itemName:hover {
  color: var(--color-accent);
}

.itemQuantity {
  font-size: 13px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.itemPrice {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
  flex-shrink: 0;
  white-space: nowrap;
}

.headerActions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.deleteButton {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-error, #e57373);
  font-family: Roboto;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.deleteButton:hover:not(:disabled) {
  border-color: var(--color-error, #e57373);
  background-color: var(--color-error-bg, rgba(229, 115, 115, 0.1));
}

.deleteButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirmOverlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1200;
}

.confirmBox {
  width: 100%;
  max-width: 360px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  font-family: Roboto;
  color: var(--color-text);
}

.confirmText {
  font-size: 14px;
  line-height: 160%;
  margin: 0 0 20px;
}

.confirmActions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirmDeleteButton {
  border-radius: 8px;
  border: 2px solid var(--color-error, #e57373);
  background-color: var(--color-error, #e57373);
  color: #fff;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 18px;
  cursor: pointer;
}

.confirmDeleteButton:hover:not(:disabled) {
  opacity: 0.9;
}

.confirmDeleteButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>