import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./Components/Error";
import CineBites from "./Components/CineBites";
import Profile from "./Components/Profile";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path:"/",
        element:<CineBites/>,
      },
      {
        path: "/Account|Settings",
        element: <Profile/>
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={AppRouter}></RouterProvider>);
