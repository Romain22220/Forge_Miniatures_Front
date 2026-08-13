<!-- src/views/CollectionView.vue -->
<template>
  <div :class="$style.collectionPage">
    <div :class="$style.container">
      <div :class="$style.header">
        <h1 :class="$style.title">Mes collections</h1>
        <button type="button" :class="$style.createButton" @click="showCreateModal = true">
          Créer une collection
        </button>
      </div>
      <div v-if="isLoading" :class="$style.stateMessage">Chargement...</div>
      <div v-else-if="loadError" :class="$style.stateMessage">{{ loadError }}</div>
      <div v-else-if="collections.length === 0" :class="$style.emptyState">
        Aucune collection trouvée.
      </div>

      <div v-else :class="$style.grid">
        <button
          v-for="collection in collections"
          :key="collection.id"
          type="button"
          :class="$style.card"
          @click="selectedCollection = collection"
        >
          <div :class="$style.cardHeader">
            <h3 :class="$style.cardTitle">{{ collection.name }}</h3>
            <span v-if="collection.collectionType" :class="$style.typeBadge">
              {{ collection.collectionType }}
            </span>
          </div>
          <p :class="$style.cardMeta">
            {{ collection.articleCount ?? 0 }} article{{ (collection.articleCount ?? 0) > 1 ? 's' : '' }} ·
            {{ (collection.totalCollectionPrice ?? 0).toFixed(2) }}€
          </p>
        </button>
      </div>
    </div>

    <CollectionDetailModal
      v-if="selectedCollection"
      :collection="selectedCollection"
      @close="selectedCollection = null"
      @deleted="handleCollectionDeleted"
    />
    <CreateCollectionModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleCollectionCreated"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'
import CollectionDetailModal from '@/components/CollectionDetailModal.vue'
import CreateCollectionModal from '@/components/CreateCollectionModal.vue'

type CollectionDTO = Awaited<ReturnType<typeof apiService.getMyCollections>>[number]

const collections = ref<CollectionDTO[]>([])
const isLoading = ref(true)
const loadError = ref('')
const selectedCollection = ref<CollectionDTO | null>(null)
const showCreateModal = ref(false)

onMounted(async () => {
  try {
    collections.value = await apiService.getMyCollections()
  } catch (e) {
    console.error('Erreur chargement collections:', e)
    loadError.value = 'Impossible de charger vos collections pour le moment.'
  } finally {
    isLoading.value = false
  }
})

const handleCollectionCreated = (collection: CollectionDTO) => {
  collections.value.push(collection)
  showCreateModal.value = false
}

/*const handleCollectionUpdated = (updatedCollection: CollectionDTO) => {
  const index = collections.value.findIndex(c => c.id === updatedCollection.id)
  if (index !== -1) {
    collections.value[index] = updatedCollection
  }
}*/

const handleCollectionDeleted = (deletedCollectionId: number) => {
  collections.value = collections.value.filter(c => c.id !== deletedCollectionId)
}

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
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.cardHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.cardTitle {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.typeBadge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  white-space: nowrap;
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