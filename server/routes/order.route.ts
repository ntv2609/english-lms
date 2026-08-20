import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllOrders, createMoMoPayment, webhookMoMo } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.get("/get-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

orderRouter.post("/payment/momo", isAuthenticated, createMoMoPayment);

orderRouter.post("/payment/webhook", webhookMoMo);

export default orderRouter;