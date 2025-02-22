import { Startup } from "./Startup"

export interface Application{
    id: string
    email?: string
    github?: string
    linkedin?:string
    twitter?:string
    status: string
    user: {
        id: string,
        email: string,
        name: string,
        image: string
    },
    applicantId: string
    startup: Startup
    createdAt: string
    updatedAt: string
}

export type ApplicationFormData = {
    github?: string;
    twitter?: string;
    linkedin?: string;
  }


export type HiringResponse = {
    id: string;
    startupId: string;
    applicantId: string;
    status: "ACCEPTED" | "REJECTED" | "PENDING"; // assuming possible values
    email: string;
    createdAt: string;
    updatedAt: string;
    hiredAt?: string; // optional since it's a timestamp
    github: string;
    linkedin: string;
    twitter: string;
    user: {
      id: string;
      name: string;
      email: string;
      password: string; // consider omitting this field in the frontend for security
    };
  };
  