export interface Startup {
   id: string
   title: string
   description: string
   pitch: string
   category?: string
   image?: string
   postedById: string
   isActive: boolean
   currentApplicants: number
   maxApplicants: number
   hiringQuantity: number
   postedBy: {
      id: string
      name: string
      image: string
   }
   createdAt: Date
   updatedAt: Date
}

export type StartupFormData = Omit<Startup, "id" | "postedById" | "createdAt" | "updatedAt">


