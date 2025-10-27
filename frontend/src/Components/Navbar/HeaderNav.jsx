import React from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { LuPopcorn } from "react-icons/lu";
import { Gi3DGlasses } from "react-icons/gi";
import { MdOutlineVideocam } from "react-icons/md";

import MovieFilters from "../Filters/MovieFilters";
import TheatreFilters from "../Filters/TheatreFilters";
import SplashFilters from "../Filters/SplashFilters";
import MobileFilters from "../Filters/MobileFilters";
import { useEffect } from "react";
import { getAllTheatres } from "../../Apis/theatreApis";

// import Account from "./Account";

export default function HeaderNav({
  currentScreen,
  setCurrentScreen,
  setFilteredTheatres,
  setFilteredMovies,
  setFilteredSpotlights,
}) {
  const location = useLocation();
  const isMobile = useMediaQuery({ query: "(max-width: 40rem)" });
  useEffect(()=>{
    getAllTheatres();
  },[])
  return (
    <div className={`header-nav ${location.pathname !== "/" && "hidden"}`}>
      <div className="header-nav__item">
        <MdOutlineVideocam
          className="header-nav__item-logo"
          onClick={(e) => {
            e.preventDefault();
            setCurrentScreen("splash");
          }}
        />
        {isMobile && currentScreen === "splash" ? (
          <MobileFilters
            currentScreen={currentScreen}
            setFilteredSpotlights={setFilteredSpotlights}
          />
        ) : (
          <SplashFilters
            currentScreen={currentScreen}
            setFilteredSpotlights={setFilteredSpotlights}
          />
        )}
      </div>
      <div className="header-nav__item">
        <Gi3DGlasses
          className="header-nav__item-logo"
          onClick={(e) => {
            e.preventDefault();
            setCurrentScreen("movies");
          }}
        />
        {isMobile && currentScreen === "movies" ? (
          <MobileFilters
            currentScreen={currentScreen}
            setFilteredMovies={setFilteredMovies}
          />
        ) : (
          <MovieFilters
            currentScreen={currentScreen}
            setFilteredMovies={setFilteredMovies}
          />
        )}
      </div>
      <div className="header-nav__item">
        <LuPopcorn
          className="header-nav__item-logo"
          onClick={(e) => {
            e.preventDefault();
            setCurrentScreen("theatres");
          }}
        />
        {isMobile && currentScreen === "theatres" ? (
          <MobileFilters
            currentScreen={currentScreen}
            setFilteredTheatres={setFilteredTheatres}
          />
        ) : (
          <TheatreFilters
            currentScreen={currentScreen}
            setFilteredTheatres={setFilteredTheatres}
          />
        )}
      </div>
    </div>
  );
}
