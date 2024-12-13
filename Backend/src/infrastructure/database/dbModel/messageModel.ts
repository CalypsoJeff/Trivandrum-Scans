
import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
    chat: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    senderModel: 'User' | 'Admin';
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    isFile?: boolean;
    delivered?: boolean;
    readAt?: Date;
    read?: boolean; 
    createdAt: Date;
    deleted?: boolean;
}
const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        enum: ['User', 'Admin'],
        required: true
    },
    content: {
        type: String,
        trim: true,
    },
    fileUrl: {
        type: String,
    },
    fileName: {
        type: String,
    },
    fileType: {
        type: String,
    },
    isFile: {
        type: Boolean,
        default: false
    },
    delivered: { 
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
