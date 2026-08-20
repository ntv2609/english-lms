import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: 'update-user-avatar',
        method: 'PUT',
        body: { avatar },
        credentials: 'include',
      }),
    }),
    editProfile: builder.mutation({
      query: ({ name }) => ({
        url: 'update-user-info',
        method: 'PUT',
        body: { name },
        credentials: 'include',
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: 'update-user-password',
        method: 'PUT',
        body: { oldPassword, newPassword },
        credentials: 'include',
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: "update-user",
        method: "PUT",
        body: { id, role },
        credentials: "include",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const { 
  useUpdateAvatarMutation, 
  useEditProfileMutation, 
  useUpdatePasswordMutation, 
  useGetAllUsersQuery, 
  useUpdateUserRoleMutation, 
  useDeleteUserMutation 
} = userApi;