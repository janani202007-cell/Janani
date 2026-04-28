# 🚀 Database Connection - Quick Reference

## Your Current Status (from last server start)

```
📡 Attempting MongoDB Atlas connection (1/5)...
Server running on port 5000 🚀
📡 Attempting MongoDB Atlas connection (2/5)...
📡 Attempting MongoDB Atlas connection (3/5)...
📡 Attempting MongoDB Atlas connection (4/5)...
📡 Attempting MongoDB Atlas connection (5/5)...

⚠️  Atlas connection failed. Trying local MongoDB...
✅ Local MongoDB Connected Successfully
```

### What This Means ✅
- **Atlas Tried** → Attempted 5 times to connect to cloud MongoDB
- **Atlas Failed** → Your IP not whitelisted or cluster paused
- **Local Connected** → Server automatically switched to local MongoDB
- **Server Status** → ✅ **READY TO USE**

---

## How to Check Connection Status

### Method 1: Terminal Output (START HERE) ✅
When you run `npm start`, check the output:

```
✅ MongoDB Connected Successfully     = CONNECTED to MongoDB
✅ Local MongoDB Connected            = CONNECTED to Local DB
⚠️  Atlas connection failed            = Using local DB
❌ Running in OFFLINE mode            = No database (mock data)
```

---

### Method 2: Test Login API (5 seconds)

**Open PowerShell in project root:**
```powershell
cd fsd-project-1
.\TEST_CONNECTION.ps1
```

**Or manually (Windows):**
```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"STU-101\",\"password\":\"1234\"}"
```

**Response shows connection mode:**
```json
{
  "success": true,
  "message": "Login Success ✅",
  "mode": "Local MongoDB"    ← THIS SHOWS YOUR CONNECTION MODE
}
```

---

### Method 3: Check Books Endpoint

```cmd
curl http://localhost:5000/api/books
```

**Connected:** Returns array of books (may be empty)
```json
[]
```

**Offline:** Still works but no persistence
```json
[]
```

---

## 🎯 Quick Status Check

| Status | What to Look For | Action |
|--------|-----------------|--------|
| ✅ Connected | "✅ MongoDB Connected" in terminal | Everything works great! |
| ✅ Local DB | "✅ Local MongoDB Connected" | Restart to try Atlas |
| ⚠️ Offline | "⚠️ Running in OFFLINE mode" | Install Local MongoDB |

---

## 3-Step Verification

### Step 1: Start Backend
```bash
cd backend
npm start
```

### Step 2: Look at Terminal Output
- If see `✅ Connected` → **Database is working!** ✅
- If see `✅ Local MongoDB` → **Local DB is working!** ✅  
- If see `⚠️ OFFLINE` → **No database (use mock data)** ⚠️

### Step 3: Test API (Optional)
```powershell
.\TEST_CONNECTION.ps1
```

---

## Connection Modes Explained

### 🟢 Mode: Database
```json
"mode": "Database"
```
- Connected to MongoDB Atlas (Cloud)
- All data persists permanently ✅
- Most reliable for production

### 🟢 Mode: Local MongoDB
```json
"mode": "Local MongoDB"
```
- Connected to local MongoDB installation
- All data persists on your computer ✅
- Good for development offline

### 🟡 Mode: Offline
```json
"mode": "Offline"
```
- No database connected
- Using hardcoded mock data
- Data lost on server restart ⚠️
- Login still works (for testing)

---

## If You See "Local MongoDB Connected"

This means:
1. ✅ Server is running
2. ❌ Atlas connection failed (likely IP not whitelisted)
3. ✅ Local MongoDB is installed and running
4. ✅ Everything still works!

**To use Atlas instead:**
```bash
npm run setup
# Follow the guide to whitelist your IP
npm start
```

---

## If You See "OFFLINE mode"

This means:
1. ✅ Server is running
2. ❌ No MongoDB available
3. ⚠️ Limited functionality (mock data only)

**To fix:**
```bash
# Option 1: Install Local MongoDB
https://www.mongodb.com/try/download/community

# Option 2: Use MongoDB Atlas
npm run setup
npm start
```

---

## Your Test Credentials

```
Student:   STU-101 / 1234
Faculty:   FAC-101 / 1234
Librarian: LIB-101 / 1234
Admin:     ADMIN / admin
```

All credentials work in **any mode** ✅

---

## FAQ

**Q: Which connection mode is best?**
A: "Database" > "Local MongoDB" > "Offline"

**Q: Can I use the app in Offline mode?**
A: Yes! Login works, but data doesn't persist.

**Q: Why did it try Atlas 5 times?**
A: Auto-retry logic. After 5 attempts, it falls back to Local MongoDB.

**Q: Can I switch modes?**
A: Yes! Just restart the server. It auto-detects available databases.

**Q: Is Local MongoDB safe?**
A: Yes! It's the same database engine, just on your computer.

---

## Next Steps

1. ✅ Check your connection status (see above)
2. ✅ Start frontend: `cd frontend && npm start`
3. ✅ Test login functionality
4. ✅ Test book operations
5. ✅ Test loan operations

**All ready to go!** 🎉
