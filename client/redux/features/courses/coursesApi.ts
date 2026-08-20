import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-all-courses",
        method: "GET",
        credentials: "include",
      }),
    }),
    getUsersAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
      }),
    }),
    getCourseDetails: builder.query({
      query: (id: string) => ({
        url: `get-course/${id}`,
        method: "GET",
      }),
    }),
    // Endpoint mới để fetch content bài giảng
    getCourseContent: builder.query({
      query: (id: string) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    // Mutation thêm câu hỏi
    addQuestion: builder.mutation({
      query: (data) => ({
        url: "add-question",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // Mutation trả lời câu hỏi
    addAnswerInQuestion: builder.mutation({
      query: (data) => ({
        url: "add-answer",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    // Mutation đánh giá khoá học
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }) => ({
        url: `add-review/${courseId}`,
        method: "PUT",
        body: { review, rating },
        credentials: "include",
      }),
    }),
    // Mutation phản hồi đánh giá
    addReplyInReview: builder.mutation({
      query: (data) => ({
        url: "add-reply",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const { 
  useCreateCourseMutation, 
  useGetAllCoursesQuery, 
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
  useDeleteCourseMutation, 
  useEditCourseMutation 
} = coursesApi;