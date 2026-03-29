# Clear port 3000
Write-Host "Clearing port 3000..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
foreach ($process in $processes) {
    Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

Write-Host "`n✅ Port 3000 cleared!" -ForegroundColor Green
Write-Host "`nStarting Backend on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "`n✅ Both services starting!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Green
