import mongoose, { mongo } from "mongoose";
import User from "./user.model.js";
import Conversation from "./conversation.model.js";

const MessageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        validate: [
            {
                validator: (value) => value.length > 0,
                message: "Message is empty",
            }
        ]
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
    }
}, { timestamps: true, });

const Message = mongoose.model("Message", MessageSchema);

export default Message