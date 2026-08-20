import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "get-all-notifications",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateNotificationStatus: builder.mutation({
      query: (id: string) => ({
        url: `update-notification/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetNotificationsQuery, useUpdateNotificationStatusMutation } = notificationsApi;