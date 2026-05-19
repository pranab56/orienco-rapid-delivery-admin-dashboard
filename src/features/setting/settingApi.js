import { baseApi } from "../../utils/apiBaseQuery";


export const settingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSetting: builder.query({
            query: () => ({
                url: `/settings`,
                method: "GET",
            }),
            providesTags: ["setting"]
        }),

        updateSetting: builder.mutation({
            query: (data) => ({
                url: `/settings`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["setting"]
        }),
    }),
});

export const {
    useGetSettingQuery,
    useUpdateSettingMutation,
} = settingApi;
