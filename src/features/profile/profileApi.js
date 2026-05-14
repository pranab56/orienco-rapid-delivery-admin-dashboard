import { baseApi } from "../../utils/apiBaseQuery";


export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => ({
                url: `/user/me`,
                method: "GET",
            }),
            providesTags: ["profile"]
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: `/user/profile`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["profile"]
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: `/auth/change-password`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: data,
            }),
            invalidatesTags: ["profile"]
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = profileApi;
