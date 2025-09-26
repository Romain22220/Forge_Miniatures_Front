import type { Article, Scale, Reference } from '@/types'

const API_BASE_URL = 'http://localhost:8080/api' // Votre API Spring Boot

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }

  // Articles
  async getAllArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles/all')
  }
  
  async getArticleById(id: number): Promise<Article> {
    return this.request<Article>(`/articles/${id}`)
  }
  
  async createArticle(article: Partial<Article>): Promise<Article> {
    return this.request<Article>('/articles/create', {
      method: 'POST',
      body: JSON.stringify(article),
    })
  }

  // Scales
  async getAllScales(): Promise<Scale[]> {
    return this.request<Scale[]>('/scales/all')
  }
  
  async getScaleById(id: number): Promise<Scale> {
    return this.request<Scale>(`/scales/${id}`)
  }

  // References
  async getAllReferences(): Promise<Reference[]> {
    return this.request<Reference[]>('/references/all')
  }
  
  async getReferenceById(id: number): Promise<Reference> {
    return this.request<Reference>(`/references/${id}`)
  }

  // Users
  async createUser(userData: { email: string; password: string; name?: string }) {
    return this.request('/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }
}

export const apiService = new ApiService()