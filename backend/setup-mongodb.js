#!/usr/bin/env node

const { getLocalIP, showMongoDBSetupGuide } = require("./mongoConfig");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function showMenu() {
  showMongoDBSetupGuide();
  
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║                      WHAT'S YOUR CHOICE?                   ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("1️⃣  I'll use MongoDB Atlas (Cloud)");
  console.log("2️⃣  I'll use Local MongoDB");
  console.log("3️⃣  Just show me my IP address");
  console.log("4️⃣  Exit\n");
  
  return new Promise((resolve) => {
    rl.question("Select option (1-4): ", (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  let isRunning = true;
  
  while (isRunning) {
    const choice = await showMenu();
    
    switch (choice) {
      case "1":
        console.log("\n✅ You selected: MongoDB Atlas");
        console.log("   After adding your IP to MongoDB Atlas, restart:");
        console.log("   > node server.js\n");
        break;
        
      case "2":
        console.log("\n✅ You selected: Local MongoDB");
        console.log("   Make sure MongoDB service is running, then:");
        console.log("   > node server.js\n");
        break;
        
      case "3":
        console.log(`\n📍 Your Local IP Address: ${getLocalIP()}\n`);
        break;
        
      case "4":
        console.log("\nGoodbye! 👋\n");
        isRunning = false;
        break;
        
      default:
        console.log("\n❌ Invalid option. Please try again.\n");
    }
  }
  
  rl.close();
}

main().catch(console.error);
