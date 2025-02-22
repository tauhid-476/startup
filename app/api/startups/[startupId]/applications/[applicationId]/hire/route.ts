import { authOptions } from "@/lib/auth";
import { verifyFounder } from "@/lib/is-founder";
import { sendAcceptedMail, sendRejectedMail } from "@/lib/mails";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


interface RouteParams {
    startupId: string;
    applicationId: string;
}

enum ApplicationStatus {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}
//
//hire
export async function POST(req: NextRequest, { params }: { params: RouteParams }) {
    try {
        const { startupId, applicationId } = await params;
        const body = await req.json();
        const { status } = body;

        if (!status || !Object.values(ApplicationStatus).includes(status)) {
            return NextResponse.json(
                { error: "Invalid status. Must be either ACCEPTED or REJECTED" },
                { status: 400 }
            );
        }

        if (!startupId || !applicationId) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json("Unauthorized", { status: 401 });

        // Verify user is a FOUNDER
        const auth = await verifyFounder()

        if ('error' in auth) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const startup = await prisma.startup.findUnique({
            where: {
                id: startupId,
                postedById: session.user.id,
            }
        })

        if (!startup) return NextResponse.json("Startup not found", { status: 404 });

        const application = await prisma.application.findUnique({
            where: {
                id: applicationId,
                startupId
            }
        })

        if (!application) return NextResponse.json("Application not found", { status: 404 });

        if (application.status === "ACCEPTED") {
            return NextResponse.json("Application already accepted", { status: 400 });
        }


        const updatedApplication = await prisma.$transaction(async (prisma) => {
            const updated = await prisma.application.update({
                where: { id: applicationId },
                data: {
                    status: status === "ACCEPTED" ? "ACCEPTED" : "REJECTED",
                    hiredAt: status === "ACCEPTED" ? new Date() : null,
                },
                include: { user: true }
            })

            if (status === "ACCEPTED") {
                await prisma.startup.update({
                    where: { id: startupId },
                    data: { currentyHired: { increment: 1 } }
                })

                sendAcceptedMail({
                    startupTitle: startup.title,
                    applicationId,
                    email: updated.user.email
                })
            }

            if(status === "REJECTED"){
                sendRejectedMail({
                    startupTitle: startup.title,
                    applicationId,
                    email: updated.user.email
                })
            }
            return updated;
        })
        return NextResponse.json(updatedApplication, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json("Failed the hiring api route", { status: 500 })
    }
}