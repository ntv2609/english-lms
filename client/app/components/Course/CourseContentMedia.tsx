import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import { useAddAnswerInQuestionMutation, useAddQuestionMutation, useAddReplyInReviewMutation, useAddReviewInCourseMutation, useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from "react-icons/ai";
import { format } from "timeago.js";
import AIChatbot from "../AI/AIChatbot"; 
import AIWriting from "../AI/AIWriting"; 

type Props = { data: any; id: string; activeVideo: number; setActiveVideo: (activeVideo: number) => void; user: any; refetch: any; };

const CourseContentMedia = ({ data, id, activeVideo, setActiveVideo, user, refetch }: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");

  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });
  const course = courseData?.course;
  const isReviewExists = course?.reviews?.find((item: any) => item.user._id === user._id);

  const [addNewQuestion, { isSuccess: qSuccess }] = useAddQuestionMutation();
  const [addAnswerInQuestion, { isSuccess: aSuccess }] = useAddAnswerInQuestionMutation();
  const [addReviewInCourse, { isSuccess: rSuccess }] = useAddReviewInCourseMutation();
  const [addReplyInReview, { isSuccess: rrSuccess }] = useAddReplyInReviewMutation();

  useEffect(() => {
    if (qSuccess) { setQuestion(""); refetch(); toast.success("Gửi câu hỏi thành công"); }
    if (aSuccess) { setAnswer(""); setQuestionId(""); refetch(); toast.success("Trả lời thành công"); }
    if (rSuccess) { setReview(""); courseRefetch(); toast.success("Đánh giá thành công"); }
    if (rrSuccess) { setReply(""); setReviewId(""); courseRefetch(); toast.success("Phản hồi đánh giá thành công"); }
  }, [qSuccess, aSuccess, rSuccess, rrSuccess, refetch, courseRefetch]);

  useEffect(() => {
    setUserAnswers({});
    setIsQuizSubmitted(false);
  }, [activeVideo]);

  const tabs = ["Tổng quan", "Tài nguyên", "Hỏi đáp", "Đánh giá", "Luyện Viết AI", "Bài tập (Quiz)"];
  const quizzes = data[activeVideo]?.quizzes || [];

  const handleSelectAnswer = (qIndex: number, option: string) => {
    if (isQuizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(userAnswers).length < quizzes.length) {
      toast.error("Vui lòng trả lời đầy đủ các câu hỏi trước khi nộp bài!");
      return;
    }
    setIsQuizSubmitted(true);
    toast.success("Nộp bài thành công! Xem điểm số và giải thích chi tiết bên dưới.");
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach((quiz: any, index: number) => {
      if (userAnswers[index] === quiz.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="w-full relative">
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-6">
        <CoursePlayer title={data[activeVideo]?.title} videoUrl={data[activeVideo]?.videoUrl} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <button className={`${styles.button} !w-full sm:!w-auto !py-2 !px-4 text-xs flex items-center gap-2 justify-center ${activeVideo === 0 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => activeVideo > 0 && setActiveVideo(activeVideo - 1)}><AiOutlineArrowLeft/> Bài trước</button>
        <button className={`${styles.button} !w-full sm:!w-auto !py-2 !px-4 text-xs flex items-center gap-2 justify-center ${activeVideo === data.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => activeVideo < data.length - 1 && setActiveVideo(activeVideo + 1)}>Tiếp theo <AiOutlineArrowRight/></button>
      </div>

      <h1 className="text-2xl md:text-3xl font-Josefin font-bold text-black dark:text-white mb-6">{data[activeVideo].title}</h1>

      <div className="flex border-b border-black/10 dark:border-white/10 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveBar(i)} className={`px-4 sm:px-6 py-4 text-sm font-medium tracking-wide transition-all whitespace-nowrap relative shrink-0 ${activeBar === i ? "text-blue-600 dark:text-blue-400" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}>
            {t}
            {activeBar === i && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 dark:bg-blue-400" />}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeBar === 0 && (
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-light whitespace-pre-line text-sm sm:text-base">{data[activeVideo]?.description}</p>
        )}

        {activeBar === 1 && (
          <div className="space-y-4">
            {data[activeVideo]?.links.map((l:any, i:number) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer" className="flex flex-col p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all">
                <span className="font-semibold text-black dark:text-white text-sm sm:text-base">{l.title}</span>
                <span className="text-xs sm:text-sm font-mono text-blue-500 mt-1 truncate">{l.url}</span>
              </a>
            ))}
          </div>
        )}

        {activeBar === 2 && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <img src={user.avatar?.url || "/assets/avatar.png"} className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 object-cover shrink-0 mx-auto sm:mx-0" alt="avatar"/>
              <div className="flex-1 flex flex-col items-end gap-3 w-full">
                <textarea className={styles.input + " !h-24 py-3 resize-none w-full"} placeholder="Viết câu hỏi của bạn tại đây..." value={question} onChange={e=>setQuestion(e.target.value)} />
                <button className={`${styles.button} !w-full sm:!w-32 !py-2 text-sm`} onClick={() => addNewQuestion({ question, courseId: id, contentId: data[activeVideo]._id })}>Gửi câu hỏi</button>
              </div>
            </div>
            <div className="space-y-8">
              {[...data[activeVideo].questions].reverse().map((q:any) => (
                <div key={q._id} className="border-t border-black/5 dark:border-white/5 pt-6">
                  <div className="flex gap-3 sm:gap-4">
                    <img src={q.user.avatar?.url || "/assets/avatar.png"} className="w-10 h-10 rounded-full object-cover shrink-0" alt="avatar"/>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <span className="font-semibold text-black dark:text-white text-sm sm:text-base">{q.user.name}</span>
                        {q.user.role === 'admin' && <span className="text-[10px] bg-blue-500/20 text-blue-500 px-1.5 rounded uppercase font-bold tracking-widest">Admin</span>}
                        <span className="text-[10px] sm:text-xs text-neutral-500 font-mono ml-auto">{format(q.createdAt)}</span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-3 break-words">{q.comment}</p>
                      
                      <button className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2" onClick={() => setQuestionId(questionId === q._id ? "" : q._id)}>
                        {q.commentReplies.length} Trả lời {questionId === q._id ? "−" : "+"}
                      </button>

                      {questionId === q._id && (
                        <div className="mt-4 sm:mt-6 pl-2 sm:pl-4 border-l-2 border-black/10 dark:border-white/10 space-y-6">
                          {q.commentReplies.map((r:any, i:number) => (
                              <div key={i} className="flex gap-2 sm:gap-3">
                                <img src={r.user.avatar?.url || "/assets/avatar.png"} className="w-8 h-8 rounded-full object-cover shrink-0" alt="avatar"/>
                                <div className="overflow-hidden">
                                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                     <span className="font-semibold text-xs sm:text-sm text-black dark:text-white">{r.user.name}</span>
                                     {r.user.role === 'admin' && <span className="text-[9px] bg-blue-500/20 text-blue-500 px-1 rounded uppercase font-bold tracking-widest">Admin</span>}
                                     <span className="text-[9px] sm:text-[10px] text-neutral-500 font-mono">{format(r.createdAt)}</span>
                                  </div>
                                  <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm break-words">{r.comment}</p>
                                </div>
                              </div>
                          ))}
                          <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <input type="text" className="flex-1 w-full bg-transparent border-b border-black/20 dark:border-white/20 text-sm text-black dark:text-white outline-none focus:border-blue-500 py-1" placeholder="Nhập câu trả lời..." value={answer} onChange={e=>setAnswer(e.target.value)}/>
                            <button className="text-sm font-bold text-blue-500 hover:text-blue-400 disabled:opacity-50 text-right sm:text-left" disabled={!answer} onClick={() => addAnswerInQuestion({answer, courseId: id, contentId: data[activeVideo]._id, questionId: q._id})}>Gửi</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBar === 3 && (
          <div>
            {!isReviewExists && (
               <div className="flex flex-col sm:flex-row gap-4 mb-10 p-4 sm:p-6 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                 <img src={user.avatar?.url || "/assets/avatar.png"} className="w-12 h-12 rounded-full object-cover shrink-0 mx-auto sm:mx-0" alt="avatar"/>
                 <div className="flex-1 flex flex-col items-end gap-4 w-full">
                   <div className="w-full flex justify-center sm:justify-start gap-1 mb-2">
                     {[1,2,3,4,5].map(i => i <= rating ? <AiFillStar key={i} size={24} className="text-yellow-500 cursor-pointer" onClick={()=>setRating(i)}/> : <AiOutlineStar key={i} size={24} className="text-yellow-500 cursor-pointer" onClick={()=>setRating(i)}/>)}
                   </div>
                   <textarea className={styles.input + " !h-24 py-3 resize-none w-full"} placeholder="Khóa học này thế nào?" value={review} onChange={e=>setReview(e.target.value)} />
                   <button className={`${styles.button} !w-full sm:!w-32 !py-2 text-sm`} onClick={() => addReviewInCourse({ review, rating, courseId: id })}>Đánh giá</button>
                 </div>
               </div>
            )}
            
            <div className="space-y-8">
              {course?.reviews && [...course.reviews].reverse().map((r:any) => (
                <div key={r._id} className="border-t border-black/5 dark:border-white/5 pt-6">
                  <div className="flex gap-3 sm:gap-4">
                    <img src={r.user.avatar?.url || "/assets/avatar.png"} className="w-10 h-10 rounded-full object-cover shrink-0" alt="avatar"/>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between mb-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-black dark:text-white text-sm sm:text-base">{r.user.name}</span>
                          <span className="text-[10px] sm:text-xs text-neutral-500 font-mono hidden sm:inline">{format(r.createdAt)}</span>
                        </div>
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(i => i <= r.rating ? <AiFillStar key={i} size={14} className="text-yellow-500"/> : <AiOutlineStar key={i} size={14} className="text-yellow-500"/>)}</div>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-3 break-words">{r.comment}</p>

                      {user.role === 'admin' && r.commentReplies.length === 0 && (
                        <button className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 mb-4" onClick={() => setReviewId(reviewId === r._id ? "" : r._id)}>Phản hồi học viên</button>
                      )}

                      {reviewId === r._id && (
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                           <input type="text" className="flex-1 w-full bg-transparent border-b border-black/20 dark:border-white/20 text-sm text-black dark:text-white outline-none focus:border-blue-500 py-1" placeholder="Admin phản hồi..." value={reply} onChange={e=>setReply(e.target.value)}/>
                           <button className="text-sm font-bold text-blue-500 hover:text-blue-400 disabled:opacity-50 text-right sm:text-left" disabled={!reply} onClick={() => addReplyInReview({comment: reply, courseId: id, reviewId: r._id})}>Gửi</button>
                        </div>
                      )}

                      {r.commentReplies.map((rep:any, i:number) => (
                        <div key={i} className="mt-4 pl-2 sm:pl-4 border-l-2 border-blue-500/30 flex gap-2 sm:gap-3">
                           <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><span className="text-white text-[10px] font-bold">A</span></div>
                           <div className="overflow-hidden">
                             <div className="flex items-baseline gap-2 mb-0.5">
                                <span className="font-semibold text-xs sm:text-sm text-black dark:text-white">Admin</span>
                                <span className="text-[9px] sm:text-[10px] text-neutral-500 font-mono">{format(rep.createdAt)}</span>
                             </div>
                             <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm break-words">{rep.comment}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBar === 4 && (
          <AIWriting 
            topic={data[activeVideo].title} 
            homework={data[activeVideo].homework}
          />
        )}

        {activeBar === 5 && (
          <div className="w-full">
            {quizzes.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-black/10 dark:border-white/10 rounded-xl mx-2 sm:mx-0">
                  <p className="text-neutral-500 italic text-sm sm:text-base">Bài học này chưa có bài tập trắc nghiệm.</p>
                </div>
            ) : (
                <div className="space-y-8 px-2 sm:px-0">
                  {isQuizSubmitted && (
                    <div className="p-4 sm:p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                        <div>
                            <h3 className="font-Josefin font-bold text-blue-600 dark:text-blue-400 text-lg sm:text-xl mb-1">Kết quả bài làm</h3>
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Bạn đã hoàn thành bài thi trắc nghiệm.</p>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                            {calculateScore()} / {quizzes.length}
                        </div>
                    </div>
                  )}

                  <div className="space-y-6">
                      {quizzes.map((quiz: any, qIndex: number) => {
                          const isCorrect = userAnswers[qIndex] === quiz.correctAnswer;
                          return (
                              <div key={qIndex} className={`p-4 sm:p-6 rounded-xl border ${isQuizSubmitted ? (isCorrect ? "border-emerald-500/50 bg-emerald-500/5" : "border-red-500/50 bg-red-500/5") : "border-black/5 dark:border-white/5 bg-[#FAFAFA] dark:bg-[#0A0A0A]"}`}>
                                  <h4 className="font-semibold text-black dark:text-white text-base sm:text-lg mb-4">Câu {qIndex + 1}: {quiz.question}</h4>
                                  <div className="space-y-3">
                                      {quiz.options.map((option: string, oIndex: number) => {
                                          const isSelected = userAnswers[qIndex] === option;
                                          const isActuallyCorrect = option === quiz.correctAnswer;
                                          
                                          let optionStyle = "border-black/10 dark:border-white/10 hover:border-blue-500";
                                          if (isQuizSubmitted) {
                                              if (isActuallyCorrect) optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                                              else if (isSelected && !isCorrect) optionStyle = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                                              else optionStyle = "border-black/5 dark:border-white/5 opacity-50 cursor-not-allowed";
                                          } else if (isSelected) {
                                              optionStyle = "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold";
                                          }

                                          return (
                                              <div 
                                                  key={oIndex} 
                                                  onClick={() => handleSelectAnswer(qIndex, option)}
                                                  className={`p-3 rounded-lg border cursor-pointer transition-all text-sm sm:text-base ${optionStyle}`}
                                              >
                                                  {option}
                                              </div>
                                          );
                                      })}
                                  </div>

                                  {isQuizSubmitted && (
                                      <div className={`mt-4 p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${isCorrect ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}>
                                          <p className="font-bold mb-1">{isCorrect ? "✅ Chính xác!" : "❌ Sai rồi!"}</p>
                                          <p><strong>Giải thích:</strong> {quiz.explanation}</p>
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </div>

                  {!isQuizSubmitted && (
                      <button 
                          onClick={handleSubmitQuiz}
                          className={`${styles.button} !w-full !py-4 text-sm sm:text-base tracking-widest`}
                      >
                          Nộp bài kiểm tra
                      </button>
                  )}
                </div>
            )}
          </div>
        )}
      </div>
      
      <AIChatbot context={`Tên bài giảng: ${data[activeVideo].title}. Mô tả: ${data[activeVideo].description}`} />
    </div>
  );
};

export default CourseContentMedia;