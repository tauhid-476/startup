import { authOptions } from "@/lib/auth";
import { verifyFounder } from "@/lib/is-founder";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//UPDATE isActive STATUS
export async function POST(req: NextRequest, { params }: {
    params: { startupId: string }
}) {
    try {
        const startupId = (await params).startupId;
        const body = await req.json();
        const { status } = body;

        if (status !== true && status !== false) {
            return NextResponse.json("Invalid status", { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json("Unauthorized", { status: 401 });

        const auth = await verifyFounder()

        if ('error' in auth) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const updatedStartup = await prisma.startup.update({
            where: { id: startupId, postedById: session?.user.id },
            data: { isActive: status }
        })

        return NextResponse.json(updatedStartup, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
}

//GET A SPECIFIC STARTUP
export async function GET(req: NextRequest, { params }: {
    params: { startupId: string }
}) {
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

        if(!startup) return NextResponse.json("Startup not found", { status: 404 });
        return NextResponse.json(startup, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
}

