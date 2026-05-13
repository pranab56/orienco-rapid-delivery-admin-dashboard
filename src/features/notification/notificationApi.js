import { baseApi } from "@/utils/apiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: () => ({
                url: "/notification",
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),
        markAllRead: builder.mutation({
            query: () => ({
                url: "/notification/mark-as-read",
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/notification/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notification/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
        deleteAllNotifications: builder.mutation({
            query: () => ({
                url: "/notification",
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetAllNotificationsQuery,
    useMarkAllReadMutation,
    useMarkAsReadMutation,
    useDeleteNotificationMutation,
    useDeleteAllNotificationsMutation,
} = notificationApi;
