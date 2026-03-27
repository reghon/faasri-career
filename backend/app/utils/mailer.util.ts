import nodemailer from "nodemailer";
import { config } from "../configurations/env";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: `"Faasri Career" <${config.email.user}>`,
    to,
    subject: "OTP Verifikasi Akun",
    html: `
      <h2>Verifikasi Akun Kamu</h2>
      <p>Gunakan kode OTP berikut untuk verifikasi akun kamu:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>Kode ini berlaku selama <strong>5 menit</strong>.</p>
      <p>Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
    `,
  });
};
