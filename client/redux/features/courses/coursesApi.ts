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
    getCourseContent: builder.query({
      query: (id: string) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    addQuestion: builder.mutation({
      query: (data) => ({
        url: "add-question",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: (data) => ({
        url: "add-answer",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }) => ({
        url: `add-review/${courseId}`,
        method: "PUT",
        body: { review, rating },
        credentials: "include",
      }),
    }),
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
    // ==========================================
    // CÁC ENDPOINT TÍCH HỢP AI MỚI
    // ==========================================
    chatWithAI: builder.mutation({
      query: (data) => ({
        url: "ai/chat",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    evaluateWriting: builder.mutation({
      query: (data) => ({
        url: "ai/evaluate-writing",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    generateQuiz: builder.mutation({
      query: (data) => ({
        url: "ai/generate-quiz",
        method: "POST",
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
  useEditCourseMutation,
  useChatWithAIMutation,
  useEvaluateWritingMutation,
  useGenerateQuizMutation
} = coursesApi;