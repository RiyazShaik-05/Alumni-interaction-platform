import nodemailer from "nodemailer";

const customHTML = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Our Service!</h1>
          <p>Dear User,</p>
          <p>Thank you for signing up. We're excited to have you onboard!</p>
          <p>Feel free to explore the platform and let us know if you have any questions.</p>
          <p>Best regards,<br>ConnectEd</p>
        </div>
      </body>
    </html>
  `;

const sendEmail = async (to, subject, text, html = customHTML) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'connected.eep.project@gmail.com',
      pass: 'lnir pmbw ajhx hjzh',
    },
  });

  const mailOptions = {
    from: 'connected.eep.project@gmail.com',
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
