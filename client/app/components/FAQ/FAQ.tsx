import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { styles } from "@/app/styles/style";
import Loader from "../Loader/Loader";

const FAQ = () => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => { if (data?.layout?.faq) setQuestions(data.layout.faq); }, [data]);

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="py-24 bg-white dark:bg-[#050505]">
          <div className="max-w-3xl m-auto px-4 md:px-0">
            <h1 className={`${styles.title} md:text-[56px] text-center mb-16`}>
              Câu Hỏi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Thường Gặp</span>
            </h1>
            <div className="space-y-4">
              {questions.map((q: any) => (
                <div key={q._id} className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors">
                  <button className="w-full text-left p-6 flex justify-between items-center focus:outline-none" onClick={() => setActiveQuestion(activeQuestion === q._id ? null : q._id)}>
                    <span className="font-Josefin font-bold text-lg text-black dark:text-white pr-8">{q.question}</span>
                    <span className="text-xl font-light text-neutral-400 transition-transform duration-300 shrink-0" style={{ transform: activeQuestion === q._id ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeQuestion === q._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="p-6 pt-0 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 border-t border-black/5 dark:border-white/5 mx-6 mt-2">{q.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FAQ;