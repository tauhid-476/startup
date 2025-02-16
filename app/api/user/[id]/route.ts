import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = (await params).id

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "You must be logged in to access this page" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrond" }, { status: 500 });
    }

}