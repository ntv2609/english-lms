import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderInfo) => ({
        url: "create-order",
        method: "POST",
        body: orderInfo,
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "get-orders",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetAllOrdersQuery } = ordersApi;