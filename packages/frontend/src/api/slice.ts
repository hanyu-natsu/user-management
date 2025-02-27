import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './query/reauth';
import { PaginatedResults } from './types/PaginatedResults';
import { User } from './types/User';

function convertDateString(date?: Date): string | undefined {
  if (!date) {
    return undefined;
  }
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toISOString().split('T')[0];
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Auth API
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    login: builder.mutation<void, { email: string; password: string }>({
      query: (body) => ({
        url: `auth/login`,
        method: 'POST',
        body,
      }),
    }),

    // User API
    createUser: builder.mutation<User, Partial<User>>({
      invalidatesTags: ['User'],
      query: (user) => {
        const birthdate = convertDateString(user.birthdate);
        return {
          url: 'user',
          method: 'POST',
          body: { ...user, birthdate },
        };
      },
    }),

    getUserById: builder.query<User, { id: string }>({
      providesTags: ['User'],
      query: ({ id }) => `/user/${id}`,
    }),

    getUsers: builder.query<
      PaginatedResults<User>,
      { page: number; search: string }
    >({
      providesTags: ['User'],
      query: ({ page, search }) => {
        const searchParam = new URLSearchParams();
        searchParam.append('page', page.toString());
        if (search) {
          searchParam.append('search', search);
        }
        return `user?${searchParam.toString()}`;
      },
    }),

    updateUser: builder.mutation<User, { id: string; user: Partial<User> }>({
      invalidatesTags: ['User'],
      query: ({ id, user }) => {
        const birthdate = convertDateString(user.birthdate);
        return {
          url: `user/${id}`,
          method: 'PUT',
          body: { ...user, birthdate },
        };
      },
    }),

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    deleteUser: builder.mutation<void, { id: string }>({
      invalidatesTags: ['User'],
      query: ({ id }) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useLazyGetUserByIdQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
