import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import { redis } from "../utils/redis"; // Import redis

// create course
export const createCourse = CatchAsyncErrors(async(data:any,res:Response)=>{
    const course = await CourseModel.create(data);
    
    // FIX BUG: Xóa cache danh sách khóa học cũ để hiển thị khóa mới ra trang chủ
    await redis.del("allCourses");
    
    res.status(201).json({
        success:true,
        course
    });
});

// get all courses
export const getAllCoursesService = async (res: Response) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        courses,
    });
};