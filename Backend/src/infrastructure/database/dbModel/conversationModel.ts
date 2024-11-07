import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  members: string[];
}

const ConversationSchema = new Schema({
  members: { type: [String], required: true },
});

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);