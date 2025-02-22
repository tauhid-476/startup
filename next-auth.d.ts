import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string
      name: string;
      role: string;
      id: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    email: string
    name: string;
    role: string;
    id: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string
    name: string;
    role: string;
    id: string;
    image?: string;
  }
}

