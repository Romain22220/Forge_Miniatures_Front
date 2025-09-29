export interface Article {
  idt_article: number
  nom_article: string
  marque_article: string
  description_article: string
  prix_article: number
  quantite_article: number
  dateCreation: Date
  datePublication: Date
}

export interface Scale {
  idt_scale: number
  scale: string
}

export interface Reference {
  idt_reference: number
  nom_reference: string
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

export interface Status_Article {
  idt_status_article: number
  status: string
}

export interface Articles_Images {
  idt_articles_images: number
  url_image: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}