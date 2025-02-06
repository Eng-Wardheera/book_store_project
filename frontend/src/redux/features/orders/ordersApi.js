import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include',
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder,
            }),
        }),
        getOrderByEmail: builder.query({
            query: (email) => ({
                url: `/email/${email}`,
            }),
            providesTags: ['Orders'],
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: "/all-orders",
            }),
            providesTags: ['Orders'],
        }),
        updateProductStatus: builder.mutation({
            query: ({ productId }) => ({
                url: `/products/${productId}`,
                method: "PATCH",
                body: { status: 1 },
            }),
        }),
        removeFromBookCollection: builder.mutation({
            query: ({ productId }) => ({
                url: `/books/${productId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { 
    useCreateOrderMutation, 
    useGetOrderByEmailQuery, 
    useGetAllOrdersQuery, 
    useUpdateProductStatusMutation, 
    useRemoveFromBookCollectionMutation 
} = ordersApi;

export default ordersApi;
