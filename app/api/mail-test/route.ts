import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"


export async function POST(req: NextRequest) {
    const { email } = await req.json();
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
        return NextResponse.json("SMTP credentials not found", { status: 500 });
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, // Use 465 for SSL
            secure: true, // true for SSL
            auth: {
                user: process.env.SMTP_USER, // your Gmail address
                pass: process.env.SMTP_PASS, // your Gmail password or App password
            },
        })

        const info = await transporter.sendMail({
            from: "startup@startup.com",
            to: email,
            subject: 'test',
            html: `here is a test email sent to ${email} with love`,
        })

        console.log("Message sent: %s", info);

        return NextResponse.json("Email sent successfully", { status: 200 });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json("Error sending email", { status: 500 });
    }

}