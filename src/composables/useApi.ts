import { ref, type Ref } from 'vue'
import { apiService } from '@/services/api'
import type { Article, Scale } from '@/types'

export function useArticles() {
  const articles: Ref<Article[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchArticles = async () => {
    loading.value = true
    error.value = null
    try {
      articles.value = await apiService.getAllArticles()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }

  const getLatestArticles = (limit = 6) => {
    return articles.value
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, limit)
  }

  return {
    articles,
    loading,
    error,
    fetchArticles,
    getLatestArticles
  }
}

export function useScales() {
  const scales: Ref<Scale[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchScales = async () => {
    loading.value = true
    error.value = null
    try {
      scales.value = await apiService.getAllScales()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }

  return {
    scales,
    loading,
    error,
    fetchScales
  }
}