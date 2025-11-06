import { apiSlice } from './apiSlice';

export const moviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. getAllMovies
    getMovies: builder.query({
      query: () => 'movies', 
      providesTags: ['Movie'],
    }),

    // 2. addNewMovie
    addNewMovie: builder.mutation({
      query: (movies) => ({
        url: 'new-movies',
        method: 'POST',
        body: movies, 
      }),
      invalidatesTags: ['Movie'],
    }),

    // 3. editMovie
    editMovie: builder.mutation({
      query: ({ theatreName, ...movie }) => ({
        url: `edit-movie/${theatreName}`,
        method: 'PUT',
        body: movie,
      }),
      invalidatesTags: ['Movie'],
    }),

    // 4. removeMovie
    removeMovie: builder.mutation({
      query: (name) => ({
        url: `remove-movie/${name}`,
        method: 'DELETE', 
      }),
      invalidatesTags: ['Movie'],
    }),

  }),
});

export const {
  useGetMoviesQuery,
  useAddNewMovieMutation,
  useEditMovieMutation,
  useRemoveMovieMutation,
} = moviesApiSlice;