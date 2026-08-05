<!-- src/views/CategoryView.vue -->
<template>
  <div :class="$style.categoryPage">
    <div :class="$style.container">
      <p :class="$style.breadcrumb">
        <router-link to="/" :class="$style.breadcrumbLink">Accueil</router-link>
        <span> / </span>
        <span>{{ categoryLabel }}</span>
      </p>

      <h1 :class="$style.title">{{ categoryLabel }}</h1>
      <p v-if="!isLoading && !loadError" :class="$style.count">
        {{ articles.length }} article{{ articles.length > 1 ? 's' : '' }}
      </p>

      <div v-if="isLoading" :class="$style.stateMessage">Chargement des articles...</div>
      <div v-else-if="loadError" :class="$style.stateMessage">{{ loadError }}</div>
      <div v-else-if="articles.length === 0" :class="$style.stateMessage">
        Aucun article disponible dans cette catégorie pour le moment.
      </div>

      <div v-else :class="$style.grid">
        <router-link
            v-for="article in articles"
            :key="article.id"
            :to="`/produit/${article.id}`"
            :class="$style.card"
            >
          <div :class="$style.imageWrapper">
            <img
              v-if="article.images && article.images.length"
              :src="resolveImageUrl(article.images[0])"
              :alt="article.name"
              :class="$style.image"
            />
            <div v-else :class="$style.imagePlaceholder">Pas d'image</div>

            <span
              v-if="article.statutName"
              :class="[$style.statusBadge, statusBadgeClass(article.statutName)]"
            >
              {{ article.statutName }}
            </span>
          </div>

          <div :class="$style.cardBody">
            <p v-if="article.marque" :class="$style.cardBrand">{{ article.marque }}</p>
            <h3 :class="$style.cardName">{{ article.name }}</h3>

            <div :class="$style.cardMeta">
              <span v-if="article.scaleName" :class="$style.metaTag">{{ article.scaleName }}</span>
            </div>

            <div :class="$style.cardFooter">
              <span :class="$style.cardPrice">{{ article.price }}€</span>
             <button type="button" :class="$style.addButton" @click.stop.prevent="handleAddToCart(article)">Ajouter au panier</button>
            </div>
          </div>
          </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, useCssModule } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/services/api'
import type { Article } from '@/types'

const $style = useCssModule()
const route = useRoute()

const articles = ref<Article[]>([])
const isLoading = ref(true)
const loadError = ref('')

// Correspondance slug d'URL (accents/tirets) -> valeur réelle de typeName côté back.
// ⚠️ À vérifier/ajuster : ces valeurs doivent correspondre EXACTEMENT à ce que
// ton back attend dans le path param {type} (a priori les valeurs stockées en
// base, ex. "voitures" vu dans un exemple de réponse précédent).
const CATEGORY_LABELS: Record<string, string> = {
  voitures: 'Voitures',
  motos: 'Motos',
  'engins-agricoles': 'Engins Agricoles',
  'engins-de-chantier': 'Engins de chantier',
  bateaux: 'Bateaux',
}

const CATEGORY_API_VALUES: Record<string, string> = {
  voitures: 'voitures',
  motos: 'motos',
  'engins-agricoles': 'agricole',
  'engins-de-chantier': 'chantier',
  bateaux: 'bateaux',
}

const categorySlug = computed(() => String(route.params.type || ''))
const categoryLabel = computed(() => CATEGORY_LABELS[categorySlug.value] || categorySlug.value)

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
  if (normalized.includes('précommande') || normalized.includes('precommande')) {
    return $style.statusPreorder
  }
  if (normalized.includes('non disponible') || normalized.includes('rupture')) {
    return $style.statusUnavailable
  }
  return $style.statusAvailable
}

const loadArticles = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const apiType = CATEGORY_API_VALUES[categorySlug.value] || categorySlug.value
    articles.value = await apiService.getArticlesByType(apiType)
  } catch (e) {
    console.error('Erreur chargement catégorie:', e)
    loadError.value = 'Impossible de charger les articles de cette catégorie.'
  } finally {
    isLoading.value = false
  }
}

const handleAddToCart = (article: Article) => {
  // À brancher sur ton futur store panier / endpoint collection
  console.log('Ajout au panier :', article)
}

onMounted(loadArticles)
watch(() => route.params.type, loadArticles)
</script>

<style module>
.categoryPage {
  width: 100%;
  min-height: calc(100vh - 72px);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  padding: 64px;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  font-size: 13px;
  color: var(--color-text-subtle);
  margin: 0 0 16px;
}

.breadcrumbLink {
  color: var(--color-text-subtle);
  text-decoration: none;
}

.breadcrumbLink:hover {
  color: var(--color-accent);
}

.title {
  font-size: 32px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 8px;
}

.count {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0 0 32px;
}

.stateMessage {
  color: var(--color-text-muted);
  font-size: 15px;
  padding: 40px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-elevated);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
}

.imageWrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--color-bg-hover);
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .image {
  transform: scale(1.06);
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
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
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

.cardBody {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.cardBrand {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  margin: 0;
}

.cardName {
  font-size: 16px;
  font-weight: 600;
  line-height: 140%;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cardMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.metaTag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.cardFooter {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
}

.cardPrice {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-accent);
  white-space: nowrap;
}

.addButton {
  border-radius: 8px;
  border: 2px solid var(--color-accent);
  background-color: transparent;
  color: var(--color-accent);
  font-family: Roboto;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
}

.addButton:hover {
  background-color: var(--color-accent);
  color: #000;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .categoryPage {
    padding: 32px 24px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>