<!-- src/views/ProductView.vue -->
<template>
  <div :class="$style.productPage">
    <div :class="$style.container">
      <p :class="$style.breadcrumb">
        <router-link to="/" :class="$style.breadcrumbLink">Accueil</router-link>
        <span> / </span>
        <router-link
          v-if="article?.typeName"
          :to="`/categorie/${route.params.type || ''}`"
          :class="$style.breadcrumbLink"
        >
          {{ article.typeName }}
        </router-link>
        <span v-if="article"> / </span>
        <span v-if="article">{{ article.name }}</span>
      </p>

      <div v-if="isLoading" :class="$style.stateMessage">Chargement du produit...</div>
      <div v-else-if="loadError" :class="$style.stateMessage">{{ loadError }}</div>

      <div v-else-if="article" :class="$style.layout">
        <!-- GALERIE -->
        <div :class="$style.gallery">
          <div :class="$style.mainImageWrapper">
            <img
              v-if="selectedImage"
              :src="selectedImage"
              :alt="article.name"
              :class="$style.mainImage"
            />
            <div v-else :class="$style.imagePlaceholder">Pas d'image</div>

            <span
              v-if="article.statutName"
              :class="[$style.statusBadge, statusBadgeClass(article.statutName)]"
            >
              {{ article.statutName }}
            </span>
          </div>

          <div v-if="article.images && article.images.length > 1" :class="$style.thumbnails">
            <button
              v-for="(img, index) in article.images"
              :key="index"
              type="button"
              :class="[$style.thumbnail, { [$style.thumbnailActive]: resolveImageUrl(img) === selectedImage }]"
              @click="selectedImage = resolveImageUrl(img)"
            >
              <img :src="resolveImageUrl(img)" :alt="`${article.name} - vue ${index + 1}`" />
            </button>
          </div>
        </div>

        <!-- INFOS -->
        <div :class="$style.info">
          <p v-if="article.marque" :class="$style.brand">{{ article.marque }}</p>
          <h1 :class="$style.title">{{ article.name }}</h1>

          <div :class="$style.metaRow">
            <span v-if="article.referenceName" :class="$style.metaTag">
              Réf. {{ article.referenceName }}
            </span>
            <span v-if="article.scaleName" :class="$style.metaTag">{{ article.scaleName }}</span>
          </div>

          <p :class="$style.price">{{ article.price }}€</p>

          <p v-if="article.description" :class="$style.description">{{ article.description }}</p>

          <div :class="$style.stockRow">
            <span
              v-if="article.quantite > 0"
              :class="[$style.stockDot, $style.stockAvailable]"
            ></span>
            <span v-else :class="[$style.stockDot, $style.stockOut]"></span>
            <span :class="$style.stockText">
              {{ article.quantite > 0 ? `${article.quantite} en stock` : 'Rupture de stock' }}
            </span>
          </div>

          <div :class="$style.quantityRow">
            <label for="quantity" :class="$style.quantityLabel">Quantité</label>
            <div :class="$style.quantityControls">
              <button type="button" :class="$style.quantityButton" @click="decrementQuantity">
                −
              </button>
              <input
                id="quantity"
                v-model.number="selectedQuantity"
                type="number"
                min="1"
                :max="article.quantite"
                :class="$style.quantityInput"
              />
              <button type="button" :class="$style.quantityButton" @click="incrementQuantity">
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            :class="$style.addButton"
            :disabled="article.quantite <= 0"
            @click="handleAddToCart"
          >
            {{ article.quantite > 0 ? 'Ajouter au panier' : 'Indisponible' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/services/api'
import type { Article } from '@/types'

const route = useRoute()

const article = ref<Article | null>(null)
const isLoading = ref(true)
const loadError = ref('')
const selectedImage = ref('')
const selectedQuantity = ref(1)

const IMAGE_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api').replace(
  /\/api\/?$/,
  '',
)

const resolveImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${IMAGE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const statusBadgeClass = (statut: string) => {
  const normalized = statut.toLowerCase()
  if (normalized.includes('précommande') || normalized.includes('precommande')) return 'statusPreorder'
  if (normalized.includes('non disponible') || normalized.includes('rupture')) return 'statusUnavailable'
  return 'statusAvailable'
}

const incrementQuantity = () => {
  if (article.value && selectedQuantity.value < article.value.quantite) {
    selectedQuantity.value++
  }
}

const decrementQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--
  }
}

const handleAddToCart = () => {
  // À brancher sur ton futur store panier / endpoint collection
  console.log('Ajout au panier :', article.value?.id, 'quantité:', selectedQuantity.value)
}

const loadArticle = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const id = Number(route.params.id)
    article.value = await apiService.getArticleById(id)
    selectedQuantity.value = 1
    if (article.value.images && article.value.images.length > 0) {
      selectedImage.value = resolveImageUrl(article.value.images[0])
    } else {
      selectedImage.value = ''
    }
  } catch (e) {
    console.error('Erreur chargement produit:', e)
    loadError.value = "Impossible de charger ce produit. Il n'existe peut-être plus."
  } finally {
    isLoading.value = false
  }
}

onMounted(loadArticle)
watch(() => route.params.id, loadArticle)
</script>

<style module>
.productPage {
  width: 100%;
  min-height: calc(100vh - 72px);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  padding: 64px;
  box-sizing: border-box;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.breadcrumb {
  font-size: 13px;
  color: var(--color-text-subtle);
  margin: 0 0 32px;
}

.breadcrumbLink {
  color: var(--color-text-subtle);
  text-decoration: none;
}

.breadcrumbLink:hover {
  color: var(--color-accent);
}

.stateMessage {
  color: var(--color-text-muted);
  font-size: 15px;
  padding: 40px 0;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

/* ---------- GALERIE ---------- */
.gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mainImageWrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-elevated);
}

.mainImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imagePlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-subtle);
  font-size: 14px;
}

.statusBadge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.statusAvailable {
  background-color: rgba(76, 175, 80, 0.85);
  color: #fff;
}

.statusPreorder {
  background-color: rgba(217, 166, 91, 0.9);
  color: #1a1a1a;
}

.statusUnavailable {
  background-color: rgba(120, 120, 120, 0.85);
  color: #fff;
}

.thumbnails {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.thumbnail {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--color-border);
  background: none;
  padding: 0;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnailActive {
  border-color: var(--color-accent);
}

/* ---------- INFOS ---------- */
.info {
  display: flex;
  flex-direction: column;
}

.brand {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  margin: 0 0 8px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 16px;
}

.metaRow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.metaTag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0 0 20px;
}

.description {
  font-size: 14px;
  line-height: 170%;
  color: var(--color-text-muted);
  margin: 0 0 24px;
}

.stockRow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.stockDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stockAvailable {
  background-color: #4caf50;
}

.stockOut {
  background-color: #999;
}

.stockText {
  font-size: 13px;
  color: var(--color-text-muted);
}

.quantityRow {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.quantityLabel {
  font-size: 14px;
  color: var(--color-text-muted);
}

.quantityControls {
  display: flex;
  align-items: center;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.quantityButton {
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 18px;
  cursor: pointer;
}

.quantityButton:hover {
  background-color: var(--color-bg-hover);
}

.quantityInput {
  width: 48px;
  height: 36px;
  text-align: center;
  background: transparent;
  border: none;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: Roboto;
  font-size: 14px;
  -moz-appearance: textfield;
}

.quantityInput::-webkit-outer-spin-button,
.quantityInput::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.addButton {
  border-radius: 8px;
  background-color: var(--color-accent);
  border: 2px solid var(--color-accent);
  color: #fff;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 24px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.addButton:hover:not(:disabled) {
  opacity: 0.9;
}

.addButton:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .productPage {
    padding: 32px 24px;
  }
}
</style>