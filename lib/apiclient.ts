import { Startup, StartupFormData } from "@/types/Startup";
import { Application, ApplicationFormData, HiringResponse } from "@/types/Application";
import { FormValues, User } from "@/types/User";

type FetchOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: ApplicationFormData | StartupFormData | { imageUrl: string } | { startupId: string } | { isActive: boolean } | { status: string }
    headers?: Record<string, string>;
}

interface Result {
    message?: string;
    user: User;
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {},
    ): Promise<T> {

        const { method = "GET", body, headers = {} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }

        const response = await fetch(`/api/${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        })
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json()
    }

    //USER RELATED APIS
    async updateProfile(data: FormValues) {
        return this.fetch<Result>("/update-profile", {
            method: "PATCH",
            body: data
        })
    }

    async getUser(userId: string){
      return this.fetch<User>(`/user/${userId}`)
    }

    //STARTUP RELATED APIS
    async createStartup(startupData: StartupFormData) {
        return this.fetch("/startups", {
            method: "POST",
            body: startupData
        })
    }

    async getStartups() {
        return this.fetch<Startup[]>("/startups")
    }

    async searchStartups(query: string) {
        return this.fetch<Startup[]>(`/startups/search?q=${encodeURIComponent(query)}`)
    }

    async getStartup(id: string) {
        return this.fetch<Startup>(`/startups/${id}`)
    }

    async getFounderStartups(userId: string) {
        return this.fetch<Startup[]>(`/startups/user/${userId}`)
    }

    async updateStartupStatus(startupId: string, data: {isActive: boolean}) {
        return this.fetch<Startup>(`/startups/${startupId}`, {
            method: "PATCH",
            body: { isActive: data.isActive },
        })
    }


    //APPLICATION RELATED APIS
    async createApplication(applicationData: ApplicationFormData, startupId: string) {
        console.log(applicationData)
        return this.fetch(`/application/${startupId}`, {
            method: "POST",
            body: applicationData
        })
    }

    async getstartupApplications(startupId: string) {
        return this.fetch<Application[]>(`/application/${startupId}`)
    }

    async getCandidateApplications(userId: string) {
        return this.fetch<Application[]>(`/application/user/${userId}`)
    }



    //hire/reject
    async updateApplicationStatus(startupId: string, applicationId: string, status: "ACCEPTED" | "REJECTED") {
        return this.fetch<HiringResponse>(`/startups/${startupId}/applications/${applicationId}/hire`, {
            method: "POST",
            body: { status }
        })
    }

}

export const apiClient = new ApiClient();