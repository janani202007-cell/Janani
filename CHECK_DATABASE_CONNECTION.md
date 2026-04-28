# How to Check Database Connection Status

## Method 1: Check Terminal Output ✅ (EASIEST)

Start your backend and look at the output:

```bash
cd backend
npm start
```

### ✅ Database IS Connected
```
📡 Attempting MongoDB Atlas connection (1/5)...
Server running on port 5000 🚀
✅ MongoDB Connected Successfully
```

### ❌ Database NOT Connected (Using Fallback)
```
📡 Attempting MongoDB Atlas connection (1/5)...
Server running on port 5000 🚀
📡 Attempting MongoDB Atlas connection (2/5)...
...
⚠️  Atlas connection failed. Trying local MongoDB...
✅ Local MongoDB Connected Successfully
```

### ⚠️ Database NOT Connected (Offline Mode)
```
❌ MongoDB Connection Failed!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To fix this:
📌 Option 1: Use MongoDB Atlas (Cloud)...
📌 Option 2: Use Local MongoDB...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Running in OFFLINE mode - data will not persist
```

---

## Method 2: Test with Login API 🧪

### Step 1: Start Backend
```bash
cd backend
npm start
```

### Step 2: Test in New Terminal

**Windows (Command Prompt):**
```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"STU-101\",\"password\":\"1234\"}"
```

**Mac/Linux (Terminal):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"STU-101","password":"1234"}'
```

### ✅ If Database IS Connected
```json
{
  "success": true,
  "message": "Login Success ✅",
  "user": {
    "userId": "STU-101",
    "password": "1234",
    "role": "student",
    "_id": "..."
  },
  "mode": "Database"
}
```

### 🔄 If Using Local MongoDB
```json
{
  "success": true,
  "message": "Login Success ✅",
  "user": {
    "userId": "STU-101",
    "password": "1234",
    "role": "student"
  },
  "mode": "Local MongoDB"
}
```

### ⚠️ If Using Offline Mode
```json
{
  "success": true,
  "message": "Login Success ✅ (Offline Mode)",
  "user": {
    "userId": "STU-101",
    "password": "1234",
    "role": "student"
  },
  "mode": "Offline"
}
```

---

## Method 3: Check Status Endpoint 📊

### Create a Status Check Endpoint

Add this to your `backend/server.js`:

```javascript
// Check database connection status
app.get("/api/status", (req, res) => {
  const mongoose = require("mongoose");
  const dbConnected = mongoose.connection.readyState === 1;
  
  res.json({
    server: "Running ✅",
    database: dbConnected ? "Connected ✅" : "Disconnected ❌",
    port: 5000,
    timestamp: new Date().toISOString()
  });
});
```

### Test It

```bash
curl http://localhost:5000/api/status
```

### Response (Connected)
```json
{
  "server": "Running ✅",
  "database": "Connected ✅",
  "port": 5000,
  "timestamp": "2026-04-22T10:30:45.123Z"
}
```

### Response (Disconnected)
```json
{
  "server": "Running ✅",
  "database": "Disconnected ❌",
  "port": 5000,
  "timestamp": "2026-04-22T10:30:45.123Z"
}
```

---

## Method 4: Check via Browser 🌐

### Option A: Simple Health Check
1. Open browser
2. Go to: `http://localhost:5000/`
3. You should see:
   ```json
   {"message":"Backend is working ✅"}
   ```

### Option B: Open Browser Console
1. Open browser
2. Go to: `http://localhost:3000` (frontend)
3. Open DevTools (F12)
4. Go to **Network** tab
5. Try to login
6. Check response status:
   - **200** = Success ✅
   - **500** = Server error ❌

---

## Method 5: Check Books Endpoint 📚

This is a direct database operation:

```bash
curl http://localhost:5000/api/books
```

### ✅ If Database Connected
```json
[
  {
    "_id": "...",
    "title": "Book 1",
    "author": "Author 1",
    "branch": "CS",
    "available": 5
  }
]
```

### ⚠️ If Offline Mode
```json
[]
```
(Empty array because no mock books data)

---

## Method 6: Check Loan History 🔄

```bash
curl http://localhost:5000/api/loans/STU-101
```

### ✅ If Database Connected
```json
[
  {
    "_id": "...",
    "userId": "STU-101",
    "bookTitle": "...",
    "issueDate": "2026-04-22T...",
    "dueDate": "2026-05-06T...",
    "returned": false,
    "fine": 0
  }
]
```

### ⚠️ If Offline Mode
```json
[]
```

---

## Quick Checklist

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Server Running | `curl http://localhost:5000/` | `{"message":"Backend is working ✅"}` |
| Database Status | `curl http://localhost:5000/api/status` | `"database": "Connected ✅"` |
| Login Works | Login API test | `"success": true` + `"mode": "Database"` |
| Books Available | `curl http://localhost:5000/api/books` | JSON array with books |
| Loans Available | `curl http://localhost:5000/api/loans/STU-101` | JSON array with loans |

---

## Connection Mode Indicators

### Look at the Response `"mode"` Field

```javascript
"mode": "Database"           // ✅ MongoDB is connected
"mode": "Local MongoDB"      // ✅ Local MongoDB is connected  
"mode": "Offline"            // ⚠️  No database (mock data only)
```

---

## Troubleshooting

### If showing "Offline" mode:

1. **Install Local MongoDB:**
   ```bash
   https://www.mongodb.com/try/download/community
   ```

2. **Or use MongoDB Atlas:**
   ```bash
   npm run setup
   # Follow instructions to whitelist your IP
   ```

3. **Restart backend:**
   ```bash
   npm start
   ```

---

## Summary

**Fastest Way to Check:** Look at terminal when server starts ✅

```
✅ MongoDB Connected Successfully   = Database is connected!
✅ Local MongoDB Connected          = Local database is connected
⚠️  Atlas connection failed          = Using local/offline mode
❌ MongoDB Connection Failed         = No database (offline mode)
```

**All modes work!** Data just persists differently:
- **Database Mode** → Data saved to database ✅
- **Local Mode** → Data saved to local MongoDB ✅
- **Offline Mode** → Data lost on restart ⚠️
