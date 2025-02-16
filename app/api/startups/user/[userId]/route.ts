import { authOptions } from "@/lib/auth"
import { verifyFounder } from "@/lib/is-founder"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

//all startups of a specific user
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ message: "You must be logged in to access this page" }, { status: 401 })
        }
        const userId = (await params).userId

        // Verify user is a FOUNDER
        const auth = await verifyFounder()

        if ('error' in auth) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const startups = await prisma.startup.findMany({
            where: {
                postedById: userId
            },
            include: {
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
            }
        })
        return NextResponse.json(startups)
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { error: "Failed to fetch user startups" },
            { status: 500 }
        )
    }
}