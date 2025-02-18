const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const db = require("./db");

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Development
  "https://mcstechnology.netlify.app", // Production
];

// ✅ CORS Middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS Blocked: ${origin}`);
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow preflight requests
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Required if sending cookies/auth headers
};

app.use(cors(corsOptions));

// ✅ Handle Preflight Requests for CORS
app.options("*", cors(corsOptions));

// ✅ Security Middleware
app.use(helmet()); // Adds security headers

// ✅ Middleware (Must Come After CORS)
app.use(express.json()); // Body parser for JSON

// ✅ Import Routes
const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandler");

// ✅ Use Routes
app.use("/api/contact", contactRoutes);
app.use(errorHandler);

// ✅ Additional API Routes
const bisfaqRouter = require("./routes/bisfaqsRouter");
const etafaqRouter = require("./routes/etafaqsRouter");
const eprfaqRouter = require("./routes/eprfaqsRouter");

app.use("/bisfaqs", bisfaqRouter);
app.use("/etafaqs", etafaqRouter);
app.use("/eprfaqs", eprfaqRouter);

// ✅ Catch-All for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ Graceful Shutdown
process.on("SIGINT", () => {
  console.log("\n🚀 Gracefully shutting down...");
  db.disconnect(); // Close database connection
  process.exit(0);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
