import { styles } from "@/app/styles/style";
import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsPencil, BsLink45Deg } from "react-icons/bs";
import toast from "react-hot-toast";
import { useGenerateQuizMutation } from "@/redux/features/courses/coursesApi"; // <-- Load API Sinh Quiz AI

interface Props {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any[];
  setCourseContentData: (courseContentData: any[]) => void;
  handleSubmit: () => void;
}

const CourseContent: FC<Props> = ({ courseContentData, setCourseContentData, active, setActive, handleSubmit }) => {
  const [isCollapsed, setIsCollapsed] = useState(Array(courseContentData.length).fill(false));
  const [activeSection, setActiveSection] = useState<number>(1);
  
  // Trạng thái AI Loading
  const [generateQuiz, { isLoading: isGeneratingQuiz }] = useGenerateQuizMutation();

  const toggle = (idx: number) => {
    const arr = [...isCollapsed];
    arr[idx] = !arr[idx];
    setIsCollapsed(arr);
  };

  const newContentHandler = (item: any) => {
    if (item.title === "" || item.description === "" || item.videoUrl === "") {
      toast.error("Please fill required fields!");
    } else {
      let sec = "";
      if (courseContentData.length > 0) sec = courseContentData[courseContentData.length - 1].videoSection;
      setCourseContentData([...courseContentData, { videoUrl: "", title: "", description: "", videoLength: "", videoSection: sec, links: [{ title: "", url: "" }] }]);
    }
  };

  const addNewSection = () => {
    const last = courseContentData[courseContentData.length - 1];
    if (last.title === "" || last.description === "" || last.videoUrl === "") {
      toast.error("Please fill required fields first!");
    } else {
      setActiveSection(activeSection + 1);
      setCourseContentData([...courseContentData, { videoUrl: "", title: "", description: "", videoLength: "", videoSection: `Untitled Section ${activeSection}`, links: [{ title: "", url: "" }] }]);
    }
  };

  // Hàm sinh Quiz bằng AI và nối thẳng vào Description
  const handleGenerateAIQuiz = async (index: number) => {
    const currentLesson = courseContentData[index];
    if (!currentLesson.title && !currentLesson.description) {
      toast.error("Hãy nhập tiêu đề hoặc mô tả trước để AI có dữ liệu sinh đề nhé!");
      return;
    }

    try {
      const contextData = `${currentLesson.title} - ${currentLesson.description}`;
      const res = await generateQuiz({ contextData, questionCount: 5, level: "Intermediate" }).unwrap();
      
      let quizText = `\n\n--- 🤖 BÀI TẬP TRẮC NGHIỆM (AI SINH TỰ ĐỘNG) ---\n`;
      res.questions.forEach((q: any, i: number) => {
        quizText += `\nCâu ${i + 1}: ${q.question}\n`;
        q.options.forEach((opt: string, j: number) => {
          quizText += `  ${String.fromCharCode(65 + j)}. ${opt}\n`;
        });
        quizText += `=> Đáp án: ${q.correctAnswer}\n`;
        quizText += `* Giải thích: ${q.explanation}\n`;
      });

      const arr = [...courseContentData];
      arr[index].description = (arr[index].description || "") + quizText;
      setCourseContentData(arr);
      toast.success("AI đã tạo xong 5 câu hỏi trắc nghiệm!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Lỗi AI, vui lòng thử lại!");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {courseContentData.map((item: any, index: number) => {
          const showSectionInput = index === 0 || item.videoSection !== courseContentData[index - 1].videoSection;
          return (
            <div key={index} className={styles.card + " p-6"}>
              {showSectionInput && (
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
                  <input
                    type="text"
                    className="text-xl font-Josefin font-bold bg-transparent outline-none text-black dark:text-white w-full"
                    value={item.videoSection}
                    onChange={(e) => {
                      const arr = [...courseContentData];
                      arr[index].videoSection = e.target.value;
                      setCourseContentData(arr);
                    }}
                  />
                  <BsPencil className="text-neutral-500" />
                </div>
              )}
              
              <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-md cursor-pointer" onClick={() => toggle(index)}>
                <p className="font-medium text-black dark:text-white text-sm">
                  {index + 1}. {item.title || "Untitled Video"}
                </p>
                <div className="flex items-center gap-4">
                  <AiOutlineDelete
                    className={`text-neutral-400 hover:text-red-500 transition-colors ${index === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index > 0) {
                        const arr = [...courseContentData];
                        arr.splice(index, 1);
                        setCourseContentData(arr);
                      }
                    }}
                    size={18}
                  />
                  <MdOutlineKeyboardArrowDown size={22} className={`text-neutral-500 transition-transform ${isCollapsed[index] ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {!isCollapsed[index] && (
                <div className="mt-6 space-y-5 pl-4 border-l-2 border-black/5 dark:border-white/5">
                  <div>
                    <label className={styles.label}>Video Title</label>
                    <input type="text" className={styles.input} value={item.title} onChange={(e) => { const arr=[...courseContentData]; arr[index].title=e.target.value; setCourseContentData(arr); }} />
                  </div>
                  <div>
                    <label className={styles.label}>Video ID (VdoCipher)</label>
                    <input type="text" className={styles.input} value={item.videoUrl} onChange={(e) => { const arr=[...courseContentData]; arr[index].videoUrl=e.target.value; setCourseContentData(arr); }} />
                  </div>
                  <div>
                    <label className={styles.label}>Video Length (minutes)</label>
                    <input type="number" className={styles.input} value={item.videoLength} onChange={(e) => { const arr=[...courseContentData]; arr[index].videoLength=e.target.value; setCourseContentData(arr); }} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={styles.label}>Description</label>
                      {/* Nút Sinh Trắc Nghiệm Bằng AI */}
                      <button 
                        type="button" 
                        onClick={() => handleGenerateAIQuiz(index)}
                        disabled={isGeneratingQuiz}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition-colors flex items-center gap-1 mb-1 disabled:opacity-50"
                      >
                        🪄 {isGeneratingQuiz ? "Đang sinh đề..." : "Trợ lý AI: Sinh trắc nghiệm"}
                      </button>
                    </div>
                    <textarea rows={6} className={styles.input + " !h-auto py-3 resize-none"} value={item.description} onChange={(e) => { const arr=[...courseContentData]; arr[index].description=e.target.value; setCourseContentData(arr); }} />
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    {item.links.map((link: any, linkIndex: number) => (
                      <div key={linkIndex} className="bg-black/5 dark:bg-[#0A0A0A] p-4 rounded border border-black/5 dark:border-white/5">
                        <div className="flex justify-between items-center mb-3">
                          <label className={styles.label}>Resource Link {linkIndex + 1}</label>
                          <AiOutlineDelete size={16} className="text-neutral-400 hover:text-red-500 cursor-pointer" onClick={() => {
                            if(linkIndex>0){
                              const arr=[...courseContentData]; arr[index].links.splice(linkIndex,1); setCourseContentData(arr);
                            }
                          }}/>
                        </div>
                        <input type="text" placeholder="Title" className={styles.input + " mb-2"} value={link.title} onChange={(e) => { const arr=[...courseContentData]; arr[index].links[linkIndex].title=e.target.value; setCourseContentData(arr); }} />
                        <input type="text" placeholder="URL" className={styles.input} value={link.url} onChange={(e) => { const arr=[...courseContentData]; arr[index].links[linkIndex].url=e.target.value; setCourseContentData(arr); }} />
                      </div>
                    ))}
                    <button type="button" className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1" onClick={() => {
                      const arr=[...courseContentData]; arr[index].links.push({title:"",url:""}); setCourseContentData(arr);
                    }}>
                      <BsLink45Deg size={18} /> Add Link
                    </button>
                  </div>
                </div>
              )}
              {index === courseContentData.length - 1 && (
                <button type="button" className="mt-6 text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-2" onClick={() => newContentHandler(item)}>
                  <AiOutlinePlusCircle size={18}/> Add Video to Section
                </button>
              )}
            </div>
          );
        })}
        <button type="button" className="w-full py-4 border-2 border-dashed border-black/10 dark:border-white/10 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all flex justify-center items-center gap-2 font-medium" onClick={addNewSection}>
          <AiOutlinePlusCircle size={20}/> Create New Section
        </button>
      </form>
      <div className="w-full flex justify-between mt-10">
        <button className={`${styles.button} !w-32 !bg-transparent !text-black dark:!text-white border border-black/20 dark:border-white/20`} onClick={() => setActive(active - 1)}>Back</button>
        <button className={`${styles.button} !w-32`} onClick={() => handleSubmit()}>Next</button>
      </div>
    </div>
  );
};

export default CourseContent;