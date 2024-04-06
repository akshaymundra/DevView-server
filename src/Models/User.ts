import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    skills: [{
        label: String,
        value: String,
    }],
    experienceLevel: {
        type: String,
        required: true,
        enum: ['Entry-level', 'Mid-level', 'Senior', 'Not Specified'],
        default: 'Not Specified',
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);