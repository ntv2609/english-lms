import axios from "axios";
import ErrorHandler from "../utils/ErrorHandler";

// Hàm gọi API trực tiếp tới Google Gemini sử dụng model chuẩn hiện hành gemini-2.5-flash
export const requestGeminiCompletion = async (prompt: string): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new ErrorHandler("Missing GEMINI_API_KEY in environment variables", 500);
    }

    // Sử dụng model chính thức đang hoạt động: gemini-2.5-flash
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(endpoint, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            }
        });

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].content.parts[0].text;
        }
        throw new ErrorHandler("No valid response from Gemini API", 500);
    } catch (error: any) {
        console.error("Gemini API Error Detail:", error.response?.data || error.message);
        throw new ErrorHandler(`Lỗi AI: ${error.response?.data?.error?.message || error.message || "Không thể kết nối"}`, 500);
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