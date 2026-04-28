#!/usr/bin/env node

const { exec } = require('child_process');
const readline = require('readline');
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

// Check MongoDB Atlas connection
function checkAtlasConnection() {
  return new Promise((resolve) => {
    const atlasURI = "mongodb+srv://monikapavuluru21_db_user:4CSSaa3dIB0b2pj@cluster0.joqcmge.mongodb.net/?appName=Cluster0";

    exec(`node -e "
      const mongoose = require('mongoose');
      mongoose.connect('${atlasURI}', {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000
      }).then(() => {
        console.log('ATLAS_CONNECTED');
        process.exit(0);
      }).catch((err) => {
        console.log('ATLAS_FAILED:' + err.message);
        process.exit(1);
      });
    "`, (error, stdout, stderr) => {
      if (stdout.includes('ATLAS_CONNECTED')) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Main function
async function main() {
  const localIP = getLocalIP();

  console.clear();
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║         AUTOMATIC MONGODB ATLAS CONNECTION CHECKER           ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("\n");

  console.log("🖥️  YOUR SYSTEM INFORMATION:");
  console.log("  • Local IP Address: ", localIP);
  console.log("  • Hostname: ", os.hostname());
  console.log("  • OS: ", os.platform());
  console.log("\n");

  console.log("🔍 CHECKING MONGODB ATLAS CONNECTION...\n");

  const isConnected = await checkAtlasConnection();

  if (isConnected) {
    console.log("✅ MONGODB ATLAS IS CONNECTED!");
    console.log("\n🎉 Your database is successfully connected to MongoDB Atlas.");
    console.log("   No further action needed.\n");

    // Start the server automatically
    console.log("🚀 Starting backend server...");
    exec('cd backend && npm start', (error, stdout, stderr) => {
      if (error) {
        console.error("Error starting server:", error);
      }
    });

    return;
  }

  console.log("❌ MONGODB ATLAS IS NOT CONNECTED!");
  console.log("\n📋 TO CONNECT AUTOMATICALLY:\n");

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║                    CONNECTION INSTRUCTIONS                   ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  console.log("1️⃣  OPEN BROWSER:");
  console.log("   🌐 Go to: https://www.mongodb.com/cloud/atlas");
  console.log("   🔐 Login to your account\n");

  console.log("2️⃣  NAVIGATE TO NETWORK ACCESS:");
  console.log("   📁 Click your Cluster (Cluster0)");
  console.log("   🔗 Click 'NETWORK ACCESS' tab\n");

  console.log("3️⃣  ADD YOUR IP ADDRESS:");
  console.log("   ➕ Click '+ ADD IP ADDRESS'");
  console.log("   📍 Select 'Add Current IP Address'");
  console.log(`   🔢 OR manually enter: ${localIP}`);
  console.log("   ✅ Click 'Confirm'\n");

  console.log("4️⃣  WAIT FOR ACTIVATION:");
  console.log("   ⏱️  Wait 1-2 minutes for changes to apply");
  console.log("   📊 Status should show 'Active'\n");

  console.log("5️⃣  AUTO-CONNECT:");
  console.log("   🔄 This script will automatically restart your server");
  console.log("   ✅ Connection will be verified\n");

  // Wait for user to complete the steps
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("\n❓ Have you completed the IP whitelisting in MongoDB Atlas? (y/n): ", async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log("\n🔄 Restarting server and checking connection...\n");

      // Kill any existing server process
      exec('taskkill /f /im node.exe /fi "WINDOWTITLE eq npm*"', () => {
        // Start server after a brief delay
        setTimeout(() => {
          console.log("🚀 Starting backend server...");
          exec('cd backend && npm start', (error, stdout, stderr) => {
            if (error) {
              console.error("❌ Error starting server:", error);
              return;
            }

            // Check if Atlas connected in the output
            if (stdout.includes('Successfully connected to MongoDB Atlas')) {
              console.log("\n🎉 SUCCESS! MongoDB Atlas is now connected!");
              console.log("   Your application is ready to use.\n");
            } else {
              console.log("\n⚠️  Still connected to Local MongoDB.");
              console.log("   Please double-check your IP whitelisting in MongoDB Atlas.\n");
            }
          });
        }, 3000);
      });
    } else {
      console.log("\n⏳ Please complete the IP whitelisting steps first.");
      console.log("   Run this script again when ready.\n");
    }

    rl.close();
  });
}

main().catch(console.error);