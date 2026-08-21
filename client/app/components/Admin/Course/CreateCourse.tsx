"use client";
import React, { FC, useState, useEffect } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {}

const CreateCourse: FC<Props> = (props) => {
  const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) { toast.success("Khởi tạo khóa học thành công!"); router.push("/admin/courses"); }
    if (error && "data" in error) toast.error((error as any).data.message);
  }, [isLoading, isSuccess, error, router]);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({ name: "", description: "", price: "", estimatedPrice: "", tags: "", level: "", categories: "", demoUrl: "", thumbnail: "" });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([{ videoUrl: "", title: "", description: "", videoLength: "", videoSection: "Phần 1: Giới thiệu", links: [{ title: "", url: "" }], suggestion: "" }]);
  const [courseData, setCourseData] = useState({});

  const handleSubmit = async () => {
    const data = {
      ...courseInfo,
      totalVideos: courseContentData.length,
      benefits: benefits.map(b => ({title: b.title})),
      prerequisites: prerequisites.map(p => ({title: p.title})),
      courseData: courseContentData
    };
    setCourseData(data);
  };

  return (
    <div className="flex gap-10">
      <div className="flex-1 max-w-[1000px]">
        {active === 0 && <CourseInformation courseInfo={courseInfo} setCourseInfo={setCourseInfo} active={active} setActive={setActive} />}
        {active === 1 && <CourseData benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} active={active} setActive={setActive} />}
        {active === 2 && <CourseContent active={active} setActive={setActive} courseContentData={courseContentData} setCourseContentData={setCourseContentData} handleSubmit={handleSubmit} />}
        {active === 3 && <CoursePreview active={active} setActive={setActive} courseData={courseData} handleCourseCreate={() => !isLoading && createCourse(courseData)} />}
      </div>
      <div className="w-[280px] shrink-0 pt-10 hidden xl:block">
        <div className="sticky top-32"><CourseOptions active={active} setActive={setActive} /></div>
      </div>
    </div>
  );
};

export default CreateCourse;