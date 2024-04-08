import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import SocketManager from "../socket/socketManager";
import InterviewRequest from "../Models/InterviewRequest";
import { RequestWithUser } from "../types";
import { NextFunction } from "express";

/**
* @desc make a new interview request
* @route POST /api/interview/request
* @access private
*/
export const requestInterview = [

    body('topic', 'Topic is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),

    asyncHandler(async (req: any, res, next) => {
        const user = req.user;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error("Topic and description are required");
        }

        if (!user) {
            res.status(400);
            throw new Error("User not found");
        }

        const interviewReq = new InterviewRequest({
            requester: user._id,
            topic: req.body.topic,
            description: req.body.description
        })

        // update the prev requist to be cancelled 
        await InterviewRequest.updateMany(
            { requester: user._id, status: 'pending' },
            { $set: { status: 'cancelled' } }
        );
        await interviewReq.save();

        // send the interview request to all the connected users 
        const socketManager = SocketManager.getInstance();
        if (socketManager.io) {
            socketManager.io.emit('interview-request', {
                interviewReq,
                message: 'New interview request',
                success: true,
                status: 200,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Interview request made successfully',
            interviewReq
        });
    })
]