import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroData: builder.query({
      query: (type: string) => ({
        url: `get-layout/${type}`,
        method: "GET",
      }),
    }),
    editLayout: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;