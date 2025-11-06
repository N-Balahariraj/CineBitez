import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const prepareHeaders = (headers, { getState }) => {
  headers.set("Content-Type", "application/json");

  // const token = (getState()).auth.token;
  // if (token) {
  //   headers.set('Authorization', `Bearer ${token}`);
  // }

  return headers;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Movie", "Theatre", "User"],
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
  endpoints: (builder) => ({}),
});
