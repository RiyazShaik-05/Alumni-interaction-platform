import sgMail from "@sendgrid/mail";

// Set SendGrid API Key
sgMail.setApiKey("vCKXhThsAXfa7Nzsa7Cq17rBXj8ihSik");

const sendEmail = async () => {
  try {
    const msg = {
      to: "22bq1a54e3@vvit.net", // Recipient email (.NET domain)
      from: "connected.eep.project@outlook.com", // Sender email (Use a verified sender)
      subject: "Test Email via SendGrid",
      text: "Hello! This is a test email sent using SendGrid and Node.js.",
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.body || error);
  }
};

// Call the function
sendEmail();
