// Import necessary modules
require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");

// MongoDB connection string from environment variable
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://mcstechnology:mcstechnology2025@cluster0.zdyek.mongodb.net/mcs"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection error:", err));
