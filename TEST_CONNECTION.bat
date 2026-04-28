@echo off
REM Test Database Connection Status

echo.
echo ============================================
echo  DATABASE CONNECTION TEST
echo ============================================
echo.

echo 1. Testing Backend Server (Health Check)
echo.
curl http://localhost:5000/
echo.
echo.

echo ============================================
echo.
echo 2. Testing Login API (Database Check)
echo.
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"STU-101\",\"password\":\"1234\"}"
echo.
echo.

echo ============================================
echo.
echo 3. Testing Books API (Database Query)
echo.
curl http://localhost:5000/api/books
echo.
echo.

echo ============================================
echo.
echo 4. Checking User Loans (Database Query)
echo.
curl http://localhost:5000/api/loans/STU-101
echo.
echo.

echo ============================================
echo CONNECTION TEST COMPLETE
echo ============================================
echo.
echo Look for these indicators:
echo   "mode": "Database"       = Connected to MongoDB ✅
echo   "mode": "Local MongoDB"  = Using Local MongoDB ✅
echo   "mode": "Offline"        = No Database (Mock Data) ⚠️
echo.
pause
