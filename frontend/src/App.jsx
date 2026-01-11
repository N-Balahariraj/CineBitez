import { useEffect } from "react";
import { store } from "./app/store";
import { notifyActions } from "./app/features/notificationSlice"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Root from "./Pages/Root";
import Error from "./Pages/Error";
import Splash, { loader as spotlightsLoader } from "./Pages/Splash";
import Movies, { action as adminMovieActions } from "./Pages/Movies";
import Theatres, { action as adminTheatreActions } from "./Pages/Theatres";
import About, { loader as aboutLoader, action as adminAboutActions} from "./Pages/About";
import Contact, { action as sendFeedback } from "./Pages/Contact";
import Profile, {
  action as updateProfileAction,
  removeAccountAction,
} from "./Pages/Profile";
import Settings from "./Components/Profile/Settings";
import Bookings, {
  loader as bookingsLoader,
} from "./Components/Profile/Bookings";
import Notifications from "./Components/Profile/Notifications";
import Authenticate, { action as authAction } from "./Pages/Authenticate";
import { checkAuthLoader, getAuthToken as tokenLoader } from "./utils/auth";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <Root />,
    HydrateFallback: () => <div>Loading...</div>,
    errorElement: <Error />,
    loader: tokenLoader,
    children: [
      {
        path: "",
        id: "home",
        element: <Outlet />,
        loader: homeLoader,
        children: [
          { index: true, element: <Splash /> },
          {
            path: "movies",
            element: <Movies />,
            action: adminMovieActions,
          },
          {
            path: "theatres",
            element: <Theatres />,
            action: adminTheatreActions,
          },
        ],
      },
      { path: "about", element: <About />, loader: aboutLoader, action: adminAboutActions },
      { path: "contact", element: <Contact />, action: sendFeedback },
      { path: "auth", element: <Authenticate />, action: authAction },
      {
        path: "profile",
        element: <Outlet />,
        id: "profile",
        loader: checkAuthLoader,
        action: removeAccountAction,
        children: [
          { index: true, element: <Profile />, action: updateProfileAction },
          { path: "notifications", element: <Notifications /> },
          { path: "settings", element: <Settings /> },
          { path: "bookings", element: <Bookings />, loader: bookingsLoader },
        ],
      },
    ],
  },
]);

export default function App() {
  useEffect(() => {
    (async ()=>{
      try{
        const username = JSON.parse(localStorage.getItem("user"))?.username;
        const res = await fetch(`http://localhost:5000/api/notifications/${username}`);
        if(!res.ok){
          throw new Error("Unable to fetch the notifications");
        }
        const {message, notifications} = await res.json();
        store.dispatch(notifyActions.setNotifications(notifications));
        // console.log("Getting the saved notifications:",notifications);
      }
      catch(e){
        console.log(e)
      }
    })();
    const handleUnload = async () => {
      const username = JSON.parse(localStorage.getItem("user"))?.username;
      const notifications = store.getState().notify.notifications;
      // console.log("Saving notifications !!!",notifications);
      try {
        const res = await fetch(
          `http://localhost:5000/api/notify/${username}`,
          {
            method: "PUT",
            keepalive: true,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ notifications }),
          }
        );
        console.log(res);
      } 
      catch (e) {
        console.log(e);
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);
  return <RouterProvider router={router} />;
}

async function homeLoader() {
  try {
    const results = await Promise.all([
      fetch("http://localhost:5000/api/movies"),
      fetch("http://localhost:5000/api/theatres"),
      fetch("http://localhost:5000/api/showSessions"),
    ]);

    let data = {};

    for (const result of results){
      if (!result.ok) {
        store.dispatch(
          notifyActions.openModel({
            head: "Error !",
            message: "Could not fetch 'home' details",
            type: "error",
          })
        );
        throw new Error("Could not fetch 'home' details");
      }
      else {
        const {message, ...rest} = await result.json();
        // console.log("message : ",message);
        data = {...data, ...rest};
      }
    }

    return data;
  } 
  catch (error) {
    console.log(error);
    store.dispatch(
      notifyActions.openModel({
        head: "Error !",
        message: error.message || "Could not fetch 'home' details",
        type: "error",
      })
    );
    return new Response(
      JSON.stringify({
        message: error.message || "Could not fetch 'home' details",
      }),
      { status: error.status || 500 }
    );
  }
}
