import { createTransport } from "nodemailer";
import mailgun from "mailgun.js";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (email, subject, text) => {
  let success;

  try {
    const transporter = createTransport({
      host: process.env.HOST,
      // service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: text,
    });
    success = true;
    console.log("email sent sucessfully");
  } catch (error) {
    success = false;
    console.log("email not sent");
    console.log(error);
  }

  return success;
};

// const mail =

export default sendEmail;
