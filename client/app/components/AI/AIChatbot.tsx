import React, { useState, useRef, useEffect } from "react";
import { BsRobot, BsSend, BsX } from "react-icons/bs";
import { useChatWithAIMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";

interface Props {
  context: string;
}

const AIChatbot: React.FC<Props> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Chào bạn, mình là trợ lý AI. Bạn cần mình giải đáp đoạn nào trong bài học này?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatWithAI, { isLoading }] = useChatWithAIMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");

    try {
      const res = await chatWithAI({ question: userMessage, context }).unwrap();
      setChatHistory((prev) => [...prev, { sender: "ai", text: res.response }]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Lỗi kết nối AI, vui lòng thử lại!");
      setChatHistory((prev) => [...prev, { sender: "ai", text: "Xin lỗi, hệ thống AI đang quá tải. Hãy thử lại sau ít phút nhé!" }]);
    }
  };

  return (
    <>
      {/* Nút mở Chatbot */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform z-50 ${isOpen ? "hidden" : "flex"}`}
      >
        <BsRobot size={28} />
      </button>

      {/* Cửa sổ Chatbot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-[#111111] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col overflow-hidden z-50 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BsRobot size={20} />
              </div>
              <div>
                <h3 className="font-Josefin font-bold text-sm">Trợ lý AI EngGo</h3>
                <p className="text-[10px] text-white/80">Trực tuyến 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <BsX size={24} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-4 custom-scrollbar">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-white dark:bg-[#1A1A1A] text-black dark:text-white border border-black/5 dark:border-white/5 shadow-sm rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-2xl shadow-sm rounded-bl-sm border border-black/5 dark:border-white/5 flex gap-1">
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white dark:bg-[#111111] border-t border-black/5 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-2 bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 rounded-full p-1 pl-4 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Hỏi AI về bài học này..."
                className="flex-1 bg-transparent text-sm outline-none text-black dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-neutral-400 transition-colors shrink-0"
              >
                <BsSend size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;