import nodemailer, { SendMailOptions } from "nodemailer";

const user = process.env.EMAIL;
const pass = process.env.EMAIL_KEY;

const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user,
    pass,
  },
});

async function sendEmail(payload: SendMailOptions): Promise<void> {
  console.log(user, pass);
  mailTransporter.sendMail({ ...payload, from: user }, (err, info) => {
    if (err !== null) return console.error(err, "Error sendEmail");
    return console.log("Successfully sendEmail", info);
  });
}

export default sendEmail;
