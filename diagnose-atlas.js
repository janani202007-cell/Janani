#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

// Get local IP address
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

// Test Atlas connection directly
function testAtlasConnection() {
  return new Promise((resolve) => {
    const atlasURI = "mongodb+srv://monikapavuluru21_db_user:4CSSaa3dIB0b2pj@cluster0.joqcmge.mongodb.net/?appName=Cluster0";

    exec(`node -e "
      const mongoose = require('mongoose');
      console.log('Testing Atlas connection...');
      mongoose.connect('${atlasURI}', {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000
      }).then(() => {
        console.log('SUCCESS: Atlas connection established');
        mongoose.connection.close();
        process.exit(0);
      }).catch((err) => {
        console.log('FAILED: ' + err.message);
        process.exit(1);
      });
    "`, (error, stdout, stderr) => {
      resolve(stdout);
    });
  });
}

// Main diagnostic function
async function diagnoseAtlasConnection() {
  const localIP = getLocalIP();

  console.clear();
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           MONGODB ATLAS CONNECTION DIAGNOSTICS               ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("\n");

  console.log("🖥️  CURRENT SYSTEM INFO:");
  console.log("  • IP Address: ", localIP);
  console.log("  • Hostname: ", os.hostname());
  console.log("  • OS: ", os.platform());
  console.log("\n");

  console.log("🔍 TESTING ATLAS CONNECTION...\n");

  const testResult = await testAtlasConnection();
  console.log(testResult);

  console.log("\n📋 TROUBLESHOOTING STEPS:\n");

  if (testResult.includes('SUCCESS')) {
    console.log("✅ ATLAS CONNECTION WORKS!");
    console.log("   The issue might be with your application configuration.");
    console.log("   Try restarting your backend server.\n");

    console.log("🚀 Restarting server...");
    exec('cd backend && npm start', (error, stdout, stderr) => {
      if (stdout && stdout.includes('Successfully connected to MongoDB Atlas')) {
        console.log("\n🎉 SUCCESS! Atlas is now connected!");
      }
    });

    return;
  }

  console.log("❌ ATLAS CONNECTION FAILED");
  console.log("\n🔧 POSSIBLE SOLUTIONS:\n");

  console.log("1️⃣  CHECK IP WHITELIST:");
  console.log("   • Go to MongoDB Atlas → Network Access");
  console.log(`   • Ensure ${localIP} is listed and ACTIVE`);
  console.log("   • If not, add it and wait 2-3 minutes\n");

  console.log("2️⃣  CHECK CLUSTER STATUS:");
  console.log("   • Go to Clusters → Your Cluster");
  console.log("   • Ensure cluster is not PAUSED");
  console.log("   • If paused, click 'Resume'\n");

  console.log("3️⃣  VERIFY CREDENTIALS:");
  console.log("   • Check username/password in connection string");
  console.log("   • Ensure database user has read/write permissions\n");

  console.log("4️⃣  NETWORK/FIREWALL:");
  console.log("   • Try disabling firewall temporarily");
  console.log("   • Check if VPN is interfering\n");

  console.log("5️⃣  ALLOW ALL IPS (TEMPORARY):");
  console.log("   • Add 0.0.0.0/0 to Network Access (not recommended for production)\n");

  console.log("🔄 AFTER FIXING, RUN THIS AGAIN:");
  console.log("   node diagnose-atlas.js\n");

  console.log("💡 QUICK TEST COMMAND:");
  console.log(`   mongosh "mongodb+srv://cluster0.joqcmge.mongodb.net/" --username monikapavuluru21_db_user\n`);
}

diagnoseAtlasConnection().catch(console.error);