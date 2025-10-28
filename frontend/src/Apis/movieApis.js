import { API } from "./createApiCall";

export const getAllMovies = () => API("movies");
export const addNewMovie = (movie) => API("new-movie", "POST", movie);
export const addNewMovies = (movieList) => API("new-movies", "POST", movieList);
export const editMovie = (movie, name) => API(`edit-movie/${name}`, "PUT", movie);
export const removeMovie = (name) => API(`remove-movie/${name}`, "DELETE");
