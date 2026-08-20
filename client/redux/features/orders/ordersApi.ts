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
    createMoMoPayment: builder.mutation({
      query: (paymentInfo) => ({
        url: "payment/momo",
        method: "POST",
        body: paymentInfo,
      }),
    }),
  }),
});

export const { 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useCreateMoMoPaymentMutation 
} = ordersApi;