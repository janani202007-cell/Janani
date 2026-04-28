# Database Connection Setup Guide

## ✅ Fixes Applied

### Backend Fixes:
1. ✅ Added `dotenv` package to dependencies
2. ✅ Fixed `authroutes.js` - now imports correct `User` model (was importing `Book`)
3. ✅ Registered all routes in `server.js` (/api/auth, /api/books, /api/loans)
4. ✅ Added comprehensive error handling to all routes
5. ✅ Fixed model imports to use lowercase file names (book.js, not Book.js)
6. ✅ Improved MongoDB connection error messages

### Frontend:
- ✅ Axios already installed and configured

---

## 🚀 How to Run

### Backend Setup:
```bash
cd backend
npm install
node server.js
```

You should see:
```
✅ MongoDB Connected Successfully
Server running on port 5000 🚀
```

### Frontend Setup:
```bash
cd frontend
npm install
npm start
```

---

## 📡 API Endpoints

### Authentication
- **POST** `/api/auth/login` - User login
  ```json
  {
    "userId": "STU-101",
    "password": "1234"
  }
  ```

### Books
- **GET** `/api/books` - Get all books
- **POST** `/api/books/add` - Add new book
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "branch": "Branch",
    "available": 5
  }
  ```

### Loans
- **POST** `/api/loans/issue` - Issue a book
- **POST** `/api/loans/return` - Return a book
- **GET** `/api/loans/:userId` - Get user's loan history

---

## 🗄️ Database Models

### User
```javascript
{
  userId: String,
  password: String,
  role: String
}
```

### Book
```javascript
{
  title: String,
  author: String,
  branch: String,
  available: Number
}
```

### Loan
```javascript
{
  userId: String,
  bookId: String,
  bookTitle: String,
  role: String,
  issueDate: Date,
  dueDate: Date,
  returned: Boolean,
  fine: Number
}
```

---

## ⚙️ Environment Variables

Backend `.env` file (already configured):
```
MONGO_URI="mongodb+srv://monikapavuluru21_db_user:4CSSaa3dIB0b2pj@cluster0.joqcmge.mongodb.net/?appName=Cluster0"
```

---

## 🧪 Testing

### Test Backend Connection:
```bash
curl http://localhost:5000/
```

### Test Login API:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"STU-101","password":"1234"}'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed:
1. Check internet connection
2. Verify MongoDB URI in `.env` file
3. Check if IP address is whitelisted in MongoDB Atlas

### Routes Not Working:
1. Ensure backend is running on port 5000
2. Check CORS is enabled
3. Verify all dependencies are installed

### Frontend Cannot Connect:
1. Ensure backend is running
2. Check `api.js` baseURL is set to `http://localhost:5000`
3. Check browser console for errors

---

## 📝 Next Steps

1. Install dependencies: `npm install` in both backend and frontend
2. Start backend: `node server.js`
3. Start frontend: `npm start`
4. Test login with provided credentials
