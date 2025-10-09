import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import SplashFilters from "./SplashFilters";
import MovieFilters from "./MovieFilters";
import TheatreFilters from "./TheatreFilters";
import { useState } from "react";

export default function MobileFilters({
  currentScreen,
  setFilteredTheatres,
  setFilteredMovies,
  setFilteredSpotlights,
}) {
  const [visibility, setVisibility] = useState("");
  return (
    <>
      <div
        className="filter-btn"
        onClick={() => {
          setVisibility("visible");
        }}
      >
        <span>Filters</span>
        <HiMiniAdjustmentsHorizontal />
      </div>
      <div
        className={`filter-overlay ${visibility}`}
        onClick={(e) => {
          e.target === e.currentTarget && setVisibility("");
        }}
      >
        <div className="filter-content">
          {currentScreen === "splash" && (
            <SplashFilters currentScreen={currentScreen} setFilteredSpotlights={setFilteredSpotlights} />
          )}
          {currentScreen === "movies" && (
            <MovieFilters currentScreen={currentScreen} setFilteredMovies={setFilteredMovies} />
          )}
          {currentScreen === "theatres" && (
            <TheatreFilters currentScreen={currentScreen} setFilteredTheatres={setFilteredTheatres} />
          )}
        </div>
      </div>
    </>
  );
}
