# Backend Connection Guide

## How to Check Backend Connection

Your frontend project now has multiple ways to check if the backend is connected:

### 1️⃣ **Visual Status Component (Easiest)**

Add the BackendStatus component to any page in your React app:

```jsx
import BackendStatus from "./components/BackendStatus";

function App() {
  return (
    <div>
      <BackendStatus />
      {/* Rest of your app */}
    </div>
  );
}
```

This displays a live indicator showing:
- ✅ Connected status
- ⚠️ Disconnected status with error message
- 🔄 Retry button to check connection

---

### 2️⃣ **Using the Custom Hook**

In any React component, use the `useBackendConnection` hook:

```jsx
import useBackendConnection from "./hooks/useBackendConnection";

function MyComponent() {
  const { connected, loading, error, database } = useBackendConnection();
  
  return (
    <div>
      {loading && <p>Checking connection...</p>}
      {connected && <p>✅ Backend is ready! Database: {database}</p>}
      {!connected && <p>❌ Backend error: {error}</p>}
    </div>
  );
}
```

**Hook Properties:**
- `connected` (boolean) - True if backend is reachable
- `loading` (boolean) - True while checking connection
- `error` (string) - Error message if connection fails
- `database` (string) - Database connection status
- `retry` (function) - Call to manually retry connection

---

### 3️⃣ **Browser Console Check**

Open browser DevTools (F12 → Console) and run:

```javascript
import api from "./services/api";

api.get("http://localhost:5000/api/health")
  .then(res => console.log("✅ Connected:", res.data))
  .catch(err => console.error("❌ Error:", err.message));
```

---

### 4️⃣ **Test File (Node)**

Use the test file created in `frontend/src/testBackendConnection.js`:

```bash
# From frontend directory
node src/testBackendConnection.js
```

---

## Prerequisites

Before testing, make sure:

1. **Backend is running:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   You should see:
   ```
   🚀 Library Management Backend Server
   📍 Server running on: http://localhost:5000
   💾 Database: Connected ✅ (or Offline ⚠️)
   ```

2. **Frontend is running:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Port 5000 is available** (backend's default port)

---

## Troubleshooting

### ❌ Error: "Cannot reach http://localhost:5000"

**Possible Causes:**
- Backend server not running
- Backend running on different port
- Firewall blocking localhost:5000

**Solutions:**
1. Check if backend is running: `npm start` in backend folder
2. Check backend `server.js` for `PORT` variable
3. Update frontend `api.js` to match backend port:
   ```javascript
   // frontend/src/services/api.js
   const API_BASE_URL = "http://localhost:YOUR_PORT/api";
   ```

### ⚠️ Database Connection Failed

**In Backend Console:**
```
❌ MongoDB Connection Error
```

**Solutions:**
1. Check `.env` file in backend folder has `MONGO_URI`
2. Verify MongoDB connection string
3. Check network/IP whitelist in MongoDB Atlas
4. Run: `node setup-mongodb.js`

### 🔌 Connection Timeout

**Possible Causes:**
- Network issue
- Backend server crashed
- Wrong port/URL

**Solutions:**
```bash
# Restart backend
cd backend
npm start

# Or check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux
```

---

## API Endpoints Available

Once connected, these endpoints are ready:

```
GET  http://localhost:5000/api/health      # Health check
GET  http://localhost:5000/                # Root info
POST http://localhost:5000/api/auth/login  # Login
GET  http://localhost:5000/api/books       # Get books
```

---

## Quick Test Commands

### Windows PowerShell
```powershell
# Test backend response
Invoke-WebRequest http://localhost:5000/api/health | ConvertTo-Json
```

### macOS/Linux
```bash
# Test backend response
curl http://localhost:5000/api/health | json_pp
```

### Using Node
```javascript
const axios = require('axios');
axios.get('http://localhost:5000/api/health')
  .then(r => console.log(r.data))
  .catch(e => console.error(e.message));
```

---

## Next Steps

✅ Once backend is confirmed connected:

1. Import `api` from `frontend/src/services/api.js` in your components
2. Use it to make API calls:
   ```javascript
   import api from "../services/api";
   
   const books = await api.get("/books");
   await api.post("/loans/issue", loanData);
   ```

3. Add `BackendStatus` component to your main layout for always-visible status indicator

---

## Files Created/Modified

- ✅ `backend/server.js` - Fixed with Express setup + health check
- ✅ `frontend/src/testBackendConnection.js` - Connection test utility
- ✅ `frontend/src/hooks/useBackendConnection.js` - React hook for status
- ✅ `frontend/src/components/BackendStatus.jsx` - Visual status component
- ✅ `frontend/src/components/BackendStatus.css` - Component styles
