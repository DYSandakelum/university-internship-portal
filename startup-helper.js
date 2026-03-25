const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const BACKEND_PORT = 5000;
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 1000; // 1 second
let retryCount = 0;

console.log('🚀 Starting CareerSync Backend...');

// Start backend process
const backendProcess = spawn('npm', ['--prefix', 'backend', 'run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.resolve(__dirname)
});

// Function to check if backend is ready
function checkBackendReady() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
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

    console.error('❌ Backend failed to start after 30 seconds');
    process.exit(1);
}

// Start frontend process
async function startFrontend() {
    const isReady = await waitForBackend();
    if (isReady) {
        console.log('🌐 Starting frontend on port 3010...\n');
        const frontendProcess = spawn('npm', ['--prefix', 'frontend', 'start'], {
            stdio: 'inherit',
            shell: true,
            cwd: path.resolve(__dirname)
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
