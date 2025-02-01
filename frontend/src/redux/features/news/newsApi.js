import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

const  baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/auth/news`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token =  localStorage.getItem('token');
        if(token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
})

const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery,
    tagTypes: ['News'],
    endpoints: (builder) =>({
        fetchAllNews: builder.query({
            query: () => "/all-news",
            providesTags: ["News"]
        }),
        fetchNewsById: builder.query({
            query: (id) => `/get-news/${id}`,
            providesTags: (result, error, id) => [{ type: "News", id }],
        }),
        addNews: builder.mutation({
            query: (newNews) => ({
                url: `/create-news`,
                method: "POST",
                body: newNews
            }),
            invalidatesTags: ["News"]
        }),
        updateNews: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/edit-news/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["News"]
        }),
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/delete-news/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["News"]
        })
    })
})

export const {useFetchAllNewsQuery, useFetchNewsByIdQuery, useAddNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation} = newsApi;
export default newsApi;