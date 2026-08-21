import axios from "axios";
import ErrorHandler from "../utils/ErrorHandler";

// Hàm gọi API trực tiếp tới Google Gemini sử dụng Axios (tránh phát sinh dependency mới)
export const requestGeminiCompletion = async (prompt: string): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new ErrorHandler("Missing GEMINI_API_KEY in environment variables", 500);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(endpoint, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        });

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].content.parts[0].text;
        }
        throw new ErrorHandler("No valid response from Gemini API", 500);
    } catch (error: any) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        throw new ErrorHandler("Lỗi khi kết nối với hệ thống AI", 500);
    }
};

// Tiện ích bóc tách Markdown để lấy JSON thuần (LLM thường trả về kèm ```json ... ```)
export const extractJSONFromMarkdown = (text: string): string => {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
        return jsonMatch[1];
    }
    return text;
};