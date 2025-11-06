const { apiSlice } = require("./apiSlice");

const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //1. authenticate
    authenticate: builder.mutation({
      query: (user) => ({
        url: "/authenticate",
        method: "POST",
        body: user,
      }),
      providesTags: (result) =>
        result && result.username
          ? [{ type: "User", id: result.username }]
          : [{ type: "User", id: "CURRENT" }],
    }),
    //2. editProfile
    editProfile: builder.mutation({
      query: ({ username, user }) => ({
        url: `/edit-account/${username}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),

    //3. removeAccount
    removeAccount: builder.mutation({
      query: (username) => ({
        url: `/remove-account/${username}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useAuthenticateMutation,
  useEditProfileMutation,
  useRemoveAccountMutation,
} = usersApiSlice;
