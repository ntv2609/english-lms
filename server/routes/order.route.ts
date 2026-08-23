import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllOrders, createMoMoPayment, webhookMoMo, refundOrder } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.get("/get-orders", updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAllOrders);
orderRouter.post("/payment/momo", isAuthenticated, createMoMoPayment);
orderRouter.post("/payment/webhook", webhookMoMo);
orderRouter.post("/refund-order", updateAccessToken, isAuthenticated, authorizeRoles("admin"), refundOrder);

export default orderRouter;