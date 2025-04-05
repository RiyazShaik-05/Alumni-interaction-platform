import nodemailer from "nodemailer";

const customHTML =""

const sendEmail = async (to, subject, text, html = customHTML) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: '',
    },
  });

  const mailOptions = {
    from: '',
    to: to,
    subject: subject,
    text: text,
    html:html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

export default sendEmail;

export { sendEmail };
