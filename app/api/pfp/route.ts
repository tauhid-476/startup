import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { prisma } from "@/lib/prisma"; // Ensure you have a Prisma instance

interface updateData {
    name?: string;
    bio?: string;
    image?: string;
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "You are not signed in." });
        }
        const userId = session.user.id;

        const { name, bio, imageUrl } = await req.json();
        const updateData: updateData = {}

        if (name) updateData.name = name
        if (bio) updateData.bio = bio
        if (imageUrl) updateData.image = imageUrl

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No data to update" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        })
        return NextResponse.json({
            message: "Profile updated successfully.",
            user: updatedUser
        })
        
    } catch (error) {
        console.error("Error updating profile picture:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}