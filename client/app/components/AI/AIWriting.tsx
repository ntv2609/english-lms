import React, { useState } from "react";
import { styles } from "@/app/styles/style";
import { useEvaluateWritingMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { BiWinkSmile, BiSad, BiTrophy } from "react-icons/bi";

interface Props {
  topic: string;
}

const AIWriting: React.FC<Props> = ({ topic }) => {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<any>(null);
  
  const [evaluateWriting, { isLoading }] = useEvaluateWritingMutation();

  const handleEvaluate = async () => {
    if (content.length < 50) {
      toast.error("Bài viết của bạn hơi ngắn, viết tối thiểu 50 ký tự nhé!");
      return;
    }
    
    try {
      const res = await evaluateWriting({ content, topic }).unwrap();
      setResult(res.evaluation);
      toast.success("AI đã chấm xong!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Lỗi AI, vui lòng thử lại sau!");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-4 items-start">
        <div className="text-4xl">🤖</div>
        <div>
          <h3 className="font-Josefin font-bold text-blue-600 dark:text-blue-400 mb-1">Gia sư Writing AI</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Dán bài luyện viết của bạn vào đây. Hệ thống AI sẽ quét lỗi chính tả, ngữ pháp, tư vấn từ vựng tự nhiên hơn và đưa ra mức điểm tham khảo nhé!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={styles.label}>Nội dung bài viết (Tối thiểu 50 ký tự)</label>
          <textarea
            className={`${styles.input} !h-48 py-4 resize-none border border-black/10 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-[#0A0A0A]`}
            placeholder="Type your essay or paragraph here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="text-right mt-1">
            <span className={`text-xs font-mono ${content.length < 50 ? "text-red-500" : "text-emerald-500"}`}>
              {content.length}/5000 ký tự
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleEvaluate} 
          disabled={isLoading || content.length < 50} 
          className={`${styles.button} !w-full md:!w-48 !py-3 flex items-center justify-center gap-2`}
        >
          {isLoading ? "Đang phân tích..." : "Chấm bài ngay"}
        </button>
      </div>

      {result && (
        <div className="mt-10 p-6 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm animate-fade-in-up space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-black/10 dark:border-white/10">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${result.referenceScore >= 6.5 ? "bg-emerald-500/10 text-emerald-500" : result.referenceScore >= 5.0 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}>
              {result.referenceScore}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-1">Điểm tham khảo</p>
              <h3 className="text-xl font-Josefin font-bold text-black dark:text-white">
                {result.referenceScore >= 6.5 ? "Khá tốt! Cứ đà này mà tiến nhé." : result.referenceScore >= 5.0 ? "Cần cố gắng chau chuốt thêm từ vựng." : "Bạn đang sai ngữ pháp cơ bản khá nhiều."}
              </h3>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-bold text-red-500 mb-3"><BiSad size={20}/> Các lỗi phát hiện</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed bg-red-500/5 p-4 rounded-lg border border-red-500/10">
              {result.errorsDetected}
            </p>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-bold text-emerald-500 mb-3"><BiTrophy size={20}/> Gợi ý sửa lỗi & Cải thiện</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10">
              {result.suggestedFixes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWriting;