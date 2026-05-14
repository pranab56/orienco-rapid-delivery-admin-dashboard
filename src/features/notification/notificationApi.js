import { baseApi } from "@/utils/apiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: ({ page, limit }) => ({
                url: `/notification?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["notification"],
        }),

        getUnReadCount: builder.query({
            query: () => ({
                url: `/notification/unread-count`,
                method: "GET",
            }),
            providesTags: ["notification"],
        }),

    }),
    overrideExisting: true,
});

export const {
    useGetAllNotificationsQuery,
    useGetUnReadCountQuery,
} = notificationApi;
