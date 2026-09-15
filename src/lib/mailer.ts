import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // o el proveedor que uses
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS  // tu contraseña o app password
  }
});

export async function sendNotificationEmail(to: string, subject: string, message: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message
  });
}
