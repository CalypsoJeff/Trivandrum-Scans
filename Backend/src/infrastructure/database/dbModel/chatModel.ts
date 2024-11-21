import mongoose, { Schema, Document } from "mongoose";

export interface IChatModel extends Document {
    _id: mongoose.Types.ObjectId;
    users: mongoose.Types.ObjectId[]; // Array containing User and Admin IDs
    latestMessage: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    is_blocked: boolean;
    unreadCount: Map<string, number>;
}

const ChatSchema: Schema = new Schema<IChatModel>(
    {
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: "User", 
            },
            {
                type: Schema.Types.ObjectId,
                ref: "Admin", 
            },
        ],
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
        is_blocked: {
            type: Boolean,
            default: false,
        },
        unreadCount: { type: Map, of: Number, default: {} },
    },
    {
        timestamps: true,
    }
);

const ChatModel = mongoose.model<IChatModel>("ChatModel", ChatSchema);

export default ChatModel;
