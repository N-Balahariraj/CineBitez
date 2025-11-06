import { useState } from "react";
import { useAuthenticateMutation } from "../app/api/usersApiSlice";
import { useDispatch } from "react-redux";
import { authActions } from "../app/features/authSlice";
import Notification from "../Components/Notification";

export default function Authenticate() {
  const [authenticate, { isLoading, isError, error, data }] =
    useAuthenticateMutation();
  const dispatch = useDispatch();

  const [selectedRole, setSelectedRole] = useState("user");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role") || "user";
    try {
      const userData = await authenticate({
        username,
        email,
        password,
        role,
      }).unwrap();
      // console.log("Authenticate : ", userData)
      dispatch(authActions.login(userData));
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Auth error:", err);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="authenticate">
      <h1 className=" col-span-2 place-self-center font-bold text-[1.5rem]">
        Welcome to CineBitez
      </h1>
      {isError && (
        <Notification
          head={"Authentication failed"}
          message={error?.data?.message || error?.message}
          type={"error"}
        />
      )}
      <div className="col-span-2 place-self-center flex gap-2 items-center bg-gray-800/50 rounded-lg p-1 mb-2">
        <input
          type="radio"
          name="role"
          id="role-user"
          value="user"
          className="sr-only"
          checked={selectedRole === "user"}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
        <label
          htmlFor="role-user"
          className={`px-4 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors
            ${
              selectedRole === "user"
                ? "bg-gradient-to-r from-[#9333ea] via-[#4f46e5] to-[#1d4ed8] text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
        >
          User
        </label>

        <input
          type="radio"
          name="role"
          id="role-operator"
          value="operator"
          className="sr-only"
          checked={selectedRole === "operator"}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
        <label
          htmlFor="role-operator"
          className={`px-4 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors
            ${
              selectedRole === "operator"
                ? "bg-gradient-to-r from-[#9333ea] via-[#4f46e5] to-[#1d4ed8] text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
        >
          Operator
        </label>

        <input
          type="radio"
          name="role"
          id="role-admin"
          value="admin"
          className="sr-only"
          checked={selectedRole === "admin"}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
        <label
          htmlFor="role-admin"
          className={`px-4 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors
            ${
              selectedRole === "admin"
                ? "bg-gradient-to-r from-[#9333ea] via-[#4f46e5] to-[#1d4ed8] text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
        >
          Admin
        </label>
      </div>
      <label htmlFor="username">Full Name :</label>
      <input
        type="text"
        name="username"
        className=" w-[100%] h-[30px] m-2 rounded-md outline-none text-black px-2"
      />
      <label htmlFor="email">Email :</label>
      <input
        type="email"
        name="email"
        className=" w-[100%] h-[30px] m-2 rounded-md outline-none text-black px-2"
      />
      <label htmlFor="password">Password :</label>
      <input
        type="password"
        name="password"
        className=" w-[100%] h-[30px] m-2 rounded-md outline-none text-black px-2"
      />
      <button
        type="submit"
        className="authenticate__btn-submit"
        disabled={isLoading}
      >
        {isLoading ? "Please wait..." : "Authenticate"}
      </button>
    </form>
  );
}
