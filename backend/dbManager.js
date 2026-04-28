/**
 * Database Connection Manager
 * Handles automatic connection with retry logic and fallback
 */

const mongoose = require("mongoose");

// Global connection state
let connectionState = {
  connected: false,
  mode: "offline", // 'atlas' | 'local' | 'offline'
  retryCount: 0,
  lastError: null,
  connectionTime: null
};

// Set up mongoose connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected');
  connectionState.connected = true;
  connectionState.connectionTime = new Date();
  if (mongoose.connection.name && mongoose.connection.name.includes('cluster0')) {
    connectionState.mode = "atlas";
  } else {
    connectionState.mode = "local";
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
  connectionState.connected = false;
  connectionState.mode = "offline";
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err.message);
  connectionState.connected = false;
  connectionState.mode = "offline";
  connectionState.lastError = err.message;
});

// Mock data for offline mode
const mockUsers = [
  { userId: "STU-101", password: "1234", role: "student", _id: "1" },
  { userId: "FAC-101", password: "1234", role: "faculty", _id: "2" },
  { userId: "LIB-101", password: "1234", role: "librarian", _id: "3" },
  { userId: "ADMIN", password: "admin", role: "admin", _id: "4" }
];

const mockBooks = [
  { _id: "1", title: "Data Structures", author: "Mark Allen Weiss", branch: "CS", available: 5 },
  { _id: "2", title: "Algorithms", author: "Cormen", branch: "CS", available: 3 },
  { _id: "3", title: "Database Systems", author: "Elmasri", branch: "IT", available: 2 }
];

/**
 * Attempt to connect to MongoDB with timeout
 */
const attemptConnection = async (uri, dbName) => {
  try {
    console.log(`   🔗 Connecting to ${dbName}...`);
    console.log(`   📍 URI: ${uri.replace(/:([^:@]{4})[^:@]*@/, ':$1****@')}`); // Hide password

    await mongoose.connect(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      maxPoolSize: 10,
    });

    console.log(`   ✅ ${dbName} connection successful!`);
    return true;
  } catch (err) {
    console.log(`   ❌ ${dbName} connection failed:`);
    console.log(`   📝 Error: ${err.message}`);

    // Log specific error types
    if (err.message.includes('authentication failed')) {
      console.log(`   🔐 Authentication failed - Check username/password`);
    } else if (err.message.includes('getaddrinfo ENOTFOUND')) {
      console.log(`   🌐 DNS resolution failed - Check cluster URL`);
    } else if (err.message.includes('connection timed out')) {
      console.log(`   ⏱️  Connection timed out - Check network/firewall`);
    } else if (err.message.includes('not authorized')) {
      console.log(`   🚫 Not authorized - Check IP whitelist in MongoDB Atlas`);
    }

    console.log(`   ──────────────────────────────────────`);
    return false;
  }
};

/**
 * Main connection function with retry logic
 */
const connectDatabase = async () => {
  const maxRetries = 3; // Reduced from 5 for faster startup
  const retryDelay = 2000; // 2 seconds
  
  const atlasURI = process.env.MONGO_URI || 
    "mongodb+srv://monikapavuluru21_db_user:4CSSaa3dIB0b2pj@cluster0.joqcmge.mongodb.net/?appName=Cluster0";
  
  const localURI = "mongodb://localhost:27017/library-management";

  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   MongoDB Connection Manager Starting  ║");
  console.log("╚════════════════════════════════════════╝\n");

  // ☁️ Phase 1: Try MongoDB Atlas FIRST (Cloud Priority)
  console.log("📡 Phase 1: Attempting MongoDB Atlas (Cloud)...\n");
  for (let i = 1; i <= maxRetries; i++) {
    console.log(`   📌 Attempt ${i}/${maxRetries}...`);
    if (await attemptConnection(atlasURI, "MongoDB Atlas")) {
      connectionState.connected = true;
      connectionState.mode = "atlas";
      connectionState.connectionTime = new Date();
      console.log("\n✅ Successfully connected to MongoDB Atlas!\n");
      return;
    }
    if (i < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  // 🏠 Phase 2: Try Local MongoDB (Fallback)
  console.log("\n🏠 Phase 2: Trying Local MongoDB (Fallback)...\n");
  if (await attemptConnection(localURI, "Local MongoDB")) {
    connectionState.connected = true;
    connectionState.mode = "local";
    connectionState.connectionTime = new Date();
    console.log("✅ Successfully connected to Local MongoDB!\n");
    return;
  }

  // 3. Fallback to Offline Mode
  console.log("\n⚠️  All database connections failed. Phase 3: Running in OFFLINE Mode\n");
  connectionState.connected = false;
  connectionState.mode = "offline";
  
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║                  OFFLINE MODE ACTIVE                   ║");
  console.log("║  No database connected - Using mock data               ║");
  console.log("║  Data will NOT persist after server restart            ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  showConnectionGuide();
};

/**
 * Display connection setup guide
 */
const showConnectionGuide = () => {
  console.log("📋 TO ENABLE DATABASE CONNECTION:\n");
  console.log("Option 1: MongoDB Atlas (Cloud)");
  console.log("─".repeat(50));
  console.log("1. Visit: https://www.mongodb.com/cloud/atlas");
  console.log("2. Go to: Cluster0 → Network Access");
  console.log("3. Click: + Add IP Address");
  console.log("4. Enter your IP or use: 0.0.0.0/0");
  console.log("5. Restart this server\n");

  console.log("Option 2: Local MongoDB");
  console.log("─".repeat(50));
  console.log("1. Download: https://www.mongodb.com/try/download/community");
  console.log("2. Install with default settings");
  console.log("3. Start MongoDB service");
  console.log("4. Restart this server\n");

  console.log("For more help, run: npm run setup\n");
};

/**
 * Get connection status
 */
const getConnectionStatus = () => {
  // Check actual mongoose connection state
  const mongooseReady = mongoose.connection.readyState === 1;
  const mongooseName = mongoose.connection.name;

  // Update connection state based on actual mongoose state
  if (mongooseReady) {
    if (mongooseName && mongooseName.includes('cluster0')) {
      connectionState.mode = "atlas";
      connectionState.connected = true;
    } else if (mongooseName) {
      connectionState.mode = "local";
      connectionState.connected = true;
    }
  }

  return {
    connected: connectionState.connected,
    mode: connectionState.mode,
    isAtlas: connectionState.mode === "atlas",
    isLocal: connectionState.mode === "local",
    isOffline: connectionState.mode === "offline",
    connectionTime: connectionState.connectionTime,
    mongooseReady: mongooseReady,
    mongooseState: mongoose.connection.readyState,
    connectionName: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port
  };
};

/**
 * Check if database is available (for route fallback)
 */
const isDatabaseAvailable = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get mock data (for offline mode)
 */
const getMockData = (type) => {
  switch (type) {
    case 'users':
      return mockUsers;
    case 'books':
      return mockBooks;
    case 'loans':
      return [];
    default:
      return [];
  }
};

module.exports = {
  connectDatabase,
  getConnectionStatus,
  isDatabaseAvailable,
  getMockData,
  connectionState: () => connectionState,
};
