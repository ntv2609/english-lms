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
        credentials: "include", // <--- Thêm dòng này để Admin lấy được bảng Invoices
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
  }),
});

export const { 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useCreateMoMoPaymentMutation 
} = ordersApi;