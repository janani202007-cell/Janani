# MongoDB Connection Troubleshooting Guide

## ❌ Current Error
```
MongoDB Connection Failed: querySrv ECONNREFUSED _mongodb._tcp.cluster0.joqcmge.mongodb.net
```

This error means the backend cannot reach the MongoDB server.

---

## ✅ Quick Fix Checklist

### 1. **Check Internet Connection**
- Make sure you're connected to the internet
- MongoDB Atlas requires internet access

### 2. **Check MongoDB Atlas Settings**

**Step 1:** Go to https://www.mongodb.com/cloud/atlas

**Step 2:** Log in with your credentials

**Step 3:** Navigate to **Network Access**
- Click: Cluster0 → Network Access
- Check if your IP address is whitelisted
- If not, click **Add IP Address** → Add your current IP or use **0.0.0.0/0** (allows all IPs - not recommended for production)

**Step 4:** Check Cluster Status
- Go to **Clusters** 
- Check if "Cluster0" is running (green status)
- If paused, click **Resume**

### 3. **Verify MongoDB URI**

Check `.env` file has correct connection string:
```
MONGO_URI="mongodb+srv://monikapavuluru21_db_user:4CSSaa3dIB0b2pj@cluster0.joqcmge.mongodb.net/?appName=Cluster0"
```

**Verify each part:**
- `monikapavuluru21_db_user` - Database user
- `4CSSaa3dIB0b2pj` - Password
- `cluster0.joqcmge.mongodb.net` - Cluster hostname
- Should end with `/?appName=Cluster0`

### 4. **Firewall/Network Issues**

Try testing connection with MongoDB CLI:
```bash
# Install MongoDB tools if not present
npm install -g mongodb-database-tools

# Test connection (replace with your credentials)
mongosh "mongodb+srv://monikapavuluru21_db_user:4CSSaa3dIB0b2pj@cluster0.joqcmge.mongodb.net/test"
```

---

## 🔧 Step-by-Step Fix

### For Windows Users:

**Option 1: Add Your Current IP to MongoDB Atlas**
1. Open Command Prompt and run:
   ```cmd
   ipconfig /all
   ```
2. Note your IPv4 Address
3. Go to MongoDB Atlas → Network Access
4. Click **Add IP Address**
5. Enter your IP address
6. Click **Confirm**

**Option 2: Allow All IPs (For Development Only)**
1. Go to MongoDB Atlas → Network Access
2. Click **Add IP Address**
3. Enter: `0.0.0.0/0`
4. Click **Confirm**

**Option 3: Pause and Resume Cluster**
1. Go to MongoDB Atlas → Clusters
2. Find **Cluster0**
3. If it says "Paused", click **Resume**

---

## 🧪 Testing Connection

### After fixing, restart backend:
```bash
cd backend
node server.js
```

**Expected output:**
```
✅ MongoDB Connected Successfully
Server running on port 5000 🚀
```

### Test with curl (after successful connection):
```bash
# Test if backend is running
curl http://localhost:5000/

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"STU-101\",\"password\":\"1234\"}"
```

---

## 🚀 If Still Not Working

### Option 1: Use Local MongoDB (for Development)

**Install MongoDB on your machine:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install it
3. Update `.env` file:
   ```
   MONGO_URI="mongodb://localhost:27017/library-management"
   ```
4. Start MongoDB Service
5. Restart backend

### Option 2: Check MongoDB Atlas Logs

1. Go to MongoDB Atlas Dashboard
2. Click **Cluster0**
3. Go to **Logs** tab
4. Look for connection errors

---

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | IP not whitelisted in MongoDB Atlas |
| `ENOTFOUND` | DNS resolution failure - check internet |
| `AUTHENTICATION FAILED` | Wrong password or username |
| `Cluster not found` | Cluster might be deleted/paused |
| `Network timeout` | Firewall blocking MongoDB port 27017 |

---

## ✅ Success Indicators

Once connected, you should see:
```
✅ MongoDB Connected Successfully
Server running on port 5000 🚀
```

And the backend will:
- Accept API requests
- Store data in MongoDB
- Retrieve user/book/loan information
