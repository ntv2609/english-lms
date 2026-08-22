"use client";
import React, { FC, useEffect, useState } from "react";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { styles } from "@/app/styles/style";
import Loader from "../../Loader/Loader";

const EditFaq: FC = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", { refetchOnMountOrArgChange: true });
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) setQuestions(data?.layout?.faq || []);
    if (isSuccess) { refetch(); toast.success("Cập nhật FAQ thành công"); }
    if (error && "data" in error) toast.error((error as any)?.data?.message);
  }, [data, isSuccess, error, refetch]);

  const handleEdit = async () => {
    if (JSON.stringify(data?.layout?.faq || []) !== JSON.stringify(questions) && !questions.some(q => q.question === "" || q.answer === "")) {
      await editLayout({ type: "FAQ", faq: questions });
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="max-w-4xl m-auto px-2 sm:px-0">
          <div className="mb-8">
            <h1 className={`${styles.title} !text-left !pb-1`}>FAQ / Hỏi đáp</h1>
            <p className={styles.label}>Tùy chỉnh nội dung giải đáp thắc mắc cho học viên</p>
          </div>

          <div className="space-y-6 mb-8">
            {questions.map((q: any) => (
              <div key={q._id} className={styles.card + " p-4 sm:p-6 group relative"}>
                <div className="absolute right-3 sm:right-4 top-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                   <AiOutlineDelete size={20} className="text-neutral-400 hover:text-red-500 cursor-pointer" onClick={() => setQuestions(questions.filter(item => item._id !== q._id))} />
                </div>
                <div className="mb-4 pr-8">
                  <label className={styles.badge}>Câu hỏi</label>
                  <input className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-2 text-base sm:text-lg font-Josefin font-semibold text-black dark:text-white outline-none focus:border-blue-500 transition-colors" value={q.question} onChange={(e) => setQuestions(questions.map(i => i._id === q._id ? { ...i, question: e.target.value } : i))} placeholder="Nhập câu hỏi..." />
                </div>
                <div>
                  <label className={styles.badge}>Câu trả lời</label>
                  <textarea rows={3} className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-md p-3 text-sm text-neutral-600 dark:text-neutral-400 outline-none focus:border-blue-500 transition-colors mt-2 resize-none" value={q.answer} onChange={(e) => setQuestions(questions.map(i => i._id === q._id ? { ...i, answer: e.target.value } : i))} placeholder="Nhập câu trả lời..." />
                </div>
              </div>
            ))}
          </div>

          <button className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-2 mb-10" onClick={() => setQuestions([...questions, { _id: Date.now().toString(), question: "", answer: "" }])}>
            <IoMdAddCircleOutline size={22} /> Thêm câu hỏi
          </button>

          <button
            className={`${styles.button} !w-full sm:!w-40 ${JSON.stringify(data?.layout?.faq || []) === JSON.stringify(questions) || questions.some(q => q.question === "" || q.answer === "") ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleEdit}
          >Lưu thay đổi</button>
        </div>
      )}
    </>
  );
};

export default EditFaq;