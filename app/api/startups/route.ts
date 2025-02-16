import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { verifyFounder } from "../../../lib/is-founder"

export const startupSchema = z.object({
    title: z.string().min(1, "Title is required").max(20, "Title must be less than 20 characters"),
    description: z.string().min(10, "Description is required").max(100, "Description must be less than 100 characters"),
    pitch: z.string().min(20, "Pitch is required").max(1000, "Pitch must be less than 200 characters"),
    category: z.string().optional(),
    image: z.string().optional(),
    maxApplicants: z.number().min(1, "Maximum applicants must be at least 1"),
    hiringQuantity: z.number().min(1, "Hiring quantity must be at least 1")
})


//CREATE A STARTUP
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        // Verify user is a FOUNDER
        const auth = await verifyFounder()

        if ('error' in auth) {
            return NextResponse.json(
              { error: auth.error }, 
              { status: auth.status }
            );
          }

        const body = await req.json()

        // Validate request body
        const validationResult = startupSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.flatten()
                },
                { status: 400 }
            )
        }

        const startup = await prisma.startup.create({
            data: {
                ...validationResult.data,
                currentApplicants: 0,
                isActive: true,
                postedById: session.user.id,
            },
            include: {
                postedBy: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            }
        })

        return NextResponse.json(
            {
                message: "Startup created successfully",
                data: startup
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("POST /api/startups error:", error)
        return NextResponse.json(
            { error: "Failed to create startup" },
            { status: 500 }
        )
    }
}


//GET ALL THE STARTUPS
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const startups = await prisma.startup.findMany({
            where: {
               isActive: true
            },
            orderBy: {
                createdAt: 'desc'
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

        if (!startups.length) {
            return NextResponse.json(
                { data: [], message: "No startups found" },
                { status: 200 }
            )
        }

        return NextResponse.json(startups, { status: 200 })
    } catch (error) {
        console.error("GET /api/startups error:", error)
        return NextResponse.json(
            { error: "Failed to fetch startups" },
            { status: 500 }
        )
    }
}

