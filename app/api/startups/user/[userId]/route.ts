import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// Fetch startups for a specific user
export async function GET(req: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in to access this page" },
        { status: 401 }
      )
    }

    const userId = (await params).userId
    const isCurrentUser = session.user.id === userId

    // Fetch user to verify they exist and get their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Determine which startups to return based on requester
    const startups = await prisma.startup.findMany({
      where: {
        postedById: userId,
        ...(isCurrentUser ? {} : { isActive: true }),
         // If not current user, only show active startups
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(startups)
  } catch (error) {
    console.error("Error fetching startups:", error)
    return NextResponse.json(
      { error: "Failed to fetch user startups" },
      { status: 500 }
    )
  }
}