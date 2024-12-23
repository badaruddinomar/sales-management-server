import nodemailer from 'nodemailer';
import config from '../config';

interface IEmailOptions {
  reciverEmail: string;
  subject: string;
  body: string;
}
const sendEmail = async (options: IEmailOptions) => {
  const transporter = nodemailer.createTransport({
    // host: config.smpt_host,
    // port: config.smpt_port,
    service: config.smpt_service,
    auth: {
      user: config.smpt_mail,
      pass: config.smpt_password,
    },
  });
  const mailOptions = {
    from: config.smpt_mail,
    to: options.reciverEmail,
    subject: options.subject,
    html: options.body,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
