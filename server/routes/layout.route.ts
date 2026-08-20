import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller"; // FIX BỔ SUNG: Import hàm refresh token

const layoutRouter = express.Router();

// Bơm updateAccessToken vào trước isAuthenticated để luôn làm mới token khi tạo layout
layoutRouter.post("/create-layout", updateAccessToken, isAuthenticated, authorizeRoles("admin"), createLayout);

// Bơm updateAccessToken vào trước isAuthenticated để luôn làm mới token khi sửa layout (Categories, FAQ, Banner)
layoutRouter.put("/edit-layout", updateAccessToken, isAuthenticated, authorizeRoles("admin"), editLayout);

layoutRouter.get("/get-layout/:type", getLayoutByType);

export default layoutRouter;