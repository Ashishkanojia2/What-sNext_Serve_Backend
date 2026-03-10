import { createTransport } from "nodemailer";

 const sendMail = async ({ email, subject, message }) => {
  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from:"no-reply@whatnext.co.in",
    to: email,
    subject,
    text: message,
  });
};

export default sendMail