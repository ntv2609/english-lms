import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: 'update-user-avatar',
        method: 'PUT',
        body: { avatar },
        credentials: 'include', // <--- QUAN TRỌNG: Gửi kèm token
      }),
    }),
    editProfile: builder.mutation({
      query: ({ name }) => ({
        url: 'update-user-info',
        method: 'PUT',
        body: { name },
        credentials: 'include', // <--- QUAN TRỌNG: Gửi kèm token
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: 'update-user-password',
        method: 'PUT',
        body: { oldPassword, newPassword },
        credentials: 'include', // <--- QUAN TRỌNG: Gửi kèm token
      }),
    }),
  }),
});

export const { useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation } = userApi;