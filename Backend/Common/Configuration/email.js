import nodemailer from "nodemailer";

// SMTP transporter — works with Mailtrap, Gmail, SendGrid, or any SMTP provider
const transporter = nodemailer.createTransport({
  service:'gmail',  
  auth: {
    user: process.env.EMAIL_USER,          // SMTP username
    pass: process.env.EMAIL_PASS,          // SMTP password
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 10px; min-height: 100%;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; overflow: hidden;">
        <tr>
          <td style="padding: 40px 32px; text-align: center;">
            <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 16px; margin-top: 0;">Verify your email address</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 32px; margin-top: 0;">Thanks for signing up! Please click the button below to verify your email address and activate your account.</p>
            <a href="${url}" style="background-color: #4f46e5; color: #ffffff; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 200px; border-radius: 6px; -webkit-text-size-adjust: none;">Verify Email</a>
            <p style="color: #9ca3af; font-size: 14px; line-height: 20px; margin-top: 32px; margin-bottom: 0;">If you didn't create an account, you can safely ignore this email.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  await sendEmail(email, "Verify your email address", htmlContent);
};

const sendResetPasswordEmail = async (email, otp) => {
  // Fixed: Changed ${token} to ${otp} to prevent reference errors
  const url = `${process.env.CLIENT_URL}/api/auth/reset-password/${otp}`;
  
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 10px; min-height: 100%;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; overflow: hidden;">
        <tr>
          <td style="padding: 40px 32px; text-align: center;">
            <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 16px; margin-top: 0;">Reset your password</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px; margin-top: 0;">We received a request to reset your password. Use the verification code below to proceed.</p>
            
            <div style="background-color: #f3f4f6; border-radius: 6px; padding: 12px 24px; margin-bottom: 24px; display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #1f2937;">
              ${otp}
            </div>

            
            <p style="color: #9ca3af; font-size: 14px; line-height: 20px; margin-top: 32px; margin-bottom: 0;">If you didn't request a password reset, you can safely ignore this email. Dont Share this OTP with anyone</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  await sendEmail(email, "Reset your password", htmlContent);
};
export{sendVerificationEmail,sendResetPasswordEmail}