const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Added for security
require("dotenv").config();

const app = express();
const db = require("./db");

// ✅ CORS Middleware
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://mcstechnology.netlify.app"]
    : ["http://localhost:5173"]; // Development Frontend

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

// ✅ Helmet for security headers
app.use(helmet());

// ✅ Middleware (Must Come After CORS)
app.use(express.json()); // Replaces bodyParser

// Routes
const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api/contact", contactRoutes);
app.use(errorHandler);

// Other Routes
const bisfaqRouter = require("./routes/bisfaqsRouter");
app.use("/bisfaqs", bisfaqRouter);

const etafaqRouter = require("./routes/etafaqsRouter");
app.use("/etafaqs", etafaqRouter);

const eprfaqRouter = require("./routes/eprfaqsRouter");
app.use("/eprfaqs", eprfaqRouter);

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nGracefully shutting down...");
  db.disconnect(); // Close the database connection
  process.exit(0);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
