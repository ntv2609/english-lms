"use client";
import React, { FC, useState, useEffect } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useEditCourseMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props { id: string; }

const EditCourse: FC<Props> = ({ id }) => {
  const [editCourse, { isSuccess, error }] = useEditCourseMutation();
  const { data } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const router = useRouter();
  const editCourseData = data?.courses.find((i: any) => i._id.toString() === id.toString());

  useEffect(() => {
    if (isSuccess) { toast.success("Cập nhật thành công!"); router.push("/admin/courses"); }
    if (error && "data" in error) toast.error((error as any).data.message);
  }, [isSuccess, error, router]);

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({ name: "", description: "", categories: "", price: "", estimatedPrice: "", tags: "", level: "", demoUrl: "", thumbnail: "" });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  // BỔ SUNG: Thuộc tính homework: "" và quizzes: [] vào initial state
  const [courseContentData, setCourseContentData] = useState([{ videoUrl: "", title: "", description: "", videoLength: "", videoSection: "Untitled Section", homework: "", quizzes: [], links: [{ title: "", url: "" }], suggestion: "" }]);
  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    if (editCourseData) {
      setCourseInfo({ name: editCourseData.name, description: editCourseData.description, categories: editCourseData.categories, price: editCourseData.price, estimatedPrice: editCourseData.estimatedPrice, tags: editCourseData.tags, level: editCourseData.level, demoUrl: editCourseData.demoUrl, thumbnail: editCourseData?.thumbnail?.url });
      setBenefits(editCourseData.benefits);
      setPrerequisites(editCourseData.prerequisites);
      setCourseContentData(editCourseData.courseData);
    }
  }, [editCourseData]);

  const handleSubmit = async () => {
    setCourseData({ ...courseInfo, totalVideos: courseContentData.length, benefits: benefits.map(b => ({title: b.title})), prerequisites: prerequisites.map(p => ({title: p.title})), courseData: courseContentData });
  };

  return (
    <div className="flex gap-10">
      <div className="flex-1 max-w-[1000px]">
        {active === 0 && <CourseInformation courseInfo={courseInfo} setCourseInfo={setCourseInfo} active={active} setActive={setActive} />}
        {active === 1 && <CourseData benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} active={active} setActive={setActive} />}
        {active === 2 && <CourseContent active={active} setActive={setActive} courseContentData={courseContentData} setCourseContentData={setCourseContentData} handleSubmit={handleSubmit} />}
        {active === 3 && <CoursePreview active={active} setActive={setActive} courseData={courseData} handleCourseCreate={() => editCourse({ id, data: courseData })} isEdit={true} />}
      </div>
      <div className="w-[280px] shrink-0 pt-10 hidden xl:block">
        <div className="sticky top-32"><CourseOptions active={active} setActive={setActive} /></div>
      </div>
    </div>
  );
};

export default EditCourse;