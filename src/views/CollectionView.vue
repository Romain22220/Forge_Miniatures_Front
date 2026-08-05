<!-- src/views/CollectionView.vue -->
<template>
  <div :class="$style.collectionPage">
    <div :class="$style.container">
      <div :class="$style.header">
        <h1 :class="$style.title">Ma collection</h1>
        <button type="button" :class="$style.createButton">Créer une collection</button>
      </div>

      <div v-if="isLoading" :class="$style.stateMessage">Chargement...</div>
      <div v-else-if="collections.length === 0" :class="$style.emptyState">
        <p>Vous n'avez pas encore de collection.</p>
        <p :class="$style.emptyHint">Créez-en une pour organiser vos miniatures préférées.</p>
      </div>

      <div v-else :class="$style.grid">
        <div v-for="collection in collections" :key="collection.id" :class="$style.card">
          <h3 :class="$style.cardTitle">{{ collection.name }}</h3>
          <p :class="$style.cardMeta">
            {{ collection.articleCount }} article{{ collection.articleCount > 1 ? 's' : '' }} ·
            {{ collection.totalCollectionPrice }}€
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CollectionDTO } from '@/types'

const collections = ref<CollectionDTO[]>([])
const isLoading = ref(true)

onMounted(async () => {
  // ⚠️ Pas d'endpoint "liste des collections d'un user" dans ta spec actuelle
  // (seulement GET /api/collections/{userId}/{collectionId}, qui suppose de
  // connaître déjà l'id de la collection). À ajouter côté back pour lister
  // toutes les collections d'un utilisateur.
  isLoading.value = false
})
</script>

<style module>
.collectionPage {
  width: 100%;
  min-height: calc(100vh - 72px);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: Roboto;
  padding: 64px;
  box-sizing: border-box;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
}

.title {
  font-size: 32px;
  font-weight: 700;
  line-height: 130%;
  margin: 0;
}

.createButton {
  border-radius: 8px;
  background-color: var(--color-accent);
  border: 2px solid var(--color-accent);
  color: #fff;
  font-family: Roboto;
  font-size: 14px;
  padding: 8px 20px;
  cursor: pointer;
  white-space: nowrap;
}

.createButton:hover {
  opacity: 0.9;
}

.stateMessage,
.emptyState {
  color: var(--color-text-muted);
  font-size: 15px;
}

.emptyHint {
  font-size: 13px;
  color: var(--color-text-subtle);
  margin-top: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-bg-elevated);
  padding: 24px;
}

.cardTitle {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}

.cardMeta {
  font-size: 13px;
  color: var(--color-text-subtle);
  margin: 0;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .collectionPage {
    padding: 32px 24px;
  }
}
</style>