import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
    try {
        const id = (await params).id
        const session = getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where:{
                id
            }
        })
        if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const applications = await prisma.application.findMany({
            where: {
                applicantId: id
            },
            include: {
                startup: true,
            }
        })

        return NextResponse.json(applications, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error fetching Users applications" }, { status: 500 });
    }
}