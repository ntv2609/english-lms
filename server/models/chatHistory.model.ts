import mongoose, { Document, Model, Schema } from "mongoose";

export interface IChatHistory extends Document {
    userId: string;
    question: string;
    response: string;
}

const chatHistorySchema = new Schema<IChatHistory>({
    userId: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const ChatHistoryModel: Model<IChatHistory> = mongoose.model<IChatHistory>("ChatHistory", chatHistorySchema);

export default ChatHistoryModel;