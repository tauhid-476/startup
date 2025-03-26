import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({ startups: [] });
    }

    const startups = await prisma.startup.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          {
            postedBy: {
              name: { contains: query, mode: "insensitive" }
            }
          }
        ]
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        applications: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error("Error searching startups:", error);
    return NextResponse.json(
      { error: "Failed to search startups" },
      { status: 500 }
    );
  }
} 