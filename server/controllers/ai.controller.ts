import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { requestGeminiCompletion, extractJSONFromMarkdown } from "../services/ai.service";
import ChatHistoryModel from "../models/chatHistory.model";
import EssaySubmissionModel from "../models/essaySubmission.model";
import { redis } from "../utils/redis";

// 1. Trò chuyện với Chatbot (UC-02)
export const chatWithAI = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, context } = req.body;
        const userId = req.user?._id?.toString();

        if (!userId) return next(new ErrorHandler("Không tìm thấy định danh người dùng", 400));
        if (!question) return next(new ErrorHandler("Vui lòng nhập câu hỏi", 400));

        // Cơ chế Rate Limit bằng Redis: Tối đa 5 câu hỏi / 1 phút mỗi người dùng
        const rateLimitKey = `ai_chat_limit:${userId}`;
        const currentUsage = await redis.get(rateLimitKey);
        
        if (currentUsage && parseInt(currentUsage) >= 5) {
            return next(new ErrorHandler("Bạn đã vượt quá giới hạn câu hỏi. Vui lòng thử lại sau 1 phút.", 429));
        }

        if (currentUsage) {
            await redis.incr(rateLimitKey);
        } else {
            await redis.set(rateLimitKey, 1, "EX", 60);
        }

        // Tạo prompt kèm ngữ cảnh (nếu có)
        const prompt = `Bạn là một trợ lý AI hỗ trợ học tiếng Anh nhiệt tình và chuyên nghiệp. 
        Ngữ cảnh bài học hiện tại (nếu có): ${context || 'Không có'}. 
        Câu hỏi của học viên: "${question}". 
        Hãy trả lời bằng tiếng Việt một cách dễ hiểu, ngắn gọn và tập trung vào chuyên môn tiếng Anh.`;

        const responseText = await requestGeminiCompletion(prompt);

        // Lưu lịch sử theo báo cáo
        await ChatHistoryModel.create({
            userId,
            question,
            response: responseText
        });

        res.status(200).json({
            success: true,
            response: responseText
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// 2. Chấm bài viết tiếng Anh bằng AI (UC-03)
export const evaluateWriting = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content, topic } = req.body;
        const userId = req.user?._id?.toString();

        if (!userId) return next(new ErrorHandler("Không tìm thấy định danh người dùng", 400));
        if (!content || content.length < 50) return next(new ErrorHandler("Bài viết quá ngắn. Vui lòng viết tối thiểu 50 ký tự.", 400));
        if (content.length > 5000) return next(new ErrorHandler("Bài viết vượt quá giới hạn 5000 ký tự.", 400));

        const prompt = `Bạn là một chuyên gia chấm thi IELTS Writing. Đề bài: "${topic || 'Không có chủ đề cụ thể'}".
        Bài làm của học viên: "${content}".
        Hãy phân tích bài viết và trả về kết quả ĐÚNG định dạng JSON sau, không kèm bất kỳ văn bản nào khác:
        {
            "errorsDetected": "Liệt kê các lỗi ngữ pháp và từ vựng",
            "suggestedFixes": "Gợi ý cách diễn đạt tự nhiên hơn",
            "referenceScore": [Điểm số tham khảo từ 1.0 đến 9.0]
        }`;

        const rawResponse = await requestGeminiCompletion(prompt);
        const jsonString = extractJSONFromMarkdown(rawResponse);
        
        let evaluationData;
        try {
            evaluationData = JSON.parse(jsonString);
        } catch (e) {
            return next(new ErrorHandler("Hệ thống AI trả về kết quả không hợp lệ. Vui lòng thử lại.", 500));
        }

        // Lưu kết quả vào DB
        const submission = await EssaySubmissionModel.create({
            userId,
            originalContent: content,
            errorsDetected: evaluationData.errorsDetected || 'Không có',
            suggestedFixes: evaluationData.suggestedFixes || 'Không có',
            referenceScore: evaluationData.referenceScore || 0
        });

        res.status(200).json({
            success: true,
            evaluation: submission
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// 3. Sinh đề kiểm tra trắc nghiệm tự động (UC-04)
export const generateQuiz = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contextData, questionCount = 5, level = "Intermediate" } = req.body;

        if (!contextData) return next(new ErrorHandler("Vui lòng cung cấp nội dung bài học để sinh câu hỏi", 400));

        const prompt = `Hãy đóng vai một giáo viên tiếng Anh. Dựa vào nội dung bài học sau: "${contextData}".
        Hãy sinh ra ${questionCount} câu hỏi trắc nghiệm tiếng Anh ở trình độ ${level}.
        Trình bày kết quả ĐÚNG định dạng JSON dạng mảng (Array) chứa các Object sau, không kèm giải thích hay markdown:
        [
            {
                "question": "Nội dung câu hỏi",
                "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
                "correctAnswer": "Lựa chọn đúng nhất (chứa nội dung text của lựa chọn)",
                "explanation": "Giải thích ngắn gọn bằng tiếng Việt"
            }
        ]`;

        const rawResponse = await requestGeminiCompletion(prompt);
        const jsonString = extractJSONFromMarkdown(rawResponse);

        let questionsData;
        try {
            questionsData = JSON.parse(jsonString);
            if (!Array.isArray(questionsData)) throw new Error("Not an array");
        } catch (e) {
            return next(new ErrorHandler("Hệ thống AI không sinh được định dạng Quiz chuẩn. Vui lòng thử lại.", 500));
        }

        res.status(200).json({
            success: true,
            questions: questionsData
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});