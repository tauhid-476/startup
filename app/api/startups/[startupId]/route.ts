import { authOptions } from "@/lib/auth";
import { verifyFounder } from "@/lib/is-founder";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//UPDATE isActive STATUS
export async function PATCH(
    req: NextRequest,
    { params }: { params: { startupId: string } }
) {
    try {
        const startupId = (await params).startupId;  // Removed unnecessary await
        if (!startupId) {
            return NextResponse.json(
                { error: "Startup ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { isActive } = body;  // Changed from status to isActive

        if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                { error: "Invalid status - must be boolean" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const auth = await verifyFounder();
        if ('error' in auth) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const fetchedStartup = await prisma.startup.findUnique({
            where: { id: startupId },
            select: { postedById: true }
        });

        if (!fetchedStartup) {
            return NextResponse.json(
                { error: "Startup not found" },
                { status: 404 }
            );
        }

        const updatedStartup = await prisma.startup.update({
            where: {
                id: startupId,
                postedById: fetchedStartup.postedById
            },
            data: {
                isActive: isActive  // Using isActive directly
            },
        });

        return NextResponse.json(updatedStartup, { status: 200 });

    } catch (error) {
        console.error("Error updating startup status:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

//GET A SPECIFIC STARTUP
export async function GET(
    req: NextRequest, 
    { params }: {params: Promise<{ startupId: string }> }
) {
    try {
        const startupId = (await params).startupId;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json("Unauthorized", { status: 401 });

        const startup = await prisma.startup.findUnique({
            where: {
                id: startupId
            },
            include: {
                postedBy: true
            }
        })

        if (!startup) return NextResponse.json("Startup not found", { status: 404 });
        return NextResponse.json(startup, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
}

