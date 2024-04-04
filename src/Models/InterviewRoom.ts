import mongoose from "mongoose";

const interviewRoomSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    active: {
        type: Boolean,
        default: false
    },
    startTime: Date,
    endTime: Date
}, { timestamps: true });

module.exports = mongoose.model('InterviewRoom', interviewRoomSchema);