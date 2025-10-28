import { API } from "./createApiCall";

// Operation on theatres
export const getAllTheatres = () => API("theatres");
export const addNewTheatre = (theatre) => API("new-theatre", "POST", theatre);
export const editTheatre = (theatre, name) => API(`edit-theatre/${name}`, "PUT", theatre);
export const removeTheatre = (name) => API(`remove-theatre/${name}`, "DELETE");

//Operation on shows
export const shows = (showList, name) => API(`shows/${name}`, "PUT", showList);
