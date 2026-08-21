import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { chatWithAI, evaluateWriting, generateQuiz } from "../controllers/ai.controller";
import { updateAccessToken } from "../controllers/user.controller";

const aiRouter = express.Router();

// Route: Trò chuyện Chatbot (Học viên)
aiRouter.post("/ai/chat", updateAccessToken, isAuthenticated, chatWithAI);

// Route: Chấm bài viết (Học viên)
aiRouter.post("/ai/evaluate-writing", updateAccessToken, isAuthenticated, evaluateWriting);

// Route: Sinh đề tự động (Admin có quyền tạo khóa học, hoặc học viên sinh thêm bài tập)
aiRouter.post("/ai/generate-quiz", updateAccessToken, isAuthenticated, generateQuiz);

export default aiRouter;