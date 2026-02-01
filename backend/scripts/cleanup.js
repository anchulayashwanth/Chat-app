import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";
import Message from "../models/Message.js";

const cleanup = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
        console.log("Database connected for cleanup");

        const userResult = await User.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users`);

        const messageResult = await Message.deleteMany({});
        console.log(`Deleted ${messageResult.deletedCount} messages`);

        process.exit(0);
    } catch (error) {
        console.error("Cleanup error:", error);
        process.exit(1);
    }
};

cleanup();
