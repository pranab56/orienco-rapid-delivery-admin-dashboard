import { baseApi } from "../../utils/apiBaseQuery";


export const contactApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllContact: builder.query({
            query: ({ page = 1, limit = 10, searchTerm = "", status = "" }) => ({
                url: `/contact`,
                method: "GET",
                params: { page, limit, searchTerm, status },
            }),
            providesTags: ["Contact"],
        }),

        getContactById: builder.query({
            query: (id) => ({
                url: `/contact/${id}`,
                method: "GET",
            }),
            providesTags: ["Contact"],
        }),

        replyContact: builder.mutation({
            query: ({ id, data }) => ({
                url: `/contact/reply/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Contact"],
        }),

    }),
});

export const {
    useGetAllContactQuery,
    useGetContactByIdQuery,
    useReplyContactMutation,
} = contactApi;
