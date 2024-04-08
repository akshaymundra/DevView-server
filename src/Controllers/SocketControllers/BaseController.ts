import { Server, Socket } from "socket.io";

class BaseController {
    socket: Socket;
    _io: Server;

    constructor(socket: Socket, io: Server) {
        this.socket = socket;
        this._io = io;
    }
}

export default BaseController;