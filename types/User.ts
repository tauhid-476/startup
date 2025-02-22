export interface User {
    name: string
    email: string
    image: string
    role: string
    bio: string
    createdAt: Date
  }

export interface FormValues {
    imageUrl: string
    name: string
    bio: string
  }