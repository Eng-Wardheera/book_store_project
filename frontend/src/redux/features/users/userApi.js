import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

const  baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/auth`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token =  localStorage.getItem('token');
        if(token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
})

const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery,
    tagTypes: ['Users'],
    endpoints: (builder) =>({
        fetchAllUsers: builder.query({
            query: () => "/all-users",
            providesTags: ["Users"]
        }),
        fetchUserById: builder.query({
            query: (id) => `/get-user/${id}`,
            providesTags: (result, error, id) => [{ type: "Users", id }],
        }),
        addUser: builder.mutation({
            query: (newUser) => ({
                url: `/create-user`,
                method: "POST",
                body: newUser
            }),
            invalidatesTags: ["Users"]
        }),
        updateUser: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/edit-user/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Users"]
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/delete-user/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"]
        })
    })
})

export const {useFetchAllUsersQuery, useFetchUserByIdQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation} = usersApi;
export default usersApi;