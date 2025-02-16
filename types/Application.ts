export interface Application{
    id: string
    github?: string
    linkedin?:string
    twitter?:string
    user: {
        id: string,
        email: string,
        name: string,
        image: string
    }
}

export type ApplicationFormData = {
    github?: string;
    twitter?: string;
    linkedin?: string;
  }