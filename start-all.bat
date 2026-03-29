@echo off
echo Clearing port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F 2>nul

timeout /t 2 /nobreak

echo.
echo Starting Backend on port 5000...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak

echo.
echo Starting Frontend on port 3000...
start cmd /k "cd frontend && npm start"

echo.
echo ✅ Both services starting!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
pause
