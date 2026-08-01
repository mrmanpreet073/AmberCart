// utils/email.js
import * as Brevo from "@getbrevo/brevo";

// initialize Brevo API client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// ── Base send function ──
const sendEmail = async (to, subject, html) => {
    const emailData = {
        sender: {
            name:  process.env.SMTP_FROM_NAME,
            email: process.env.SMTP_FROM_EMAIL,  // your Gmail as sender
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
    };

    try {
        await apiInstance.sendTransacEmail(emailData);
        console.log("Email sent successfully to:", to);
    } catch (error) {
        console.log("Brevo email error:", error?.response?.body || error.message);
        throw new Error(error.message);
    }
};

// ── Verification email ──
const sendVerificationEmail = async (email, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 10px; min-height: 100%;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; overflow: hidden;">
                <tr>
                    <td style="padding: 40px 32px; text-align: center;">

                        <!-- Logo / Brand -->
                        <div style="margin-bottom: 24px;">
                            <span style="font-size: 22px; font-weight: 800; color: #d97706;">Amber</span><span style="font-size: 22px; font-weight: 800; color: #111827;">Cart</span>
                        </div>

                        <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 16px; margin-top: 0;">
                            Verify your email address
                        </h1>

                        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 32px; margin-top: 0;">
                            Thanks for signing up! Please click the button below to verify your email address and activate your account.
                        </p>

                        <a href="${url}"
                           style="background-color: #d97706; color: #ffffff; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 200px; border-radius: 6px; -webkit-text-size-adjust: none;">
                            Verify Email
                        </a>

                        <p style="color: #9ca3af; font-size: 13px; line-height: 20px; margin-top: 32px; margin-bottom: 0;">
                            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
                        </p>

                        <!-- Footer -->
                        <div style="border-top: 1px solid #f3f4f6; margin-top: 32px; padding-top: 20px;">
                            <p style="color: #d1d5db; font-size: 12px; margin: 0;">
                                © 2026 AmberCart · All rights reserved
                            </p>
                        </div>

                    </td>
                </tr>
            </table>
        </div>
    `;

    await sendEmail(email, "Verify your email address — AmberCart", htmlContent);
};

// ── Reset password email ──
const sendResetPasswordEmail = async (email, otp) => {
    const htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 10px; min-height: 100%;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; overflow: hidden;">
                <tr>
                    <td style="padding: 40px 32px; text-align: center;">

                        <!-- Logo / Brand -->
                        <div style="margin-bottom: 24px;">
                            <span style="font-size: 22px; font-weight: 800; color: #d97706;">Amber</span><span style="font-size: 22px; font-weight: 800; color: #111827;">Cart</span>
                        </div>

                        <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 16px; margin-top: 0;">
                            Reset your password
                        </h1>

                        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px; margin-top: 0;">
                            We received a request to reset your password. Use the OTP below to proceed. Do not share this with anyone.
                        </p>

                        <!-- OTP Box -->
                        <div style="background-color: #fef3c7; border: 2px solid #d97706; border-radius: 8px; padding: 16px 32px; margin: 0 auto 24px; display: inline-block;">
                            <p style="color: #78350f; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 6px 0;">Your OTP</p>
                            <span style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #92400e;">
                                ${otp}
                            </span>
                        </div>

                        <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                            This OTP expires in <strong>10 minutes</strong>.
                        </p>

                        <p style="color: #9ca3af; font-size: 13px; line-height: 20px; margin-top: 24px; margin-bottom: 0;">
                            If you didn't request a password reset, you can safely ignore this email.
                        </p>

                        <!-- Footer -->
                        <div style="border-top: 1px solid #f3f4f6; margin-top: 32px; padding-top: 20px;">
                            <p style="color: #d1d5db; font-size: 12px; margin: 0;">
                                © 2026 AmberCart · All rights reserved
                            </p>
                        </div>

                    </td>
                </tr>
            </table>
        </div>
    `;

    await sendEmail(email, "Reset your password — AmberCart", htmlContent);
};

export { sendVerificationEmail, sendResetPasswordEmail };