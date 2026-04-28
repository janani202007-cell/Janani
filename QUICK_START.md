# Quick Connection Checklist

## 🚀 5-Minute Setup Guide

### Before Starting:
- [ ] Have MongoDB Atlas account ready
- [ ] Know your database password
- [ ] Both backends and frontend folders ready

---

## Phase 1: Fix MongoDB Connection (5 min)

### 1. Add Your IP to MongoDB Atlas
```
Go to: MongoDB Atlas → Network Access
Click: "+ Add IP Address"
Enter: Your IP address (or 0.0.0.0/0 for all IPs)
Click: Confirm
```

**Don't know your IP?**
```bash
# Windows Command Prompt
ipconfig /all
# Look for IPv4 Address
```

### 2. Check If Cluster is Running
```
Go to: MongoDB Atlas → Clusters
Check: Cluster0 status (should be green)
If Paused: Click "Resume"
```

### 3. Test Connection
```bash
cd backend
node server.js
```

**Should see:**
```
✅ MongoDB Connected Successfully
Server running on port 5000 🚀
```

---

## Phase 2: Install & Run Services (5 min)

### Terminal 1: Start Backend
```bash
cd backend
npm install        # (if not done)
node server.js
```

**Expected:**
```
✅ MongoDB Connected Successfully
Server running on port 5000 🚀
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install        # (if not done)
npm start
```

**Expected:**
```
Compiled successfully!
You can now view frontend in your browser
http://localhost:3000
```

---

## Phase 3: Test Connection (2 min)

### Test 1: Backend is Running
```bash
curl http://localhost:5000/
# Should return: {"message":"Backend is working ✅"}
```

### Test 2: Frontend is Running
```
Open browser: http://localhost:3000
Should see: Library Management System UI
```

### Test 3: Login API
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"STU-101\",\"password\":\"1234\"}"

# Should return: {"success":true,"message":"Login Success","user":{...}}
```

---

## ⚠️ If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| MongoDB connection failed | Run Phase 1 again |
| Port 5000 in use | `netstat -ano \| findstr :5000` then kill process |
| Port 3000 in use | `netstat -ano \| findstr :3000` then kill process |
| Frontend shows blank | Wait for compilation, refresh browser |
| CORS error in console | Check backend is running on 5000 |
| Login returns 500 error | Check MongoDB connection in Phase 1 |

---

## 📝 Default Test Users

```
Student: STU-101 / 1234
Faculty: FAC-101 / 1234
Librarian: LIB-101 / 1234
Admin: ADMIN / admin
```

---

## ✅ Success - You're Connected!

Once everything is running:
- ✅ Frontend can talk to Backend
- ✅ Backend is connected to MongoDB
- ✅ Users can login
- ✅ Data persists in database

**Happy Coding! 🎉**
