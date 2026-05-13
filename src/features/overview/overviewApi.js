import { baseApi } from "../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAnalytics: builder.query({
            query: ({ year }) => ({
                url: `/admin-stats/overview?year=${year}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetAllAnalyticsQuery,
} = overviewApi;
