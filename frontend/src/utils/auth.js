import { redirect } from "react-router-dom";

export function getAuthToken() {
  const token = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return null;
  }

  return token;
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth");
  }

  return token;
}
