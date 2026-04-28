import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook to check backend connection status
 */
export const useBackendConnection = () => {
  const [status, setStatus] = useState({
    connected: false,
    loading: true,
    error: null,
    database: "unknown"
  });

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));
      
      const response = await axios.get("http://localhost:5000/api/health", {
        timeout: 5000
      });
      
      setStatus({
        connected: true,
        loading: false,
        error: null,
        database: response.data.database || "connected"
      });
    } catch (error) {
      setStatus({
        connected: false,
        loading: false,
        error: error.message,
        database: "disconnected"
      });
    }
  };

  return { ...status, retry: checkConnection };
};

export default useBackendConnection;
