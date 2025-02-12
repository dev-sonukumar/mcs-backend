const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// API Route
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend! sonu kumar singh" });
});

// Serve React frontend (only in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
