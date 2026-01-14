import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

import Spotlight from "../Components/Splash/Spotlight";

import SplashForm from "../Components/Splash/SplashForm";
import MoviePreview from "../Components/Movies/MoviePreview";
import AdminDashboard from "../Components/Splash/AdminDashboard";

export default function Splash() {
  const user = useRouteLoaderData("root");
  const role = user?.role || "user";
  const { movies } = useRouteLoaderData("home");
  const [movie, setMovie] = useState(movies?.[0]);
  return (
    role === "user" ?
     (
      <section className="splash scrollbar-hide">
        <h2 className="discover-title">Discover</h2>
        <section className="discover">
          <MoviePreview
            selectedMovie={movie}
            className="discover__player"
            playerClassName="min-w-[15rem]"
          />
          <SplashForm />
        </section>
        <h2 className="spotlights-title">SpotLights</h2>
        <section className="spotlights scrollbar-hide">
          {movies?.map((spotlight) => {
            return (
              <Spotlight
                key={spotlight._id}
                spotlight={spotlight}
                setMovie={setMovie}
              />
            );
          })}
        </section>
      </section>
    )
    : (
      <AdminDashboard/>
    )
  );
}
