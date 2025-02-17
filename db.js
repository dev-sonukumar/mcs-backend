// Import necessary modules
require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");

// MongoDB connection string from environment variable
const MONGO_URI = process.env.MONGO_URI; // This gets the Mongo URI from the .env file

// Connect to MongoDB
mongoose
  .connect(MONGO_URI) // Using the URI from the .env file
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection error:", err));
