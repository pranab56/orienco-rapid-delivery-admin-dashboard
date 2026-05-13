import { baseApi } from "../../utils/apiBaseQuery";


export const legalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createLegal: builder.mutation({
            query: (data) => ({
                url: `/public`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["legal"],
        }),

        getPrivacyPolicy: builder.query({
            query: () => ({
                url: `/public/privacy-policy`,
                method: "GET",
            }),
            providesTags: ["legal"],
        }),

        getTermsAndCondition: builder.query({
            query: () => ({
                url: `/public/terms-and-condition`,
                method: "GET",
            }),
            providesTags: ["legal"],
        }),

        createFAQ: builder.mutation({
            query: (data) => ({
                url: `/public/faq`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["faq"],
        }),

        getAllFaq: builder.query({
            query: () => ({
                url: `/public/faq/all`,
                method: "GET",
            }),
            providesTags: ["faq"],
        }),

        updateFAQ: builder.mutation({
            query: ({ id, data }) => ({
                url: `/public/faq/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["faq"],
        }),

        deleteFaq: builder.mutation({
            query: (id) => ({
                url: `/public/faq/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["faq"],
        }),
    }),
});

export const {
    useCreateLegalMutation,
    useGetPrivacyPolicyQuery,
    useGetTermsAndConditionQuery,
    useCreateFAQMutation,
    useGetAllFaqQuery,
    useUpdateFAQMutation,
    useDeleteFaqMutation
} = legalApi;
