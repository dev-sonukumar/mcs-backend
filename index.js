const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandler");
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware (Must Come After CORS)
app.use(express.json()); // Replaces bodyParser

// Routes
app.use("/api/contact", contactRoutes);
// Error Handling Middleware
app.use(errorHandler);

// ✅  --- Routes by Bis Faqs ---- (Use Correct Path)
const bisfaqRouter = require("./routes/bisfaqsRouter");
app.use("/bisfaqs", bisfaqRouter);

const etafaqRouter = require("./routes/etafaqsRouter");
app.use("/etafaqs", etafaqRouter);

const eprfaqRouter = require("./routes/eprfaqsRouter");
app.use("/eprfaqs", eprfaqRouter);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
