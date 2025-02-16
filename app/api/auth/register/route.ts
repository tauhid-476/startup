import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role } = await req.json()
        if (!email || !password || !name || !role) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}