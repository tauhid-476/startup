import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function verifyFounder() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { 
      error: "Unauthorized", 
      status: 401 
    };
  }

  

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!currentUser || currentUser.role !== "FOUNDER") {
    return { 
      error: "Only Founders can access this resource", 
      status: 403 
    };
  }

  return { user: session.user };
}