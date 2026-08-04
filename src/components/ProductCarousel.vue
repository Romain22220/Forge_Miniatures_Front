<!-- src/components/ProductCarousel.vue -->
<template>
  <section :class="$style.selection">
    <div :class="$style.header">
      <div>
        <h2 :class="$style.title">Sélection</h2>
        <p :class="$style.subtitle">Découvrez nos miniatures les plus recherchées</p>
      </div>
      <router-link to="/boutique" :class="$style.viewAllButton">Voir tout</router-link>
    </div>

    <div v-if="isLoading" :class="$style.stateMessage">Chargement...</div>
    <div v-else-if="loadError" :class="$style.stateMessage">{{ loadError }}</div>

    <template v-else>
      <div :class="$style.track">
        <!-- Remplace uniquement le bloc de la carte dans le template -->
        <div
        v-for="article in visibleArticles"
        :key="article.id"
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
            <span v-if="article.typeName" :class="$style.metaTag">{{ article.typeName }}</span>
            </div>

            <div :class="$style.cardFooter">
            <span :class="$style.cardPrice">{{ formatPrice(article.price) }}</span>
            <button type="button" :class="$style.addButton" @click="handleAddToCart(article)">
                Ajouter
            </button>
            </div>
        </div>
        </div>
      </div>

      <div :class="$style.footer">
        <div :class="$style.dots">
          <button
            v-for="(_, index) in pageCount"
            :key="index"
            type="button"
            :class="[$style.dot, { [$style.dotActive]: index === currentPage }]"
            :aria-label="`Page ${index + 1}`"
            @click="goToPage(index)"
          ></button>
        </div>

        <div :class="$style.arrows">
          <button
            type="button"
            :class="$style.arrowButton"
            :disabled="currentPage === 0"
            aria-label="Précédent"
            @click="goToPage(currentPage - 1)"
          >
            ‹
          </button>
          <button
            type="button"
            :class="$style.arrowButton"
            :disabled="currentPage === pageCount - 1"
            aria-label="Suivant"
            @click="goToPage(currentPage + 1)"
          >
            ›
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'
import type { Article } from '@/types'
import { useCssModule } from 'vue'

const $style = useCssModule()

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
const IMAGE_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api').replace(
  /\/api\/?$/,
  '',
)

const resolveImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${IMAGE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

// Nombre de cartes visibles par page. 4 colle à ta capture d'écran ;
// passe à 5 si tu préfères des cartes un peu plus étroites.
const ITEMS_PER_PAGE = 4

const articles = ref<Article[]>([])
const isLoading = ref(true)
const loadError = ref('')
const currentPage = ref(0)

const pageCount = computed(() => Math.max(1, Math.ceil(articles.value.length / ITEMS_PER_PAGE)))

const visibleArticles = computed(() => {
  const start = currentPage.value * ITEMS_PER_PAGE
  return articles.value.slice(start, start + ITEMS_PER_PAGE)
})

const goToPage = (index: number) => {
  if (index < 0 || index > pageCount.value - 1) return
  currentPage.value = index
}

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return ''
  return `${price}€`
}

const handleAddToCart = (article: Article) => {
  // À brancher sur ton futur store panier / endpoint collection
  console.log('Ajout au panier :', article)
}

onMounted(async () => {
  try {
    // En attendant un endpoint dédié "meilleures ventes", on prend tout
    // et on affiche les N premiers. À remplacer par un vrai endpoint
    // (ex: /api/articles/best-sellers) quand il existera côté back.
    const all = await apiService.getAllArticles()
    articles.value = all
  } catch (e) {
    console.error('Erreur chargement articles:', e)
    loadError.value = 'Impossible de charger les articles pour le moment.'
  } finally {
    isLoading.value = false
  }
})
</script>

<style module>
.selection {
  padding: 64px;
   background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 24px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  line-height: 130%;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 16px;
  line-height: 150%;
  color: var(--color-text-muted);
  margin: 0;
}

.viewAllButton {
  flex-shrink: 0;
  border-radius: 8px;
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  text-decoration: none;
  padding: 8px 20px;
  font-size: 16px;
  line-height: 150%;
  white-space: nowrap;
}

.viewAllButton:hover {
  background-color: var(--color-accent-bg-hover-strong);
}

.stateMessage {
  color: var(--color-text-muted);
  font-size: 16px;
  padding: 40px 0;
  text-align: center;
}

.track {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.imageWrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--color-bg-secondary);
  overflow: hidden;
}

.image {
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
  color: var(--color-text-muted);
  font-size: 14px;
}

.cardBody {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cardTop {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.cardName {
  font-size: 18px;
  font-weight: 600;
  line-height: 130%;
  margin: 0;
  color: var(--color-text, #fff);
}


.cardSubtitle {
  font-size: 14px;
  line-height: 150%;
  color: var(--color-text-muted);
  margin: 0 0 8px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background-color: #444;
  cursor: pointer;
  padding: 0;
}

.dotActive {
  background-color: #fff;
}

.arrows {
  display: flex;
  gap: 12px;
}

.arrowButton {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #fff;
  background-color: transparent;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrowButton:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.arrowButton:not(:disabled):hover {
  border-color: #d9a65b;
  color: #d9a65b;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 1100px) {
  .track {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .selection {
    padding: 32px 24px;
  }

  .track {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
.card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-elevated);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
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
  backdrop-filter: blur(4px);
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
  /* Tronque proprement après 2 lignes pour garder des cartes de même hauteur */
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
</style>