export interface Article {
  id: number
  name: string
  marque: string
  description: string
  images: string[] | null
  price: number
  quantite: number
  dateCreation: string // ISO string tel que renvoyé par Jackson, pas un objet Date natif
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

export interface Type {
  idt_type: number
  nom: string
}

export interface SubType {
  idt_subtype: number
  nom_subtype: string
}

export interface shop {
  idt_panier: number
}

export interface Contain {
  idt_panier: number
  idt_article: number
  quantite: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface UpdateUserData {
  lastName?: string
  name?: string
  pseudo?: string
  email?: string
  address?: string
  phoneNumber?: string
  birthday?: string | null
}