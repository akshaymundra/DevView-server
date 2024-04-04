import mongoose from "mongoose";
const Schema = mongoose.Schema;

const interviewRequestSchema = new Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    responder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    topic: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    requestedTime: {
        type: Date,
        required: true
    },
    room: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("InterviewRequest", interviewRequestSchema);