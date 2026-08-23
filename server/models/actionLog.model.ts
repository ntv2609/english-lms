import mongoose, { Document, Model, Schema } from "mongoose";

export interface IActionLog extends Document {
    adminId: string;
    targetUserId: string;
    action: string;
    reason: string;
}

const actionLogSchema = new Schema<IActionLog>({
    adminId: {
        type: String,
        required: true,
    },
    targetUserId: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const ActionLogModel: Model<IActionLog> = mongoose.model<IActionLog>("ActionLog", actionLogSchema);
export default ActionLogModel;