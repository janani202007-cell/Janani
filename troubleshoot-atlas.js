#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');
require('dotenv').config();

console.log("\n");
console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║         MONGODB ATLAS CONNECTION TROUBLESHOOTER              ║");
console.log("╚══════════════════════════════════════════════════════════════╝");
console.log("\n");

// Get current IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

const currentIP = getLocalIP();
console.log("🖥️  SYSTEM INFO:");
console.log("  • Current IP: " + currentIP);
console.log("  • Hostname: " + os.hostname());
console.log("  • OS: " + os.platform());
console.log("\n");

// Check environment variables
console.log("📋 CONFIGURATION CHECK:");
console.log("  • MONGO_URI: " + (process.env.MONGO_URI ? "✅ Set" : "❌ Missing"));
console.log("  • PORT: " + (process.env.PORT ? "✅ Set (" + process.env.PORT + ")" : "❌ Missing"));
console.log("\n");

// Test Atlas connection
console.log("🔍 ATLAS CONNECTION TEST:");
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log("  ⏳ Testing connection to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
    });

    console.log("  ✅ SUCCESS: Connected to MongoDB Atlas!");
    console.log("  📊 Database: " + mongoose.connection.name);
    console.log("  🌐 Host: " + mongoose.connection.host);

    await mongoose.connection.close();
    return true;

  } catch (error) {
    console.log("  ❌ FAILED: " + error.message);

    // Analyze error
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.log("  🔍 DIAGNOSIS: DNS resolution failed");
      console.log("  💡 POSSIBLE CAUSES:");
      console.log("     • IP address not whitelisted in MongoDB Atlas");
      console.log("     • MongoDB cluster is PAUSED (check Atlas dashboard)");
      console.log("     • Network firewall blocking connection");
      console.log("     • DNS issues or VPN interference");
    } else if (error.message.includes('authentication failed')) {
      console.log("  🔍 DIAGNOSIS: Authentication failed");
      console.log("  💡 POSSIBLE CAUSES:");
      console.log("     • Incorrect username/password");
      console.log("     • Database user doesn't have proper permissions");
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log("  🔍 DIAGNOSIS: Invalid cluster URL");
      console.log("  💡 POSSIBLE CAUSES:");
      console.log("     • Wrong cluster URL in connection string");
      console.log("     • Cluster was deleted or renamed");
    }

    return false;
  }
}

// Main troubleshooting
async function troubleshoot() {
  const isConnected = await testConnection();

  console.log("\n📋 TROUBLESHOOTING STEPS:");
  console.log("═══════════════════════════════════════════════════════════════");

  if (!isConnected) {
    console.log("\n1️⃣  CHECK MONGODB ATLAS DASHBOARD:");
    console.log("   🌐 Go to: https://www.mongodb.com/cloud/atlas");
    console.log("   📊 Check if your cluster status shows 'RUNNING' (not 'PAUSED')");
    console.log("   🔄 If paused, click the 'Resume' button\n");

    console.log("2️⃣  VERIFY NETWORK ACCESS:");
    console.log("   🚪 Go to: Network Access tab");
    console.log("   📋 Check if IP '" + currentIP + "' is listed and shows 'ACTIVE'");
    console.log("   ➕ If not listed, click '+ ADD IP ADDRESS'");
    console.log("   🔄 Wait 2-3 minutes after adding IP\n");

    console.log("3️⃣  CHECK DATABASE USER:");
    console.log("   👤 Go to: Database Access tab");
    console.log("   🔐 Ensure user 'monikapavuluru21_db_user' exists");
    console.log("   🔑 Has 'Read and write' permissions for 'library-management' database\n");

    console.log("4️⃣  TEST WITH MONGODB COMPASS:");
    console.log("   🧭 Download: https://www.mongodb.com/try/download/compass");
    console.log("   🔗 Paste this URI: " + process.env.MONGO_URI.replace(/:([^:@]{4})[^:@]*@/, ':$1****@'));
    console.log("   ✅ If Compass connects, the URI is correct\n");

    console.log("5️⃣  TEMPORARY SOLUTION (DEVELOPMENT ONLY):");
    console.log("   🚫 Add IP: 0.0.0.0/0 (allows all IPs - NOT for production)");
    console.log("   ⚠️  Remember to remove this for security!\n");

    console.log("🔄 AFTER FIXING, RUN YOUR SERVER:");
    console.log("   cd backend && npm start\n");

  } else {
    console.log("✅ ATLAS CONNECTION WORKS!");
    console.log("   The issue is in your application code.");
    console.log("   Try restarting the server: cd backend && npm start\n");
  }

  console.log("💡 NEED HELP?");
  console.log("   • Check MongoDB Atlas documentation");
  console.log("   • Verify all settings in Atlas dashboard");
  console.log("   • Try connecting from a different network\n");
}

troubleshoot().catch(console.error);