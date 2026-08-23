import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    courseId: string;
    userId: string;
    paymentInfo: object;
    status: string;
}

const orderSchema = new Schema<IOrder>({
    courseId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    paymentInfo: {
        type: Object,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Success", "Failed", "Expired", "Refunded"],
    }
}, { timestamps: true });

const OrderModel: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default OrderModel;