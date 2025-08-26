import { Server } from 'socket.io';
import { createServer } from 'http';

let io = null;

function createSocketServer(app) {
    const socketServer = createServer(app);
    io = new Server(socketServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log(`Socket Connected: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`Client Disconnected: ${socket.id}`);
        });
    });
    return socketServer;
}

export { createSocketServer, io };