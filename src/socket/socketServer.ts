import { Server, Socket } from "socket.io";
import RoomController from "../Controllers/SocketControllers/RoomController";

const SocketServer = (socket: Socket, io: Server) => {

    const roomController = new RoomController(socket, io);

    socket.on('room:join', roomController.joinRoom);

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
    });

}

export default SocketServer;