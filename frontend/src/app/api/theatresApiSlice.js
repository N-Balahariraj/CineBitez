const { apiSlice } = require("./apiSlice");

const theatresApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //1. getAllTheatres
    getTheatres: builder.query({
      query: () => "/theatres",
      providesTags: ["Theatre"],
    }),

    //2. addNewTheatre
    addNewTheatre: builder.mutation({
      query: (theatre) => ({
        url: "/new-theatres",
        method: "POST",
        body: theatre,
      }),
      invalidatesTags: ["Theatre"],
    }),

    //3. editTheatre
    editTheatre: builder.mutation({
      query: ({ theatreName, theatre }) => ({
        url: `/edit-theatre/${encodeURIComponent(theatreName)}`,
        method: "PUT",
        body: theatre,
      }),
      invalidatesTags: ["Theatre"],
    }),

    //4. removeTheatre
    removeTheatre: builder.mutation({
      query: (theatreName) => ({
        url: `/remove-theatre/${encodeURIComponent(theatreName)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Theatre"],
    }),

    //5. crudOnShows
    crudOnShows: builder.mutation({
      query: ({ theatreName, shows }) => ({
        url: `/shows/${theatreName}`,
        method: "PUT",
        body: shows,
      }),
      invalidatesTags: ["Theatre"],
    }),
  }),
});

export const {
  useGetTheatresQuery,
  useAddNewTheatreMutation,
  useEditTheatreMutation,
  useRemoveTheatreMutation,
  useCrudOnShowsMutation,
} = theatresApiSlice;
