const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async ({ email, subject, message }) => {
  const info = await transporter.sendMail({
    from: 'no-reply@mail.com',
    to: email,
    subject,
    text: message,

  });

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
