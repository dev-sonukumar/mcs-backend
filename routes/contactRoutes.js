const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const transporter = require("../config/emailConfig");

// Email validation function
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Rate limiter to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per 15 minutes per IP
  message: { error: "Too many requests, please try again later." },
});

router.post("/", limiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format!" });
  }

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: process.env.SMTP_EMAIL,
    replyTo: email,
    subject: `New Contact Form Message: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      error: "Failed to send email. Please try again later.",
    });
  }
});

module.exports = router;
