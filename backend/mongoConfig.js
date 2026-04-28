const os = require("os");

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

// Display MongoDB setup guide
function showMongoDBSetupGuide() {
  const localIP = getLocalIP();
  
  console.clear();
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         MONGODB CONNECTION SETUP GUIDE                     ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\n");
  
  console.log("🖥️  YOUR SYSTEM INFORMATION:");
  console.log("  • Local IP Address: ", localIP);
  console.log("  • Hostname: ", os.hostname());
  console.log("  • OS: ", os.platform());
  console.log("\n");
  
  console.log("📌 OPTION 1: MongoDB Atlas (Cloud Database)");
  console.log("─".repeat(60));
  console.log("Step 1: Go to https://www.mongodb.com/cloud/atlas");
  console.log("Step 2: Login to your account");
  console.log("Step 3: Click your Cluster (e.g., Cluster0)");
  console.log("Step 4: Go to NETWORK ACCESS tab");
  console.log("Step 5: Click '+ Add IP Address'");
  console.log(`Step 6: Enter your IP: ${localIP}`);
  console.log("        OR use 0.0.0.0/0 for all IPs (development only)");
  console.log("Step 7: Click 'Confirm'");
  console.log("Step 8: Wait 1-2 minutes for changes to apply");
  console.log("Step 9: Restart this server\n");
  
  console.log("📌 OPTION 2: Local MongoDB (Offline Development)");
  console.log("─".repeat(60));
  console.log("Step 1: Download MongoDB Community:");
  console.log("        https://www.mongodb.com/try/download/community");
  console.log("Step 2: Install with default settings");
  console.log("Step 3: Start MongoDB service:");
  console.log("        • Windows: mongod --dbpath \"C:\\data\\db\"");
  console.log("        • Or use MongoDB Compass GUI");
  console.log("Step 4: Restart this server\n");
  
  console.log("🔄 QUICK TEST:");
  console.log("─".repeat(60));
  console.log("Run this command in another terminal:");
  console.log(`  curl http://localhost:5000/\n`);
  
  console.log("After fixing connection, server will show: ✅ MongoDB Connected\n");
}

module.exports = { getLocalIP, showMongoDBSetupGuide };

// If run directly
if (require.main === module) {
  showMongoDBSetupGuide();
}
