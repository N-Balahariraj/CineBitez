import { API } from "./createApiCall";

export const authenticate = (user) => API("authenticate" ,"POST" ,user);
export const editProfile = (user,name) => API(`edit-account/${name}`, "PUT", user);
export const removeAccount = (name) => API(`remove-account/${name}`, "DELETE");