import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/admin-login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotEmail: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: forgotEmail,
      }),
    }),

    OtpCheck: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
    }),

    resendPassword: builder.mutation({
      query: ({ token, data }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotEmailMutation,
  useOtpCheckMutation,
  useResendPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
