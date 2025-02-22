import { NextResponse } from "next/server";
import nodemailer from "nodemailer"

//template of mails
interface MailProps {
    startupTitle: string,
    applicationId: string
    email: string
}

//PENDING(when applications is created but not yet reviewed)
export async function sendPendingMail({ startupTitle, applicationId, email }: MailProps) {
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

        const emailTemplate = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
              <h2 style="color: #333;">📢 Your Application is Pending!</h2>
              <p style="color: #555; font-size: 16px;">
                  Hello, <br/><br/>
                  Thank you for applying to <b>${startupTitle}</b>. We have received your application and it is currently under review.
              </p>
              <p style="color: #555; font-size: 16px;">
                  Your Application ID: <b>${applicationId}</b>
              </p>
              <p style="color: #555; font-size: 16px;">
                  Our team will reach out to you if you are shortlisted. Stay tuned for updates!
              </p>
              <hr style="border: none; border-top: 1px solid #ddd;">
              <p style="text-align: center; font-size: 14px; color: #777;">
                  🚀 Best of luck!<br/>
                  The Startup Team
              </p>
          </div>
      `;

        const info = await transporter.sendMail({
            from: '"Startup Platform" <startup@startup.com>',
            to: email,
            subject: `Application Received - ${startupTitle}`,
            html: emailTemplate,
        });

        console.log("Message sent: %s", info);

        return NextResponse.json("Email sent successfully", { status: 200 });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json("Error sending email", { status: 500 });
    }
}

//ACCEPTED
export async function sendAcceptedMail({ startupTitle, applicationId, email }: MailProps) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return NextResponse.json("SMTP credentials not found", { status: 500 });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const emailTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #28a745;">🎉 Congratulations! You're Hired!</h2>
                <p style="color: #555; font-size: 16px;">
                    Hello, <br/><br/>
                    We are thrilled to inform you that your application for <b>${startupTitle}</b> has been <b style="color: #28a745;">Accepted</b>! 🎉
                </p>
                <p style="color: #555; font-size: 16px;">
                    Your Application ID: <b>${applicationId}</b>
                </p>
                <p style="color: #555; font-size: 16px;">
                    Our team will contact you soon with further details regarding the next steps. Get ready to embark on this exciting journey with us!
                </p>
                <hr style="border: none; border-top: 1px solid #ddd;">
                <p style="text-align: center; font-size: 14px; color: #777;">
                    🚀 Welcome to the team!<br/>
                    The Startup Team
                </p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: '"Startup Platform" <startup@startup.com>',
            to: email,
            subject: `You're Hired! - ${startupTitle}`,
            html: emailTemplate,
        });

        console.log("Message sent: %s", info.messageId);

        return NextResponse.json("Email sent successfully", { status: 200 });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json("Error sending email", { status: 500 });
    }
}

//REJECTED
export async function sendRejectedMail({ startupTitle, applicationId, email }:MailProps) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return NextResponse.json("SMTP credentials not found", { status: 500 });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const emailTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #dc3545;">💔 Application Status Update</h2>
                <p style="color: #555; font-size: 16px;">
                    Hello, <br/><br/>
                    We appreciate your interest in <b>${startupTitle}</b>. After careful consideration, we regret to inform you that your application has been <b style="color: #dc3545;">not selected</b> at this time.
                </p>
                <p style="color: #555; font-size: 16px;">
                    Your Application ID: <b>${applicationId}</b>
                </p>
                <p style="color: #555; font-size: 16px;">
                    Don't be discouraged! We encourage you to apply for future opportunities. Thank you for your time and effort.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd;">
                <p style="text-align: center; font-size: 14px; color: #777;">
                    🌟 We wish you all the best!<br/>
                    The Startup Team
                </p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: '"Startup Platform" <startup@startup.com>',
            to: email,
            subject: `Application Update - ${startupTitle}`,
            html: emailTemplate,
        });

        console.log("Message sent: %s", info.messageId);

        return NextResponse.json("Email sent successfully", { status: 200 });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json("Error sending email", { status: 500 });
    }
}



