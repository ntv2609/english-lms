import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: String(process.env.NEXT_PUBLIC_SERVER_URI),
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query<any, void>({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include",
      }),
    }),
    loadUser: builder.query<any, void>({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // FIX LỖI F5 VĂNG TRANG: Bơm lại data vào Redux State ngay lập tức
          dispatch(
            userLoggedIn({
              accessToken: "", // Khong can vi da dung http-only cookie
              user: result.data.user,
            })
          );
        } catch (error) {
          // Bỏ qua lỗi ngầm để app không bị crash
        }
      },
    }),
  }),
});

export const { useLoadUserQuery, useRefreshTokenQuery } = apiSlice;