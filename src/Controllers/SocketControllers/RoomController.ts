import { isObjectIdOrHexString } from "mongoose";
import InterviewRequest from "../../Models/InterviewRequest";
import BaseController from "./BaseController";

const rooms: { [key: string]: string[] } = {};
const roomPeers: { [key: string]: { userId: string, peerId: string }[] } = {};

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
    };

    peerConnect = async (data: { roomId: string, peerId: string, userId: string }) => {
        const { roomId, peerId, userId } = data;
        if (!roomPeers[roomId]) {
            roomPeers[roomId] = [];
        }

        if (!roomPeers[roomId].find(peer => peer.userId === userId)) {
            roomPeers[roomId].push({ userId, peerId });
        } else {
            roomPeers[roomId].map(peer => {
                if (peer.userId === userId) {
                    peer.peerId = peerId;
                }
            });
        }

        this._io.in(roomId).emit('room:peer-connect', {
            peerList: roomPeers[roomId]
        });
    }


    peerDisconnect = async (data: { roomId: string, peerId: string }) => {
        const { roomId, peerId } = data;
        if (roomPeers[roomId]) {
            roomPeers[roomId] = roomPeers[roomId].filter(peer => peer.peerId !== peerId);
        }

        try {
            await InterviewRequest.findOneAndUpdate({ room: roomId }, { status: 'completed' });
        } catch (error) {
            console.log(error);
            throw new Error("something went wrong while updating the interview request status");
        }

        this._io.in(roomId).emit('room:peer-disconnect', {
            peerList: roomPeers[roomId],
            peerId
        });
    }

}