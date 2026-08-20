import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "get-courses-analytics",
        method: "GET",
      }),
    }),
    getUsersAnalytics: builder.query({
      query: () => ({
        url: "get-users-analytics",
        method: "GET",
      }),
    }),
    getOrdersAnalytics: builder.query({
      query: () => ({
        url: "get-orders-analytics",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCoursesAnalyticsQuery,
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} = analyticsApi;