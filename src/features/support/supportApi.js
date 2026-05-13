import { baseApi } from "../../utils/apiBaseQuery";


export const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupport: builder.query({
            query: (params) => ({
                url: `/support/all`,
                method: "GET",
                params,
            }),
            providesTags: ["Support"],
        }),

        replySupport: builder.mutation({
            query: ({ id, data }) => ({
                url: `/support/reply/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Support"],
        }),

        deleteSupport: builder.mutation({
            query: (id) => ({
                url: `/support/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Support"],
        }),
    }),
});

export const {
    useGetAllSupportQuery,
    useReplySupportMutation,
    useDeleteSupportMutation
} = supportApi;
