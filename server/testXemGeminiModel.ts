import dotenv from "dotenv";
dotenv.config(); // Dòng này cực quan trọng để nạp GEMINI_API_KEY từ file .env lên

import axios from "axios";

const checkAvailableModels = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        console.log("🔥 Danh sách model API key của bạn hỗ trợ:");
        response.data.models.forEach((m: any) => {
            console.log(`- ${m.name} (Hỗ trợ: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error: any) {
        console.error("Lỗi lấy danh sách model:", error.response?.data || error.message);
    }
};

checkAvailableModels();