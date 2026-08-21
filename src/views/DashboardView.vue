<!-- src/views/admin/DashboardView.vue -->
<template>
  <div :class="$style.dashboardPage">
    <div :class="$style.container">
      <div :class="$style.header">
        <h1 :class="$style.title">Dashboard</h1>
        <router-link to="/dashboard/articles/create" :class="$style.createButton">
          + Nouvel article
        </router-link>
      </div>

      <div v-if="isLoading" :class="$style.stateMessage">Chargement des métriques...</div>

      <template v-else>
        <div :class="$style.metricsGrid">
          <div :class="$style.metricCard">
            <span :class="$style.metricValue">{{ metrics.totalArticles }}</span>
            <span :class="$style.metricLabel">Articles au catalogue</span>
          </div>
          <div :class="$style.metricCard">
            <span :class="$style.metricValue">{{ metrics.totalStock }}</span>
            <span :class="$style.metricLabel">Unités en stock</span>
          </div>
          <div :class="$style.metricCard">
            <span :class="$style.metricValue">{{ metrics.outOfStockCount }}</span>
            <span :class="$style.metricLabel">Ruptures de stock</span>
          </div>
          <div :class="$style.metricCard">
            <span :class="$style.metricValue">{{ metrics.catalogValue.toFixed(2) }}€</span>
            <span :class="$style.metricLabel">Valeur totale du catalogue</span>
          </div>
          <div :class="$style.metricCard">
            <span :class="$style.metricValue">{{ metrics.totalScales }}</span>
            <span :class="$style.metricLabel">Échelles référencées</span>
          </div>
          <div :class="$style.metricCard">
            <span :class="$style.metricValue">{{ metrics.totalReferences }}</span>
            <span :class="$style.metricLabel">Références</span>
          </div>
        </div>

        <section :class="$style.tableSection">
          <div :class="$style.tableHeader">
            <h2 :class="$style.sectionTitle">Articles</h2>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher un article..."
              :class="$style.searchInput"
            />
          </div>

          <table :class="$style.table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Marque</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in filteredArticles" :key="article.id">
                <td :class="$style.cellName">{{ article.name }}</td>
                <td>{{ article.marque }}</td>
                <td>{{ article.price }}€</td>
                <td>{{ article.quantite }}</td>
                <td>
                  <span :class="$style.statusTag">{{ article.statutName }}</span>
                </td>
                <td>
                  <router-link :to="`/dashboard/articles/${article.id}/edit`" :class="$style.editLink">
                    Modifier
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'
import type { Article } from '@/types'

const articles = ref<Article[]>([])
const totalScales = ref(0)
const totalReferences = ref(0)
const isLoading = ref(true)
const search = ref('')

const metrics = computed(() => {
  const totalStock = articles.value.reduce((sum, a) => sum + (a.quantite ?? 0), 0)
  const catalogValue = articles.value.reduce((sum, a) => sum + (a.price ?? 0) * (a.quantite ?? 0), 0)
  const outOfStockCount = articles.value.filter((a) => (a.quantite ?? 0) <= 0).length

  return {
    totalArticles: articles.value.length,
    totalStock,
    catalogValue,
    outOfStockCount,
    totalScales: totalScales.value,
    totalReferences: totalReferences.value,
  }
})

const filteredArticles = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return articles.value
  return articles.value.filter((a) => a.name.toLowerCase().includes(query))
})

onMounted(async () => {
  try {
    const [allArticles, allScales, allReferences] = await Promise.all([
      apiService.getAllArticles(),
      apiService.getAllScales(),
      apiService.getAllReferences(),
    ])
    articles.value = allArticles
    totalScales.value = allScales.length
    totalReferences.value = allReferences.length
  } catch (e) {
    console.error('Erreur chargement dashboard:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<style module>
.dashboardPage {
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
  margin: 0;
}

.createButton {
  border-radius: 8px;
  background-color: var(--color-accent);
  border: 2px solid var(--color-accent);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 20px;
  white-space: nowrap;
}

.createButton:hover {
  opacity: 0.9;
}

.stateMessage {
  color: var(--color-text-muted);
  font-size: 15px;
}

.metricsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.metricCard {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-bg-elevated);
  padding: 20px;
}

.metricValue {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-accent);
}

.metricLabel {
  font-size: 13px;
  color: var(--color-text-muted);
}

.tableSection {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-bg-elevated);
  padding: 24px;
}

.tableHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.sectionTitle {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.searchInput {
  border-radius: 8px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-family: Roboto;
  font-size: 13px;
  padding: 6px 12px;
  outline: none;
  min-width: 220px;
}

.searchInput:focus {
  border-color: var(--color-accent);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  color: var(--color-text-subtle);
  font-weight: 500;
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border);
}

.cellName {
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.statusTag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.editLink {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
}

.editLink:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .metricsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboardPage {
    padding: 32px 24px;
  }

  .metricsGrid {
    grid-template-columns: 1fr;
  }

  .table {
    display: block;
    overflow-x: auto;
  }
}
</style>