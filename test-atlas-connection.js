#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

async function testAtlasConnection() {
  console.log("\n🔍 TESTING MONGODB ATLAS CONNECTION STRING\n");

  const uri = process.env.MONGO_URI;
  console.log("📍 Connection URI:", uri.replace(/:([^:@]{4})[^:@]*@/, ':$1****@'));

  try {
    console.log("⏳ Attempting connection...");
    await mongoose.connect(uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      maxPoolSize: 10,
    });

    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    console.log("📊 Connection state:", mongoose.connection.readyState);
    console.log("🏢 Database name:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);

    // Close connection
    await mongoose.connection.close();
    console.log("🔌 Connection closed\n");

  } catch (error) {
    console.log("❌ FAILED: Could not connect to MongoDB Atlas");
    console.log("📝 Error:", error.message);

    if (error.message.includes('authentication failed')) {
      console.log("🔐 POSSIBLE ISSUE: Username/password incorrect");
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log("🌐 POSSIBLE ISSUE: Invalid cluster URL");
    } else if (error.message.includes('connection timed out')) {
      console.log("⏱️  POSSIBLE ISSUE: Network timeout - check IP whitelist");
    } else if (error.message.includes('not authorized')) {
      console.log("🚫 POSSIBLE ISSUE: IP not whitelisted in MongoDB Atlas");
    }

    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Check MongoDB Atlas → Network Access (ensure IP is whitelisted)");
    console.log("2. Verify cluster is not paused");
    console.log("3. Confirm username/password are correct");
    console.log("4. Try connecting with MongoDB Compass using this URI\n");
  }
}

testAtlasConnection().catch(console.error);