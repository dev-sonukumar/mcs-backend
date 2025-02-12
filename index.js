const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./db");

// ✅ CORS Middleware (Place Before Routes)
const allowedOrigins = [
  "http://localhost:5173", // Development Frontend
  "https://mcstechnology.netlify.app", // Production Frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware (Must Come After CORS)
app.use(express.json()); // Replaces bodyParser

// ✅ Routes (Use Correct Path)
const faqRouter = require("./routes/faqRouter");
app.use("/bisfaqs", faqRouter); // Ensure frontend fetches "/faqs"

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
