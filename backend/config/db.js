const mongoose = require('mongoose');

let inMemoryServer;
let usingInMemory = false;

const shouldFallbackToInMemory = (error, mongoUri) => {
    const enabled = String(process.env.USE_IN_MEMORY_DB || '').toLowerCase() === 'true';

    // Allow explicit opt-in regardless of environment.
    if (enabled) return true;

    // Implicit fallback only in development when targeting localhost.
    if (process.env.NODE_ENV !== 'development') return false;

    const isLocalMongo =
        typeof mongoUri === 'string' &&
        (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'));

    if (!isLocalMongo) return false;

    const message = String(error?.message || '');
    return message.includes('ECONNREFUSED') || message.includes('failed to connect') || message.includes('connect ECONNREFUSED');
};

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('Error: MONGO_URI is missing in .env');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(mongoUri);
        usingInMemory = false;
        connectDB.usingInMemory = false;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        if (!shouldFallbackToInMemory(error, mongoUri)) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }

        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            inMemoryServer = await MongoMemoryServer.create();
            const memoryUri = inMemoryServer.getUri();
            const conn = await mongoose.connect(memoryUri);
            usingInMemory = true;
            connectDB.usingInMemory = true;
            console.log('MongoDB Connected: in-memory server (development)');
            return conn;
        } catch (memoryError) {
            console.error(`Error: ${memoryError.message}`);
            process.exit(1);
        }
    }
};

connectDB.disconnect = async () => {
    try {
        await mongoose.disconnect();
    } catch (_) {
        // ignore
    }

    if (inMemoryServer) {
        try {
            await inMemoryServer.stop();
        } catch (_) {
            // ignore
        }
        inMemoryServer = undefined;
    }

    usingInMemory = false;
    connectDB.usingInMemory = false;
};

connectDB.usingInMemory = usingInMemory;

module.exports = connectDB;