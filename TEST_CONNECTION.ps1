# Test Database Connection Status

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " DATABASE CONNECTION TEST" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "1. Testing Backend Server (Health Check)" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────`n" -ForegroundColor Gray
Invoke-WebRequest -Uri "http://localhost:5000/" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json
Write-Host "`n"

Write-Host "2. Testing Login API (Database Check)" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────`n" -ForegroundColor Gray
$loginPayload = @{
    userId = "STU-101"
    password = "1234"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginPayload `
  -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json

Write-Host "Response:" -ForegroundColor Green
$loginResponse | ConvertTo-Json

Write-Host "`nConnection Mode: " -ForegroundColor Yellow -NoNewline
if ($loginResponse.mode -eq "Database") {
    Write-Host "✅ DATABASE CONNECTED" -ForegroundColor Green
} elseif ($loginResponse.mode -eq "Local MongoDB") {
    Write-Host "✅ LOCAL MONGODB CONNECTED" -ForegroundColor Green
} else {
    Write-Host "⚠️  OFFLINE MODE" -ForegroundColor Yellow
}

Write-Host "`n"
Write-Host "3. Testing Books API (Database Query)" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────`n" -ForegroundColor Gray
try {
    $booksResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/books" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
    Write-Host "Books Found: $($booksResponse.Count)" -ForegroundColor Cyan
    $booksResponse | ConvertTo-Json
} catch {
    Write-Host "Error retrieving books" -ForegroundColor Red
}

Write-Host "`n"
Write-Host "4. Testing User Loans (Database Query)" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────`n" -ForegroundColor Gray
try {
    $loansResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/loans/STU-101" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
    Write-Host "Loans Found: $($loansResponse.Count)" -ForegroundColor Cyan
    $loansResponse | ConvertTo-Json
} catch {
    Write-Host "No loans found or error retrieving loans" -ForegroundColor Yellow
}

Write-Host "`n"
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " CONNECTION TEST COMPLETE" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "CONNECTION INDICATORS:" -ForegroundColor Green
Write-Host '  "mode": "Database"       = Connected to MongoDB Atlas ✅' -ForegroundColor Green
Write-Host '  "mode": "Local MongoDB"  = Using Local MongoDB ✅' -ForegroundColor Green
Write-Host '  "mode": "Offline"        = No Database (Mock Data) ⚠️' -ForegroundColor Yellow
Write-Host "`n"
