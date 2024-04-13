import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from 'uuid';

const interviewRequestSchema = new Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    responder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        defualt: null
    },
    topic: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    },
    requestedTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    room: {
        type: String,
        required: true,
        default: uuidv4
    }
}, { timestamps: true });

export default mongoose.model("InterviewRequest", interviewRequestSchema);