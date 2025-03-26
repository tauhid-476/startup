import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyFounder } from "@/lib/is-founder";
import { sendPendingMail } from "@/lib/mails";

//TODO: ADDIBNG PDF UPLOAD
const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,37}[a-zA-Z0-9]\/?$/;
const twitterRegex = /^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z[a-zA-Z0-9_]{3,14}\/?$/;
// const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w\-\.]{3,100}\/?$/;

const applicationSchema = z.object({
    github: z.string().regex(githubRegex, "Invalid GitHub profile link").optional(),
    twitter: z.string().regex(twitterRegex, "Invalid Twitter/X profile link").optional(),
    linkedin: z.string().optional(),
});


//CREATE APPLICATION FOR A SPECIFIC STARTUP
export async function POST(req: NextRequest, 
    { params }: { params: Promise<{ startupId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const startupId = (await params).startupId

        console.log("session data is", session)

        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }
        console.log("user role from db is", session.user?.role)

        if (session.user?.role !== "CANDIDATE") {
            return NextResponse.json(
                { error: "Only candidates can apply for startup" },
                { status: 403 }
            )
        }

        const startup = await prisma.startup.findUnique({
            where: { id: startupId }
        });

        if (!startup) {
            return NextResponse.json(
                { error: "Startup not found" },
                { status: 404 }
            );
        }

        if (!startup.isActive) {
            return NextResponse.json(
                { error: "This startup is no longer accepting applications" },
                { status: 400 }
            );
        }

        if (startup.currentApplicants >= startup.maxApplicants) {
            await prisma.startup.update({
                where: { id: startupId },
                data: { isActive: false }
            })

            return NextResponse.json(
                { error: "This startup has reached its maximum number of applications" },
                { status: 400 }
            );
        }

        const existingApplication = await prisma.application.findUnique({
            where: {
                startupId_applicantId: {
                    startupId,
                    applicantId: session.user.id
                }
            }
        });

        if (existingApplication) {
            return NextResponse.json(
                { error: "You have already applied for this startup for the application id:", existingApplication },
                { status: 400 }
            )
        }

        const body = await req.json();
        console.log("body is", body)
        const validBody = applicationSchema.safeParse(body);
        console.log("valid body is", validBody)

        // if (body.github) {
        //     console.log("GitHub URL test:", githubRegex.test(body.github));
        // }
        // if (body.twitter) {
        //     console.log("Twitter URL test:", twitterRegex.test(body.twitter));
        // }
        // if (body.linkedin) {
        //     console.log("LinkedIn URL test:", linkedinRegex.test(body.linkedin));
        // }

        if (!validBody.success) {
            return NextResponse.json(
                { message: validBody.error.errors },
                { status: 400 }
            );
        }

        const application = await prisma.$transaction(async (prisma) => {
            const newApplication = await prisma.application.create({
                data: {
                    ...validBody.data,
                    startupId,
                    email: session.user.email,
                    applicantId: session.user.id,
                },
                include: {
                    user: true,
                    startup: true
                }
            })

            sendPendingMail({
                startupTitle: newApplication.startup.title,
                applicationId: newApplication.id,
                email: session.user.email
            })

            await prisma.startup.update({
                where: { id: startupId },
                data: { currentApplicants: { increment: 1 } }
            })

            return newApplication;
        })

        return NextResponse.json(
            { message: "Application created successfully", application },
            { status: 201 }
        );

    } catch (error) {
        console.error("POST /api/startups error:", error);
        return NextResponse.json(
            { error: "Failed to create application" },
            { status: 500 }
        );
    }
}

//GET ALL THE APPLICATIONS OF A SPECIFIC STARTUP
export async function GET(req: NextRequest,
    { params }: { params: Promise<{ startupId: string }> }
) {

    try {
        const session = await getServerSession(authOptions);
        const startupId = (await params).startupId

        console.log("session data is", session)

        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const auth = await verifyFounder()

        if ('error' in auth) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const startup = await prisma.startup.findUnique({
            where: { id: startupId },
            select: { postedById: true }
        })

        if (startup?.postedById !== session.user.id) {
            return NextResponse.json(
                { error: "You are not owner of this startup's applications" },
                { status: 403 }
            )
        }

        const applications = await prisma.application.findMany({
            where: {
                startupId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json(applications, { status: 200 })

    } catch (error) {
        console.error("GET /api/startups error:", error);
        return NextResponse.json(
            { error: "Failed to fetch applications" },
            { status: 500 }
        )
    }
}