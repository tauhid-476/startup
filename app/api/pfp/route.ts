import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { prisma } from "@/lib/prisma"; // Ensure you have a Prisma instance


export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "You are not signed in." });
        }
        const userId = session.user.id;

        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { image: imageUrl },
        });
        return NextResponse.json({ message: "Image updated successfully." });

    } catch (error) {
        console.error("Error updating profile picture:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}