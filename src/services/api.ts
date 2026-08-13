import type { Article, Scale, Reference, UpdateUserData, CollectionDTO, CreateCollectionData } from '@/types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

// ============================================
// TYPES - AUTHENTIFICATION / USER
// ============================================

export interface UserRegistrationData {
  name: string 
  lastName: string
  pseudo: string
  email: string
  address: string
  password: string
  phoneNumber?: string
  birthday?: string | null // format "date" (YYYY-MM-DD)
}

export interface UserLoginData {
  email: string
  password: string
  rememberMe?: boolean // absent du LoginRequestDTO, géré uniquement côté front
}

// Reflète UserDTO tel que défini dans la spec
export interface User {
  id: number
  name: string
  lastName: string
  pseudo: string
  email: string
  phoneNumber?: string
  address: string
  birthday?: string
  admin?: boolean
}

// Réponse réelle du back pour /api/auth/login
export interface LoginResponse {
  token: string
}

// Reflète ErrorResponseDTO côté Spring Boot
export interface ErrorResponseDTO {
  message: string
  status: number
  errors?: Record<string, string>
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  field?: string
  validationErrors?: Record<string, string>
}

// ============================================
// ÉTAT D'AUTHENTIFICATION PARTAGÉ
// ============================================
// Déclaré au niveau du module (et non dans useAuth()) pour que TOUS les
// composants qui appellent useAuth() (Navbar, LoginView, etc.) partagent
// exactement les mêmes refs réactives.

import { ref } from 'vue'

const isLoading = ref(false)
const error = ref('')
const success = ref('')
const validationErrors = ref<Record<string, string> | null>(null)
const user = ref<User | null>(null)

// Restaure la session au chargement du module (ex: après un F5)
const storedUser = localStorage.getItem('auth_user')
if (storedUser) {
  try {
    user.value = JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('auth_user')
  }
}

// Permet à apiService.request() de vider le user si le token est rejeté (401)
function clearSession() {
  user.value = null
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  localStorage.removeItem('remember_me')
}

// ============================================
// SERVICE API
// ============================================

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(typeof options?.headers === 'object' && options?.headers
        ? Object.fromEntries(
            Object.entries(options.headers).filter(([, v]) => typeof v === 'string'),
          )
        : {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalide/expiré : on nettoie tout, y compris le user affiché
        // dans la Navbar, pour resynchroniser l'UI avec la réalité du back.
        clearSession()
      }

      const text = await response.text()
      const parsed: ErrorResponseDTO = text
        ? JSON.parse(text)
        : { message: response.statusText, status: response.status }

      const err = new Error(parsed.message) as Error & {
        validationErrors?: Record<string, string>
      }
      err.validationErrors = parsed.errors
      throw err
    }

    // Certaines réponses peuvent être vides (ex: DELETE)
    const text = await response.text()
    return text ? JSON.parse(text) : (undefined as T)
  }

  // ------------------------------------------
  // Inscription -> POST /api/users/create
  // ------------------------------------------
  async registerUser(userData: UserRegistrationData): Promise<ApiResponse<User>> {
    try {
      const requestData = {
        name: userData.name,
        lastName: userData.lastName,
        pseudo: userData.pseudo,
        email: userData.email.toLowerCase(),
        address: userData.address,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        birthday: userData.birthday,
      }

      const result = await this.request<User>('/users/create', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })

      return {
        success: true,
        data: result,
        message: 'Inscription réussie ! Bienvenue !',
      }
    } catch (error) {
      console.error('Erreur inscription:', error)
      const err = error as Error & { validationErrors?: Record<string, string> }

      if (err.validationErrors) {
        return {
          success: false,
          error: 'Certains champs sont invalides',
          validationErrors: err.validationErrors,
        }
      }

      if (err.message?.includes('already exists') || err.message?.includes('déjà utilisé')) {
        return { success: false, error: 'Cet email est déjà utilisé', field: 'email' }
      }

      return { success: false, error: err.message || 'Erreur serveur. Veuillez réessayer.' }
    }
  }

  // ------------------------------------------
  // Connexion -> POST /api/auth/login
  // ------------------------------------------
  async loginUser(loginData: UserLoginData): Promise<ApiResponse<LoginResponse>> {
    try {
      const result = await this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginData.email.toLowerCase(),
          password: loginData.password,
        }),
      })

      localStorage.setItem('auth_token', result.token)
      if (loginData.rememberMe) {
        localStorage.setItem('remember_me', 'true')
      }

      return {
        success: true,
        data: result,
        message: 'Connexion réussie !',
      }
    } catch (error) {
      console.error('Erreur connexion:', error)
      const err = error as Error

      return {
        success: false,
        error: err.message || 'Erreur de connexion. Veuillez réessayer.',
      }
    }
  }

  // ------------------------------------------
  // Déconnexion : pas d'endpoint back pour l'instant,
  // on nettoie juste le localStorage.
  // ------------------------------------------
  async logoutUser(): Promise<void> {
    clearSession()
  }

  // ------------------------------------------
  // Récupération user par email -> GET /api/users?email=...
  // ------------------------------------------
  async getUserByEmail(email: string): Promise<User> {
    return this.request<User>(`/users?email=${encodeURIComponent(email)}`)
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    return this.request<User>('/users/me/profile/update', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // ============================================
  // ARTICLES
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

  async deleteArticle(id: number): Promise<void> {
    return this.request<void>(`/articles/${id}`, { method: 'DELETE' })
  }

  async getArticlesByType(type: string): Promise<Article[]> {
    return this.request<Article[]>(`/articles/type/${encodeURIComponent(type)}/all`)
  }

  async getArticlesByMarque(marque: string): Promise<Article[]> {
    return this.request<Article[]>(`/articles/marque/${encodeURIComponent(marque)}/all`)
  }

  async getArticlesBySubtype(subtype: string): Promise<Article[]> {
    return this.request<Article[]>(`/articles/subtype/${encodeURIComponent(subtype)}/all`)
  }
  // ============================================
  // SCALES
  // ============================================

  async getAllScales(): Promise<Scale[]> {
    return this.request<Scale[]>('/scales/all')
  }

  async getScaleById(id: number): Promise<Scale> {
    return this.request<Scale>(`/scales/${id}`)
  }

  // ============================================
  // REFERENCES
  // ============================================

  async getAllReferences(): Promise<Reference[]> {
    return this.request<Reference[]>('/references/all')
  }

  // ⚠️ La spec utilise un query param ?id=, pas un path param /{id}
  async getReferenceById(id: number): Promise<Reference> {
    return this.request<Reference>(`/references/id?id=${id}`)
  }

    // ============================================
  // COLLECTIONS
  // ============================================
  
  async getMyCollections(): Promise<CollectionDTO[]> {
    return this.request<CollectionDTO[]>('/collections/me/all')
  }

  async createCollection(data: CreateCollectionData): Promise<CollectionDTO> {
  return this.request<CollectionDTO>('/collections/me/create', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
}

export const apiService = new ApiService()

// ============================================
// COMPOSABLE VUE 3 (état PARTAGÉ, voir plus haut)
// ============================================

import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  const register = async (userData: UserRegistrationData) => {
    isLoading.value = true
    error.value = ''
    success.value = ''
    validationErrors.value = null

    const result = await apiService.registerUser(userData)

    if (result.success) {
      success.value = result.message || 'Inscription réussie !'
      setTimeout(() => {
        router.push('/connexion?registered=true')
      }, 2000)
    } else {
      error.value = result.error || "Erreur lors de l'inscription"
      validationErrors.value = result.validationErrors || null
    }

    isLoading.value = false
    return result
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    isLoading.value = true
    error.value = ''

    const result = await apiService.loginUser({ email, password, rememberMe })

    if (result.success) {
      try {
        user.value = await apiService.getUserByEmail(email)
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      } catch (e) {
        console.warn('Impossible de récupérer les infos user après login:', e)
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
    router.push('/connexion')
  }

  const updateProfile = async (data: UpdateUserData) => {
    isLoading.value = true
    error.value = ''
    success.value = ''

    try {
      await apiService.updateUser(data)
      // Le back renvoie un UpdateUserDTO (nom/prenom), mais notre `user` partagé
      // suit le format UserDTO (name/lastName) -> on remappe pour rester cohérent
      user.value = {
        ...(user.value as User),
        name: data.name ?? user.value?.name ?? '',
        lastName: data.lastName ?? user.value?.lastName ?? '',
        pseudo: data.pseudo ?? user.value?.pseudo ?? '',
        email: data.email ?? user.value?.email ?? '',
        address: data.address ?? user.value?.address ?? '',
        phoneNumber: data.phoneNumber ?? user.value?.phoneNumber,
        birthday: data.birthday ?? user.value?.birthday,
      }
      localStorage.setItem('auth_user', JSON.stringify(user.value))
      success.value = 'Profil mis à jour avec succès !'
      return { success: true }
    } catch (e) {
      const err = e as Error
      error.value = err.message || 'Erreur lors de la mise à jour.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    success,
    validationErrors,
    user,
    register,
    login,
    logout,
    updateProfile,
  }
}