const express = require("express");
const rateLimit = require("express-rate-limit"); // ✅ Ensure rateLimit is imported
const cors = require("cors"); // ✅ Import CORS (in case it's not handled globally)
const transporter = require("../config/emailConfig");

const router = express.Router();

// ✅ CORS Middleware (if not already in `server.js`)
router.use(
  cors({
    origin: ["http://localhost:5173", "https://mcstechnology.netlify.app"], // ✅ Allow frontend origins
    methods: ["GET", "POST", "OPTIONS"], // ✅ Allow OPTIONS method
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Email validation function
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Rate limiter to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // ✅ Increased limit for testing
  message: { error: "Too many requests, please try again later." },
});

// ✅ Preflight request handling (Fix for CORS error)
router.options("/", cors());

// ✅ Contact form route
router.post("/", limiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  // ✅ Validate request body
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format!" });
  }

  // ✅ Check if SMTP_EMAIL is correctly loaded
  if (!process.env.SMTP_EMAIL) {
    console.error("❌ SMTP_EMAIL is not set in environment variables.");
    return res.status(500).json({ error: "Email service misconfiguration." });
  }

  const mailOptions = {
    from: `"Contact Form" <${process.env.SMTP_EMAIL}>`, // ✅ Use a valid "from" address
    to: process.env.SMTP_EMAIL,
    replyTo: email, // ✅ Some providers might ignore this, but it's correct
    subject: `New Contact Form Message: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    res.status(500).json({
      error: "Failed to send email. Please try again later.",
      details: error.message, // ✅ Helps with debugging
    });
  }
});

module.exports = router;
