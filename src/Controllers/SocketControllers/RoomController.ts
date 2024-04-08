import { isObjectIdOrHexString } from "mongoose";
import InterviewRequest from "../../Models/InterviewRequest";
import BaseController from "./BaseController";

const rooms: { [key: string]: string[] } = {};

export default class RoomController extends BaseController {


    joinRoom = async (data: { roomId: string, userId: string }) => {

        const { roomId, userId } = data;

        try {
            const interviewRequest = await InterviewRequest.findOne({ room: roomId });
            if (!interviewRequest) return this.socket?.emit('room:joined', {
                status: 404,
                message: 'No room found',
                success: false
            });

            if (interviewRequest.requester.toString() !== userId) {
                if (interviewRequest.responder && interviewRequest.responder.toString() !== userId) {
                    return this.socket?.emit('room:joined', {
                        status: 400,
                        message: "Unauthorized to join the room",
                        success: false
                    });
                } else {
                    await InterviewRequest.findOneAndUpdate({ room: roomId }, { responder: userId });
                }
            }

            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }

            if (!rooms[roomId].includes(userId)) {
                rooms[roomId].push(userId);
            }

            this.socket.join(roomId);

            this._io.in(roomId).emit('room:joined', {
                status: 200,
                message: "Room joined successfully",
                success: true,
                userId,
                roomId,
                usersInRoom: rooms[roomId]
            });


        } catch (error) {
        }
    }

}