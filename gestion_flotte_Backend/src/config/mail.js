import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

//fonction d'envoi
export const sendMail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.Mail_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("Email envoyé à :", to);
  } catch (err) {
    console.error("Erreur envoi email :", err.message);
  }
};

export default transporter;
