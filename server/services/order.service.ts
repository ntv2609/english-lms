import { Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";

// create new order
export const newOrder = CatchAsyncErrors(async (data: any, res: Response) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
        success: true,
        order,
    });
});

// get all orders (Admin only)
export const getAllOrdersService = async (res: Response) => {
    // AUTO-MIGRATION SCRIPT: Cứu các đơn hàng từ thời đồ đá!
    // Những đơn đã có paymentInfo (đã trả tiền) nhưng bị kẹt ở Pending ảo,
    // ta sẽ ép nó update lên Success hết.
    await OrderModel.updateMany(
        { 
            paymentInfo: { $exists: true }, 
            status: { $nin: ["Refunded", "Failed", "Success", "Expired"] } 
        },
        { $set: { status: "Success" } }
    );

    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        orders,
    });
};