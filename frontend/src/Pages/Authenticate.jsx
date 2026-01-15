import { useState } from "react";
import { notifyActions } from "../app/features/notificationSlice";
import { store } from "../app/store";
import { redirect, useNavigation } from "react-router-dom";
import Forms from "../Components/UI/Forms/Forms";

export default function Authenticate() {
  const navigation = useNavigation();

  const isAuthenticating = navigation.state !== "idle";

  const [selectedRole, setSelectedRole] = useState("user");

  return (
    <Forms method="post" className="authenticate scrollbar-hide">
      <h1 className="authenticate__title">
        Welcome to CineBitez
      </h1>
      <Forms.Fieldset className="authenticate__content">
        <Forms.Input
          label={"User"}
          labelClassName={`px-4 py-1.5 rounded-md cursor-pointer text-lg font-semibold transition-colors
            ${
              selectedRole === "user"
                ? "bg-gradient-to-r from-[#9333ea] via-[#4f46e5] to-[#1d4ed8] text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
          type="radio"
          name="role"
          value="user"
          className="sr-only"
          checked={selectedRole === "user"}
          onChange={(e) => setSelectedRole(e.target.value)}
        />

        <Forms.Input
          label={"Operator"}
          labelClassName={`px-4 py-1.5 rounded-md cursor-pointer text-lg font-semibold transition-colors
            ${
              selectedRole === "operator"
                ? "bg-gradient-to-r from-[#9333ea] via-[#4f46e5] to-[#1d4ed8] text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
          type="radio"
          name="role"
          value="operator"
          className="sr-only"
          checked={selectedRole === "operator"}
          onChange={(e) => setSelectedRole(e.target.value)}
        />

        <Forms.Input
          label={"Admin"}
          labelClassName={`px-4 py-1.5 rounded-md cursor-pointer text-lg font-semibold transition-colors
            ${
              selectedRole === "admin"
                ? "bg-gradient-to-r from-[#9333ea] via-[#4f46e5] to-[#1d4ed8] text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
          type="radio"
          name="role"
          value="admin"
          className="sr-only"
          checked={selectedRole === "admin"}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
      </Forms.Fieldset>
      <Forms.Fieldset className={"authenticate__form"}>
        <Forms.Input
          label={"Full Name :"}
          type="text"
          name="username"
          className="authenticate__form-input"
        />
        <Forms.Input
          label="Email :"
          type="email"
          name="email"
          className="authenticate__form-input"
        />
        <Forms.Input
          label="Password :"
          type="password"
          name="password"
          className="authenticate__form-input"
        />
        <Forms.Button
          type="submit"
          className="authenticate__form-input authenticate__btn-submit"
          disabled={isAuthenticating}
        >
          {isAuthenticating ? "Please wait..." : "Authenticate"}
        </Forms.Button>
      </Forms.Fieldset>
    </Forms>
  );
}

export async function action({ request, params }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  try {
    const fd = await request.formData();

    const userData = {
      username: fd.get("username"),
      email: fd.get("email"),
      password: fd.get("password"),
      role: fd.get("role") || "user",
    };

    const res = await fetch(`${apiUrl}/authenticate`, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // console.log("res :", res);

    if (!res.ok) {
      throw new Error(`${res.status} : ${res.statusText}`);
    }

    const { message, user } = await res.json();

    localStorage.setItem("user", JSON.stringify(user));

    store.dispatch(
      notifyActions.setNotifications(
        user.notifications
      )
    )

    store.dispatch(
      notifyActions.openModel({
        head: "Authenticated !",
        message: message || "User authenticated successfully",
        type: "success",
      })
    );

    return redirect("/profile");
  } 
  catch (error) {
    store.dispatch(
      notifyActions.openModel({
        head: "Authentication Error",
        message: error.message || "Unable to authenticate user",
        type: "error",
      })
    );
    console.log("error", error);
  }
}
