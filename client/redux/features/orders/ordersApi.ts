import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderInfo) => ({
        url: "create-order",
        method: "POST",
        body: orderInfo,
        credentials: "include", 
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "get-orders",
        method: "GET",
        credentials: "include", 
      }),
    }),
    createMoMoPayment: builder.mutation({
      query: (paymentInfo) => ({
        url: "payment/momo",
        method: "POST",
        body: paymentInfo,
        credentials: "include",
      }),
    }),
    refundOrder: builder.mutation({
      query: ({ orderId }) => ({
        url: "refund-order",
        method: "POST",
        body: { orderId },
        credentials: "include",
      }),
    }),
  }),
});

export const { 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useCreateMoMoPaymentMutation,
    useRefundOrderMutation
} = ordersApi;