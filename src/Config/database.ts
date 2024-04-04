import mongoose from "mongoose";

export const connectDb = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.log("Mongo uri not found");
    } else {
        try {
            await mongoose.connect(mongoUri);
            console.log("Databse connected");
        } catch (error) {
            console.log(error);
        }
    }
};
