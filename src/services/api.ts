import type { Article, Scale, Reference } from '@/types'

const API_BASE_URL = 'http://localhost:8080/api' // Votre API Spring Boot

// Types pour l'authentification
export interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  birthDate?: string | null
  acceptNewsletter?: boolean
}

export interface UserLoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  field?: string
  validationErrors?: Record<string, string>
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  birthDate?: string
  acceptNewsletter: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
  expiresIn: number
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    })
    
    if (!response.ok) {
      // Gestion spécifique des erreurs d'authentification
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        window.location.href = '/connexion'
      }
      
      // Essayer de parser l'erreur JSON si possible
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || `API Error: ${response.statusText}`)
      } catch {
        throw new Error(`API Error: ${response.statusText}`)
      }
    }
    
    return response.json()
  }

  // ============================================
  // AUTHENTIFICATION
  // ============================================

  async registerUser(userData: UserRegistrationData): Promise<ApiResponse<AuthResponse>> {
    try {
      // Adapter les données selon ce que votre API Spring Boot attend
      const requestData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: userData.password,
        birthDate: userData.birthDate,
        acceptNewsletter: userData.acceptNewsletter || false
      }

      const result = await this.request<AuthResponse>('/users/create', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })

      // Si votre API retourne directement les données utilisateur
      return {
        success: true,
        data: result,
        message: 'Inscription réussie ! Bienvenue !'
      }
      
    } catch (error) {
      console.error('Erreur inscription:', error)
      
      // Gestion des erreurs spécifiques selon votre API Spring Boot
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      
      if (errorMessage.includes('already exists') || errorMessage.includes('déjà utilisé')) {
        return {
          success: false,
          error: 'Cet email est déjà utilisé',
          field: 'email'
        }
      }
      
      if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        return {
          success: false,
          error: 'Données de validation incorrectes'
        }
      }
      
      return {
        success: false,
        error: errorMessage.includes('API Error') 
          ? 'Erreur serveur. Veuillez réessayer.' 
          : errorMessage
      }
    }
  }

  async loginUser(loginData: UserLoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const result = await this.request<AuthResponse>('/users/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginData.email.toLowerCase(),
          password: loginData.password,
          rememberMe: loginData.rememberMe || false
        }),
      })

      // Stocker le token
      if (result.token) {
        localStorage.setItem('auth_token', result.token)
        if (loginData.rememberMe) {
          localStorage.setItem('remember_me', 'true')
        }
      }

      return {
        success: true,
        data: result,
        message: 'Connexion réussie !'
      }
      
    } catch (error) {
      console.error('Erreur connexion:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      
      if (errorMessage.includes('unauthorized') || errorMessage.includes('invalid credentials')) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect'
        }
      }
      
      return {
        success: false,
        error: 'Erreur de connexion. Veuillez réessayer.'
      }
    }
  }

  async logoutUser(): Promise<void> {
    try {
      // Si votre API a un endpoint de déconnexion
      await this.request('/users/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // Nettoyer les données locales dans tous les cas
      localStorage.removeItem('auth_token')
      localStorage.removeItem('remember_me')
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const user = await this.request<User>('/users/me')
      return {
        success: true,
        data: user
      }
    } catch (error) {
      return {
        success: false,
        error: 'Impossible de récupérer les informations utilisateur'
      }
    }
  }

  // Vérifier si un email est disponible (optionnel)
  async checkEmailAvailable(email: string): Promise<boolean> {
    try {
      const response = await this.request<{ available: boolean }>(`/users/check-email?email=${encodeURIComponent(email)}`)
      return response.available
    } catch (error) {
      console.error('Erreur vérification email:', error)
      return true // En cas d'erreur, on considère l'email comme disponible
    }
  }

  // ============================================
  // ARTICLES (vos méthodes existantes)
  // ============================================

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

  // ============================================
  // SCALES (vos méthodes existantes)
  // ============================================

  async getAllScales(): Promise<Scale[]> {
    return this.request<Scale[]>('/scales/all')
  }
  
  async getScaleById(id: number): Promise<Scale> {
    return this.request<Scale>(`/scales/${id}`)
  }

  // ============================================
  // REFERENCES (vos méthodes existantes)
  // ============================================

  async getAllReferences(): Promise<Reference[]> {
    return this.request<Reference[]>('/references/all')
  }
  
  async getReferenceById(id: number): Promise<Reference> {
    return this.request<Reference>(`/references/${id}`)
  }

  // ============================================
  // ANCIENNES MÉTHODES USERS (pour compatibilité)
  // ============================================

  async createUser(userData: { email: string; password: string; name?: string }) {
    // Rediriger vers la nouvelle méthode
    return this.registerUser({
      firstName: userData.name?.split(' ')[0] || '',
      lastName: userData.name?.split(' ').slice(1).join(' ') || '',
      email: userData.email,
      password: userData.password
    })
  }
}

export const apiService = new ApiService()

// ============================================
// COMPOSABLE POUR VUE 3 (optionnel)
// ============================================

import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref('')
  const success = ref('')
  const user = ref<User | null>(null)

  const register = async (userData: UserRegistrationData) => {
    isLoading.value = true
    error.value = ''
    success.value = ''

    const result = await apiService.registerUser(userData)
    
    if (result.success) {
      success.value = result.message || 'Inscription réussie !'
      if (result.data) {
        user.value = result.data.user
      }
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/connexion?registered=true')
      }, 2000)
    } else {
      error.value = result.error || 'Erreur lors de l\'inscription'
    }
    
    isLoading.value = false
    return result
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    isLoading.value = true
    error.value = ''

    const result = await apiService.loginUser({ email, password, rememberMe })
    
    if (result.success) {
      if (result.data) {
        user.value = result.data.user
      }
      router.push('/')
    } else {
      error.value = result.error || 'Erreur de connexion'
    }
    
    isLoading.value = false
    return result
  }

  const logout = async () => {
    await apiService.logoutUser()
    user.value = null
    router.push('/connexion')
  }

  return {
    isLoading,
    error,
    success,
    user,
    register,
    login,
    logout
  }
}