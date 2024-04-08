import { Server, Socket } from 'socket.io';

class SocketManager {
    private static instance: SocketManager;
    public io: Server | null;
    public socket: Socket | null;

    private constructor() {
        this.io = null;
        this.socket = null;
    }

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    public setIO(io: Server, socket: Socket): void {
        this.io = io;
        this.socket = socket;
    }
}

export default SocketManager;