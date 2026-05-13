import { baseApi } from "../../utils/apiBaseQuery";


export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: ({ page, searchTerm, status, role }) => ({
                url: `/user?page=${page}${searchTerm ? `&searchTerm=${searchTerm}` : ""}${status && status !== "all" ? `&status=${status}` : ""}${role ? `&role=${role}` : ""}`,
                method: "GET",

            }),
            providesTags: ["user"],
        }),

        getUserById: builder.query({
            query: ({ id }) => ({
                url: `/user/${id}`,
                method: "GET",

            }),
            providesTags: ["user"],
        }),


        newDriverRequests: builder.query({
            query: ({ page }) => ({
                url: `/user/new-driver-requests?page=${page}`,
                method: "GET",

            }),
            providesTags: ["user"],
        }),

        approve: builder.mutation({
            query: ({ id }) => ({
                url: `/user/verify-profile/${id}`,
                method: "PATCH",
                body: { status: "approved" },
            }),
            invalidatesTags: ["user"],
        }),

        suspense: builder.mutation({
            query: ({ id }) => ({
                url: `/user/suspend-reactive/${id}`,
                method: "PATCH",

            }),
            invalidatesTags: ["user"],
        }),

        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/user/${id}`,
                method: "DELETE",

            }),
            invalidatesTags: ["user"],
        }),

    }),
});

export const {
    useGetAllUserQuery,
    useGetUserByIdQuery,
    useNewDriverRequestsQuery,
    useApproveMutation,
    useSuspenseMutation,
    useDeleteUserMutation
} = userApi;
