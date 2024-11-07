import mongoose from 'mongoose';

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
    read: {
        type: Boolean,
        default: false
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
