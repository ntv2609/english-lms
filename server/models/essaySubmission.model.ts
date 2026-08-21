import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEssaySubmission extends Document {
    userId: string;
    originalContent: string;
    errorsDetected: string;
    suggestedFixes: string;
    referenceScore: number;
}

const essaySubmissionSchema = new Schema<IEssaySubmission>({
    userId: {
        type: String,
        required: true,
    },
    originalContent: {
        type: String,
        required: true,
    },
    errorsDetected: {
        type: String,
    },
    suggestedFixes: {
        type: String,
    },
    referenceScore: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const EssaySubmissionModel: Model<IEssaySubmission> = mongoose.model<IEssaySubmission>("EssaySubmission", essaySubmissionSchema);

export default EssaySubmissionModel;