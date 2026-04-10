const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const BACKEND_PORT = Number.parseInt(process.env.BACKEND_PORT, 10) || 5000;
const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1';
const FRONTEND_DEFAULT_PORT = 3010;

const RETRY_INTERVAL = 1000; // 1 second
const BACKEND_STARTUP_TIMEOUT_MS =
    Number.parseInt(process.env.BACKEND_STARTUP_TIMEOUT_MS, 10) || 180000;
const MAX_RETRIES = Math.max(1, Math.ceil(BACKEND_STARTUP_TIMEOUT_MS / RETRY_INTERVAL));
let retryCount = 0;

console.log('🚀 Starting CareerSync Backend...');

// Start backend process
const backendProcess = spawn('npm', ['--prefix', 'backend', 'run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname,
    env: {
        ...process.env,
        // Ensure dev defaults for the backend when using the workspace dev script.
        // This enables the in-memory DB fallback in `backend/config/db.js` when local Mongo isn't running.
        NODE_ENV: process.env.NODE_ENV || 'development'
    }
});

// Function to check if backend is ready
function checkBackendReady() {
    return new Promise((resolve) => {
        const options = {
            hostname: BACKEND_HOST,
            family: 4,
            port: BACKEND_PORT,
            path: '/',
            method: 'GET',
            timeout: 2000
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        req.on('error', () => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Wait for backend to be ready
async function waitForBackend() {
    console.log(`⏳ Waiting for backend to start on port ${BACKEND_PORT}...`);

    while (retryCount < MAX_RETRIES) {
        const isReady = await checkBackendReady();
        if (isReady) {
            console.log('✅ Backend is ready! Starting frontend...\n');
            return true;
        }
        retryCount++;
        console.log(`   Attempt ${retryCount}/${MAX_RETRIES}... (${retryCount * RETRY_INTERVAL / 1000}s)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }

    console.error(
        `❌ Backend failed to start after ${Math.round(
            (MAX_RETRIES * RETRY_INTERVAL) / 1000
        )} seconds`
    );
    process.exit(1);
}

// Start frontend process
async function startFrontend() {
    const isReady = await waitForBackend();
    if (isReady) {
        const preferredPort = Number.parseInt(process.env.PORT, 10);
        const basePort = Number.isFinite(preferredPort) ? preferredPort : FRONTEND_DEFAULT_PORT;
        const frontendPort = await findAvailablePort(basePort, basePort + 50);

        console.log(`🌐 Starting frontend on port ${frontendPort}...\n`);
        const frontendProcess = spawn('npm', ['--prefix', 'frontend', 'start'], {
            stdio: 'inherit',
            shell: true,
            cwd: __dirname,
            env: {
                ...process.env,
                PORT: String(frontendPort),
                // CRA respects this env var; default to Chrome per request.
                BROWSER: process.env.BROWSER || 'chrome'
            }
        });

        frontendProcess.on('error', (error) => {
            console.error('Frontend process error:', error);
            process.exit(1);
        });

        frontendProcess.on('exit', (code) => {
            console.log('Frontend stopped');
            backendProcess.kill();
            process.exit(code);
        });
    }
}

function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = http
            .createServer(() => {})
            .listen(port, '0.0.0.0');

        server.on('listening', () => {
            server.close(() => resolve(true));
        });

        server.on('error', () => {
            resolve(false);
        });
    });
}

async function findAvailablePort(startPort, endPort) {
    for (let port = startPort; port <= endPort; port++) {
        // eslint-disable-next-line no-await-in-loop
        const available = await isPortAvailable(port);
        if (available) return port;
    }
    console.error(`❌ No available ports found in range ${startPort}-${endPort}`);
    process.exit(1);
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    backendProcess.kill();
    process.exit(0);
});

backendProcess.on('error', (error) => {
    console.error('Backend process error:', error);
    process.exit(1);
});

// Start the startup sequence
startFrontend().catch(error => {
    console.error('Startup error:', error);
    backendProcess.kill();
    process.exit(1);
});
