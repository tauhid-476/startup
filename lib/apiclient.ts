import { Startup, StartupFormData } from "@/types/Startup";
import { Application, ApplicationFormData } from "@/types/Application";
type FetchOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
}

interface Result {
    message?: string;
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

    async changePfp(imageUrl: string){
       return this.fetch<Result>("/pfp",{
        method: "PATCH",
        body: {imageUrl}
       })
    }

    async getStartup(id: string) {
        return this.fetch<Startup>(`/startups/${id}`)
    }

    async getStartups() {
        return this.fetch<Startup[]>("/startups")   
    }

    async getUserStartups(userId: string) {
        return this.fetch<Startup[]>(`/startups/user/${userId}`)
    }

    async createStartup(startupData: StartupFormData) {
        return this.fetch("/startups",{
            method: "POST",
            body: startupData
        })
    } 

    async createApplication(applicationData: ApplicationFormData, startupId: string) {
        console.log(applicationData)
       return this.fetch(`/application/${startupId}`,{
        method: "POST",
        body: applicationData
       })
    }

    async getstartupApplications(startupId: string){
      return this.fetch<Application[]>(`/application/${startupId}`)
    }

}

export const apiClient = new ApiClient();