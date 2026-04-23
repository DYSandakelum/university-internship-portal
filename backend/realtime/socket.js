const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let ioInstance = null;

const PUBLIC_ROOM = 'job-matching:public';

const getTokenFromSocket = (socket) => {
    const authToken = socket?.handshake?.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) return authToken.trim();

    const queryToken = socket?.handshake?.query?.token;
    if (typeof queryToken === 'string' && queryToken.trim()) return queryToken.trim();

    const authHeader = socket?.handshake?.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }

    return '';
};

const initRealtime = ({ server, corsOrigins = [] }) => {
    if (ioInstance) return ioInstance;

    ioInstance = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
                if (isLocalhost || corsOrigins.includes(origin)) {
                    return callback(null, true);
                }

                return callback(new Error(`CORS blocked for socket origin: ${origin}`));
            },
            credentials: true
        }
    });

    ioInstance.use((socket, next) => {
        try {
            const token = getTokenFromSocket(socket);
            if (!token) {
                socket.user = null;
                return next();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = {
                id: String(decoded.id || ''),
                role: decoded.role || 'student'
            };
            return next();
        } catch {
            socket.user = null;
            return next();
        }
    });

    ioInstance.on('connection', (socket) => {
        socket.join(PUBLIC_ROOM);

        if (socket.user?.id) {
            socket.join(`user:${socket.user.id}`);
        }

        socket.emit('realtime:ready', {
            connectedAt: new Date().toISOString(),
            userId: socket.user?.id || null
        });
    });

    return ioInstance;
};

const getIO = () => ioInstance;

const emitToPublic = (event, payload) => {
    if (!ioInstance) return;
    ioInstance.to(PUBLIC_ROOM).emit(event, payload);
};

const emitToUser = (userId, event, payload) => {
    if (!ioInstance || !userId) return;
    ioInstance.to(`user:${String(userId)}`).emit(event, payload);
};

const emitJobMatchingDataChanged = ({
    userId = null,
    entity,
    action,
    payload = {}
}) => {
    const packet = {
        entity,
        action,
        payload,
        timestamp: new Date().toISOString()
    };

    if (userId) {
        emitToUser(userId, 'job-matching:data-changed', packet);
        return;
    }

    emitToPublic('job-matching:data-changed', packet);
};

module.exports = {
    initRealtime,
    getIO,
    emitToPublic,
    emitToUser,
    emitJobMatchingDataChanged
};
