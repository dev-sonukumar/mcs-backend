const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
const db = require("./db");

// ✅ Allow Specific Origins (Netlify & Localhost for Development)
const allowedOrigins = [
  "http://localhost:5173", // Your frontend in development
  "https://mcstechnology.netlify.app/", // Your deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json()); // Replaces bodyParser

// ✅ Routes
const faqRouter = require("./routes/faqRouter");
app.use("/faqs", faqRouter);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
