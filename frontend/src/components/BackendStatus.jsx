import React from "react";
import useBackendConnection from "../hooks/useBackendConnection";
import "./BackendStatus.css";

/**
 * Component to display backend connection status
 * Usage: <BackendStatus />
 */
const BackendStatus = () => {
  const { connected, loading, error, database, retry } = useBackendConnection();

  return (
    <div className={`backend-status ${connected ? "connected" : "disconnected"}`}>
      <div className="status-indicator">
        <span className="status-dot"></span>
        <span className="status-text">
          {loading ? "Checking..." : connected ? "Connected" : "Disconnected"}
        </span>
      </div>
      
      {!connected && (
        <div className="status-details">
          <p className="error-message">
            ⚠️ Backend server not available
          </p>
          <p className="help-text">
            Make sure to run: <code>npm start</code> in the backend folder
          </p>
          <button onClick={retry} className="retry-btn">
            Retry Connection
          </button>
        </div>
      )}
      
      {connected && (
        <div className="status-details">
          <p className="success-message">✅ Backend connected</p>
          <p className="db-status">Database: {database}</p>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
