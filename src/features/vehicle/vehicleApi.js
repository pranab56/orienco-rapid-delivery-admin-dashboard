import { baseApi } from "../../utils/apiBaseQuery";


export const vehicleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createVehicle: builder.mutation({
            query: (data) => ({
                url: `/vehicle`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["vehicle"],
        }),

        updateVehicle: builder.mutation({
            query: ({ id, data }) => ({
                url: `/vehicle/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["vehicle"],
        }),


        getAllVehicle: builder.query({
            query: ({ page }) => ({
                url: `/vehicle?page=${page}`,
                method: "GET",
            }),
            providesTags: ["vehicle"],
        }),

        deleteVehicle: builder.mutation({
            query: ({ id }) => ({
                url: `/vehicle/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["vehicle"],
        }),


        assignVehicleToDriver: builder.mutation({
            query: (data) => ({
                url: `/vehicle/assign-driver`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["vehicle"],
        }),


        removeDriver: builder.mutation({
            query: (data) => ({
                url: `/vehicle/remove-driver`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["vehicle"],
        }),
    }),
});

export const {
    useCreateVehicleMutation,
    useUpdateVehicleMutation,
    useGetAllVehicleQuery,
    useDeleteVehicleMutation,
    useAssignVehicleToDriverMutation,
    useRemoveDriverMutation,
} = vehicleApi;
