import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import {
  useAddAnswerInQuestionMutation,
  useAddQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import Ratings from "../utils/Ratings";

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);

  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });
  const course = courseData?.course;

  const [addNewQuestion, { isSuccess: qSuccess, error: qError, isLoading: qLoading }] = useAddQuestionMutation();
  const [addAnswerInQuestion, { isSuccess: aSuccess, error: aError, isLoading: aLoading }] = useAddAnswerInQuestionMutation();
  const [addReviewInCourse, { isSuccess: rSuccess, error: rError, isLoading: rLoading }] = useAddReviewInCourseMutation();
  const [addReplyInReview, { isSuccess: rrSuccess, error: rrError, isLoading: rrLoading }] = useAddReplyInReviewMutation();

  const isReviewExists = course?.reviews?.find((item: any) => item.user._id === user._id);

  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Câu hỏi không được để trống");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  useEffect(() => {
    if (qSuccess) {
      setQuestion("");
      refetch();
      toast.success("Đã thêm câu hỏi thành công");
    }
    if (qError) {
      if ("data" in qError) {
        const errorData = qError as any;
        toast.error(errorData.data.message);
      }
    }
    if (aSuccess) {
      setAnswer("");
      refetch();
      toast.success("Đã trả lời câu hỏi thành công");
    }
    if (aError) {
      if ("data" in aError) {
        const errorData = aError as any;
        toast.error(errorData.data.message);
      }
    }
    if (rSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      toast.success("Đã thêm đánh giá thành công");
    }
    if (rError) {
      if ("data" in rError) {
        const errorData = rError as any;
        toast.error(errorData.data.message);
      }
    }
    if (rrSuccess) {
      setReply("");
      setIsReviewReply(false);
      courseRefetch();
      toast.success("Đã trả lời đánh giá thành công");
    }
    if (rrError) {
      if ("data" in rrError) {
        const errorData = rrError as any;
        toast.error(errorData.data.message);
      }
    }
  }, [qSuccess, qError, aSuccess, aError, rSuccess, rError, rrSuccess, rrError, refetch, courseRefetch]);

  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };

  const handleReviewSubmit = () => {
    if (review.length === 0) {
      toast.error("Đánh giá không được để trống");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (!reply) {
      toast.error("Câu trả lời không được để trống");
    } else {
      addReplyInReview({ comment: reply, courseId: id, reviewId });
    }
  };

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] text-white dark:text-white text-black ${
            activeVideo === 0 && "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Bài trước
        </div>
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] text-white dark:text-white text-black ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          Bài tiếp theo
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-black">
        {data[activeVideo].title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Tổng quan", "Tài nguyên", "Hỏi đáp", "Đánh giá"].map((text, index) => (
          <h5
            key={index}
            className={`800px:text-[20px] cursor-pointer ${
              activeBar === index
                ? "text-red-500"
                : "dark:text-white text-black"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {data[activeVideo]?.description}
        </p>
      )}

      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                {item.title && item.title + " :"}
              </h2>
              <a
                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={user.avatar ? user.avatar.url : "/assets/avatar.png"}
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Đặt câu hỏi..."
              className="outline-none bg-transparent ml-3 border dark:border-[#ffffff57] border-[#00000028] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${
                qLoading && "cursor-not-allowed"
              }`}
              onClick={qLoading ? () => {} : handleQuestion}
            >
              Gửi
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div>
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={aLoading}
            />
          </div>
        </>
      )}

      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <Image
                    src={user.avatar ? user.avatar.url : "/assets/avatar.png"}
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                      Cho đánh giá <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="Nhập đánh giá của bạn..."
                      className="outline-none bg-transparent ml-3 border dark:border-[#ffffff57] border-[#00000028] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${
                      rLoading && "cursor-not-allowed"
                    }`}
                    onClick={rLoading ? () => {} : handleReviewSubmit}
                  >
                    Đánh giá
                  </div>
                </div>
              </>
            )}
            <br />
            <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
            <div className="w-full">
              {(course?.reviews && [...course.reviews].reverse())?.map(
                (item: any, index: number) => (
                  <div className="w-full my-5 dark:text-white text-black" key={index}>
                    <div className="w-full flex">
                      <div>
                        <Image
                          src={
                            item.user.avatar
                              ? item.user.avatar.url
                              : "/assets/avatar.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-2 w-full">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{item.user.name}</h5>
                            {item.user.role === "admin" && (
                              <VscVerifiedFilled className="text-[#50c878] ml-2 text-[20px]" />
                            )}
                          </div>
                          <Ratings rating={item.rating} />
                        </div>
                        <p>{item.comment}</p>
                        <small className="dark:text-[#ffffff83] text-[#000000d1]">
                          {format(item.createdAt)}
                        </small>
                      </div>
                    </div>
                    {user.role === "admin" && (
                      <div className="w-full flex items-center pl-14 mt-2">
                        <span
                          className={`${styles.label} cursor-pointer mr-2`}
                          onClick={() => {
                            setIsReviewReply(true);
                            setReviewId(item._id);
                          }}
                        >
                          Trả lời
                        </span>
                      </div>
                    )}
                    {isReviewReply && reviewId === item._id && (
                      <div className="w-full flex relative ml-14 mt-2">
                        <input
                          type="text"
                          placeholder="Nhập câu trả lời..."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          className="block outline-none bg-transparent border-b dark:border-[#ffffff3d] border-[#00000027] p-[5px] w-[90%] dark:text-white text-black"
                        />
                        <button
                          type="submit"
                          className={`right-0 absolute ${
                            reply === ""
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          } dark:text-white text-black`}
                          onClick={handleReviewReplySubmit}
                          disabled={reply === "" || rrLoading}
                        >
                          Gửi
                        </button>
                      </div>
                    )}
                    {item.commentReplies?.map((reply: any, i: number) => (
                      <div className="w-full flex 800px:ml-16 my-5" key={i}>
                        <div>
                          <Image
                            src={
                              reply.user.avatar
                                ? reply.user.avatar.url
                                : "/assets/avatar.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-3">
                          <div className="flex items-center">
                            <h5 className="text-[20px] dark:text-white text-black">
                              {reply.user.name}
                            </h5>
                            {reply.user.role === "admin" && (
                              <VscVerifiedFilled className="text-[#50c878] ml-2 text-[20px]" />
                            )}
                          </div>
                          <p className="dark:text-white text-black">
                            {reply.comment}
                          </p>
                          <small className="dark:text-[#ffffff83] text-[#000000d1]">
                            {format(reply.createdAt)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

// Component con xử lý UI cho comment & reply
const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {(data[activeVideo]?.questions && [...data[activeVideo].questions].reverse())?.map((item: any, index: number) => (
          <CommentItem
            key={index}
            data={data}
            activeVideo={activeVideo}
            item={item}
            index={index}
            answer={answer}
            setAnswer={setAnswer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  item,
  answer,
  setAnswer,
  questionId,
  setQuestionId,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <div className="my-4">
      <div className="flex mb-2">
        <div>
          <Image
            src={
              item.user.avatar ? item.user.avatar.url : "/assets/avatar.png"
            }
            width={50}
            height={50}
            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </div>
        <div className="pl-3">
          <div className="flex items-center">
            <h5 className="text-[20px] dark:text-white text-black">
              {item.user.name}
            </h5>
            {item.user.role === "admin" && (
              <VscVerifiedFilled className="text-[#50c878] ml-2 text-[20px]" />
            )}
          </div>
          <p className="dark:text-white text-black">{item.comment}</p>
          <small className="dark:text-[#ffffff83] text-[#000000d1]">
            {item.createdAt ? format(item.createdAt) : ""}
          </small>
        </div>
      </div>
      <div className="w-full flex items-center dark:text-white text-black pl-14">
        <span
          className="text-[14px] cursor-pointer mr-2"
          onClick={() => {
            setReplyActive(!replyActive);
            setQuestionId(item._id);
          }}
        >
          {!replyActive
            ? item.commentReplies.length !== 0
              ? "Tất cả phản hồi"
              : "Thêm phản hồi"
            : "Ẩn phản hồi"}
        </span>
        <BiMessage size={20} className="cursor-pointer" />
        <span className="pl-1 cursor-pointer">
          {item.commentReplies.length}
        </span>
      </div>

      {replyActive && questionId === item._id && (
        <>
          {item.commentReplies.map((reply: any, i: number) => (
            <div className="w-full flex 800px:ml-16 my-5" key={i}>
              <div>
                <Image
                  src={
                    reply.user.avatar
                      ? reply.user.avatar.url
                      : "/assets/avatar.png"
                  }
                  width={50}
                  height={50}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              </div>
              <div className="pl-3">
                <div className="flex items-center">
                  <h5 className="text-[20px] dark:text-white text-black">
                    {reply.user.name}
                  </h5>
                  {reply.user.role === "admin" && (
                    <VscVerifiedFilled className="text-[#50c878] ml-2 text-[20px]" />
                  )}
                </div>
                <p className="dark:text-white text-black">{reply.comment}</p>
                <small className="dark:text-[#ffffff83] text-[#000000d1]">
                  {format(reply.createdAt)}
                </small>
              </div>
            </div>
          ))}
          <div className="w-full flex items-center mt-4">
            <input
              type="text"
              placeholder="Nhập câu trả lời..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b dark:border-[#ffffff3d] border-[#00000027] p-[5px] w-[95%] dark:text-white text-black"
            />
            <button
              type="submit"
              className={`mt-2 right-0 absolute ${
                answer === "" ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              } dark:text-white text-black`}
              onClick={handleAnswerSubmit}
              disabled={answer === "" || answerCreationLoading}
            >
              Gửi
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseContentMedia;