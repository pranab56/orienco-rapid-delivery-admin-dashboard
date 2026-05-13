import { baseApi } from "../../utils/apiBaseQuery";


export const parcelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllParcels: builder.query({
            query: ({ page}) => ({
                url: `/parcel?page=${page}`,
                method: "GET",
            }),
            providesTags: ["Parcel"]
        }),
        getParcelById: builder.query({
            query: (id) => ({
                url: `/parcel/${id}`,
                method: "GET",
            }),
            providesTags: ["Parcel"]
        }),
    }),
});

export const {
    useGetAllParcelsQuery,
    useGetParcelByIdQuery,
} = parcelApi;
