import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllOrders, createMoMoPayment, webhookMoMo } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

// FIX LỖI 401 UNAUTHORIZED CACHE: Bổ sung updateAccessToken
orderRouter.get("/get-orders", updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAllOrders);

orderRouter.post("/payment/momo", isAuthenticated, createMoMoPayment);

orderRouter.post("/payment/webhook", webhookMoMo);

export default orderRouter;