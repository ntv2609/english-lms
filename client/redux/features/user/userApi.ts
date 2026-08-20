import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation<any, string>({
      query: (avatar) => ({
        url: 'update-user-avatar',
        method: 'PUT',
        body: { avatar },
      }),
    }),
    editProfile: builder.mutation<any, { name: string }>({
      query: ({ name }) => ({
        url: 'update-user-info',
        method: 'PUT',
        body: { name },
      }),
    }),
    updatePassword: builder.mutation<any, { oldPassword: string; newPassword: string }>({
      query: ({ oldPassword, newPassword }) => ({
        url: 'update-user-password',
        method: 'PUT',
        body: { oldPassword, newPassword },
      }),
    }),
  }),
});

export const { useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation } = userApi;