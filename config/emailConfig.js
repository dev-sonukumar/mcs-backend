const nodemailer = require("nodemailer");
require("dotenv").config();

const useSSL = true; // Set to false if using TLS
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: useSSL ? 465 : 587,
  secure: useSSL,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Handle missing env variables
if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
  console.error("❌ Missing SMTP credentials. Check your .env file.");
}

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error.message);
    console.error("🔍 Detailed Error:", error);
  } else {
    console.log("✅ SMTP server is ready to take messages");
  }
});

module.exports = transporter;
