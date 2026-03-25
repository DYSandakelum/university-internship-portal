# 🚀 CareerSync Startup Guide

## One-Command Startup (RECOMMENDED)

### Windows PowerShell / Terminal:
```bash
npm run dev
```

That's it! This will:
1. ✅ Start the backend server on port 5000
2. ⏳ Wait for the backend to be fully ready (with health checks)
3. 🌐 Start the frontend React app on port 3010
4. 🔄 Automatically retry any failed connections with exponential backoff
5. 📱 Automatically open Chrome browser

### What to expect:
```
🚀 Starting CareerSync Backend...
⏳ Waiting for backend to start on port 5000...
   Attempt 1/30... (1s)
   Attempt 2/30... (2s)
✅ Backend is ready! Starting frontend...
═══════════════════════════════════════════
✅ Backend Server Ready on port 5000
📡 API Base URL: http://localhost:5000/api
═══════════════════════════════════════════

🌐 Starting frontend on port 3010...
[compile complete message from React]
```

## Individual Commands (if needed)

### Start only backend:
```bash
npm run backend
```

### Start only frontend:
```bash
npm --prefix frontend start
```

## How We Fixed the "Unable to Connect" Issue

### Problems we identified:
1. ❌ Frontend was starting before backend was fully listening
2. ❌ No health check mechanism to verify backend readiness
3. ❌ API requests had no retry logic for temporary failures

### Solutions implemented:

#### 1. Smart Startup Helper (`startup-helper.js`)
- Starts backend first
- Polls backend health check endpoint every 1 second
- Waits max 30 seconds for backend readiness
- Only starts frontend after backend confirms it's ready
- Shows clear progress indicators

#### 2. API Retry Logic (`frontend/src/services/api.js`)
- Automatically retries failed requests up to 3 times
- Uses exponential backoff (1s → 2s → 4s)
- Retries on network errors and server errors (5xx)
- Logs retry attempts to console

#### 3. Better Backend Logging (`backend/server.js`)
- Clear visual indicator when server is fully ready
- Shows the API base URL for debugging
- Graceful shutdown handling

## Troubleshooting

### Still getting "Unable to Connect"?

1. **Check if ports are already in use:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
   Get-NetTCPConnection -LocalPort 3010 -ErrorAction SilentlyContinue
   ```

2. **Kill existing processes:**
   ```powershell
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   taskkill /PID <PID> /F  # For port 3010
   ```

3. **Clear npm cache and reinstall dependencies:**
   ```bash
   npm run install:all
   npm cache clean --force
   ```

4. **Check MongoDB connection:**
   - Backend won't fully start if MongoDB Atlas isn't reachable
   - Check `.env` file has correct `MONGODB_URI`

5. **View full startup logs:**
   - The startup helper will show all attempts
   - Check console for error messages

## Environment Configuration

Frontend (`frontend/.env.development`):
```
PORT=3010
BROWSER=chrome
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Backend (`.env`):
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
[other configs]
```

## Notes
- Ctrl+C will gracefully shut down both processes
- Browser will auto-open at `http://localhost:3010`
- All API calls have built-in retry logic (transparent to user)
