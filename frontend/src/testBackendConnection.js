import axios from "axios";

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log("🔍 Testing backend connection to http://localhost:5000...");
    
    // Try a simple health check (if available)
    const response = await axios.get("http://localhost:5000/api/health", {
      timeout: 5000
    });
    
    console.log("✅ Backend Connected Successfully!");
    console.log("Response:", response.data);
    return { connected: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.error("❌ Backend Connection Failed - Cannot reach http://localhost:5000");
      console.error("Make sure the backend server is running with: npm start");
    } else if (error.response) {
      console.error("❌ Backend Error:", error.response.status, error.response.statusText);
    } else if (error.request) {
      console.error("❌ No response from backend:", error.message);
    } else {
      console.error("❌ Error:", error.message);
    }
    return { connected: false, error: error.message };
  }
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBackendConnection();
}
