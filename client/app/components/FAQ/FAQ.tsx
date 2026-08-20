import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { styles } from "@/app/styles/style";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import Loader from "../Loader/Loader";

const FAQ = () => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-[90%] 800px:w-[80%] m-auto">
            <h1 className={`${styles.title} 800px:text-[40px]`}>
              Câu Hỏi Thường Gặp
            </h1>
            <div className="mt-12">
              <dl className="space-y-8">
                {questions && questions.map((q: any) => (
                  <div
                    key={q._id}
                    className={`${
                      q._id !== questions[0]?._id ? "border-t" : ""
                    } border-gray-200 pt-6`}
                  >
                    <dt className="text-lg">
                      <button
                        className="flex items-start justify-between w-full text-left focus:outline-none dark:text-white text-black"
                        onClick={() => toggleQuestion(q._id)}
                      >
                        <span className="font-medium text-black dark:text-white">
                          {q.question}
                        </span>
                        <span className="ml-6 flex-shrink-0">
                          {activeQuestion === q._id ? (
                            <HiOutlineChevronUp className="h-6 w-6 text-black dark:text-white" />
                          ) : (
                            <HiOutlineChevronDown className="h-6 w-6 text-black dark:text-white" />
                          )}
                        </span>
                      </button>
                    </dt>
                    {activeQuestion === q._id && (
                      <dd className="mt-2 pr-12">
                        <p className="text-base font-Poppins text-black dark:text-white">
                          {q.answer}
                        </p>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </div>
            <br />
            <br />
          </div>
        </div>
      )}
    </>
  );
};

export default FAQ;