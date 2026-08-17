import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: String(process.env.NEXT_PUBLIC_SERVER_URI),
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query<any, any>({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),
    loadUser: builder.query<any, any>({
      query: () => ({
        url: "me",
        method: "GET",
      }),
    }),
  }),
});