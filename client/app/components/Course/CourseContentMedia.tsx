import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import { useAddAnswerInQuestionMutation, useAddQuestionMutation, useAddReplyInReviewMutation, useAddReviewInCourseMutation, useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from "react-icons/ai";
import { format } from "timeago.js";

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

  const tabs = ["Tổng quan", "Tài nguyên", "Hỏi đáp", "Đánh giá"];

  return (
    <div className="w-full">
      {/* Premium Video Player Container */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-6">
        <CoursePlayer title={data[activeVideo]?.title} videoUrl={data[activeVideo]?.videoUrl} />
      </div>

      <div className="flex items-center justify-between mb-8">
        <button className={`${styles.button} !w-auto !py-2 !px-4 text-xs flex items-center gap-2 ${activeVideo === 0 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => activeVideo > 0 && setActiveVideo(activeVideo - 1)}><AiOutlineArrowLeft/> Bài trước</button>
        <button className={`${styles.button} !w-auto !py-2 !px-4 text-xs flex items-center gap-2 ${activeVideo === data.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => activeVideo < data.length - 1 && setActiveVideo(activeVideo + 1)}>Tiếp theo <AiOutlineArrowRight/></button>
      </div>

      <h1 className="text-2xl md:text-3xl font-Josefin font-bold text-black dark:text-white mb-6">{data[activeVideo].title}</h1>

      {/* Modern Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveBar(i)} className={`px-6 py-4 text-sm font-medium tracking-wide transition-all whitespace-nowrap relative ${activeBar === i ? "text-blue-600 dark:text-blue-400" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}>
            {t}
            {activeBar === i && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 dark:bg-blue-400" />}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="min-h-[300px]">
        {activeBar === 0 && (
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-light whitespace-pre-line">{data[activeVideo]?.description}</p>
        )}

        {activeBar === 1 && (
          <div className="space-y-4">
            {data[activeVideo]?.links.map((l:any, i:number) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer" className="flex flex-col p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all">
                <span className="font-semibold text-black dark:text-white">{l.title}</span>
                <span className="text-sm font-mono text-blue-500 mt-1 truncate">{l.url}</span>
              </a>
            ))}
          </div>
        )}

        {activeBar === 2 && (
          <div>
            <div className="flex gap-4 mb-10">
              <img src={user.avatar?.url || "/assets/avatar.png"} className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 object-cover shrink-0" alt="avatar"/>
              <div className="flex-1 flex flex-col items-end gap-3">
                <textarea className={styles.input + " !h-24 py-3 resize-none"} placeholder="Viết câu hỏi của bạn tại đây..." value={question} onChange={e=>setQuestion(e.target.value)} />
                <button className={`${styles.button} !w-32 !py-2 text-sm`} onClick={() => addNewQuestion({ question, courseId: id, contentId: data[activeVideo]._id })}>Gửi câu hỏi</button>
              </div>
            </div>
            <div className="space-y-8">
              {[...data[activeVideo].questions].reverse().map((q:any) => (
                <div key={q._id} className="border-t border-black/5 dark:border-white/5 pt-6">
                  <div className="flex gap-4">
                    <img src={q.user.avatar?.url || "/assets/avatar.png"} className="w-10 h-10 rounded-full object-cover shrink-0" alt="avatar"/>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-black dark:text-white">{q.user.name}</span>
                        {q.user.role === 'admin' && <span className="text-[10px] bg-blue-500/20 text-blue-500 px-1.5 rounded uppercase font-bold tracking-widest">Admin</span>}
                        <span className="text-xs text-neutral-500 font-mono ml-auto">{format(q.createdAt)}</span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-3">{q.comment}</p>
                      
                      <button className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2" onClick={() => setQuestionId(questionId === q._id ? "" : q._id)}>
                        {q.commentReplies.length} Trả lời {questionId === q._id ? "−" : "+"}
                      </button>

                      {questionId === q._id && (
                        <div className="mt-6 pl-4 border-l-2 border-black/10 dark:border-white/10 space-y-6">
                          {q.commentReplies.map((r:any, i:number) => (
                             <div key={i} className="flex gap-3">
                               <img src={r.user.avatar?.url || "/assets/avatar.png"} className="w-8 h-8 rounded-full object-cover shrink-0" alt="avatar"/>
                               <div>
                                 <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-semibold text-sm text-black dark:text-white">{r.user.name}</span>
                                    {r.user.role === 'admin' && <span className="text-[9px] bg-blue-500/20 text-blue-500 px-1 rounded uppercase font-bold tracking-widest">Admin</span>}
                                    <span className="text-[10px] text-neutral-500 font-mono">{format(r.createdAt)}</span>
                                 </div>
                                 <p className="text-neutral-700 dark:text-neutral-300 text-sm">{r.comment}</p>
                               </div>
                             </div>
                          ))}
                          <div className="flex gap-3 mt-4">
                            <input type="text" className="flex-1 bg-transparent border-b border-black/20 dark:border-white/20 text-sm text-black dark:text-white outline-none focus:border-blue-500 py-1" placeholder="Nhập câu trả lời..." value={answer} onChange={e=>setAnswer(e.target.value)}/>
                            <button className="text-sm font-bold text-blue-500 hover:text-blue-400 disabled:opacity-50" disabled={!answer} onClick={() => addAnswerInQuestion({answer, courseId: id, contentId: data[activeVideo]._id, questionId: q._id})}>Gửi</button>
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
               <div className="flex gap-4 mb-10 p-6 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                 <img src={user.avatar?.url || "/assets/avatar.png"} className="w-12 h-12 rounded-full object-cover shrink-0" alt="avatar"/>
                 <div className="flex-1 flex flex-col items-end gap-4">
                   <div className="w-full flex gap-1 mb-2">
                     {[1,2,3,4,5].map(i => i <= rating ? <AiFillStar key={i} size={24} className="text-yellow-500 cursor-pointer" onClick={()=>setRating(i)}/> : <AiOutlineStar key={i} size={24} className="text-yellow-500 cursor-pointer" onClick={()=>setRating(i)}/>)}
                   </div>
                   <textarea className={styles.input + " !h-24 py-3 resize-none"} placeholder="Khóa học này thế nào?" value={review} onChange={e=>setReview(e.target.value)} />
                   <button className={`${styles.button} !w-32 !py-2 text-sm`} onClick={() => addReviewInCourse({ review, rating, courseId: id })}>Đánh giá</button>
                 </div>
               </div>
            )}
            
            <div className="space-y-8">
              {course?.reviews && [...course.reviews].reverse().map((r:any) => (
                <div key={r._id} className="border-t border-black/5 dark:border-white/5 pt-6">
                  <div className="flex gap-4">
                    <img src={r.user.avatar?.url || "/assets/avatar.png"} className="w-10 h-10 rounded-full object-cover shrink-0" alt="avatar"/>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-black dark:text-white">{r.user.name}</span>
                          <span className="text-xs text-neutral-500 font-mono hidden sm:inline">{format(r.createdAt)}</span>
                        </div>
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(i => i <= r.rating ? <AiFillStar key={i} size={14} className="text-yellow-500"/> : <AiOutlineStar key={i} size={14} className="text-yellow-500"/>)}</div>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-3">{r.comment}</p>

                      {user.role === 'admin' && r.commentReplies.length === 0 && (
                        <button className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 mb-4" onClick={() => setReviewId(reviewId === r._id ? "" : r._id)}>Phản hồi học viên</button>
                      )}

                      {reviewId === r._id && (
                        <div className="flex gap-3 mb-6">
                           <input type="text" className="flex-1 bg-transparent border-b border-black/20 dark:border-white/20 text-sm text-black dark:text-white outline-none focus:border-blue-500 py-1" placeholder="Admin phản hồi..." value={reply} onChange={e=>setReply(e.target.value)}/>
                           <button className="text-sm font-bold text-blue-500 hover:text-blue-400 disabled:opacity-50" disabled={!reply} onClick={() => addReplyInReview({comment: reply, courseId: id, reviewId: r._id})}>Gửi</button>
                        </div>
                      )}

                      {r.commentReplies.map((rep:any, i:number) => (
                        <div key={i} className="mt-4 pl-4 border-l-2 border-blue-500/30 flex gap-3">
                           <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0"><span className="text-white text-[10px] font-bold">A</span></div>
                           <div>
                             <div className="flex items-baseline gap-2 mb-0.5">
                                <span className="font-semibold text-sm text-black dark:text-white">Admin</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{format(rep.createdAt)}</span>
                             </div>
                             <p className="text-neutral-700 dark:text-neutral-300 text-sm">{rep.comment}</p>
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
      </div>
    </div>
  );
};

export default CourseContentMedia;