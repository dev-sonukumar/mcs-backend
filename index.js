require("dotenv").config(); // Load environment variables
const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");

// ✅ Restrict CORS for production, allow all for development
const allowedOrigins = ["https://your-netlify-app.netlify.app"];
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? allowedOrigins : "*",
  })
);

// ✅ Middleware
app.use(bodyParser.json());

// ✅ Routes
const faqRouter = require("./routes/faqRouter");
app.use("/faq", faqRouter);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
