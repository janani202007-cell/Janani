require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
let dbConnected = false;

const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.log("⚠️  Warning: MONGO_URI not set in .env file");
      console.log("   Starting in offline mode with mock data");
      dbConnected = false;
      return;
    }
    
    await mongoose.connect(mongoURI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    
    dbConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    dbConnected = false;
    console.log("❌ MongoDB Connection Error:", err.message);
    console.log("   Server will run with mock data");
  }
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend server is running",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Library Management API",
    version: "1.0.0",
    database: dbConnected ? "connected" : "disconnected"
  });
});

// Import routes (placeholder - add actual routes)
// app.use("/api/auth", require("./routes/authroutes"));
// app.use("/api/books", require("./routes/bookroutes"));
// app.use("/api/loans", require("./routes/loanRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

// Start server
const startServer = async () => {
  await connectDatabase();
  
  app.listen(PORT, () => {
    console.log("\n═══════════════════════════════════════");
    console.log("🚀 Library Management Backend Server");
    console.log("═══════════════════════════════════════");
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`💾 Database: ${dbConnected ? "Connected ✅" : "Offline ⚠️"}`);
    console.log("═══════════════════════════════════════\n");
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});