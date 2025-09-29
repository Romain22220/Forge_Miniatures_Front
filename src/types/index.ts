export interface Article {
  id: number
  name: string
  marque: string
  description: string
  images: string[]
  price: number
  quantite: number
  dateCreation: string
  datePublication: string
  typeId: number
  typeName: string
  statusId: number
  statutName: string
  scaleId: number
  scaleName: string
  referenceId: number
  referenceName: string
}

export interface Scale {
  id: number
  name: string
  ratio: string
}

export interface Reference {
  id: number
  brand: string
  model: string
  year?: number
}

export interface User {
  id: number
  nom_user: string
  prenom_user: string
  pseudo: string
  email: string
  telephone?: string
  adresse?: string
  isAdmin: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}