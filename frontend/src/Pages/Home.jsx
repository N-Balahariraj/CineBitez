import React, { useState } from "react";
import Splash from "./Splash";
import Movies from "./Movies";
import Theatres from "./Theatres";

export default function Home({ currentScreen, filteredTheatres, filteredMovies, filteredSpotlights }) {
  const [selectedMovie, setSelectedMovie] = useState(1);

  if (currentScreen == "movies") {
    return <Movies setSelectedMovie={setSelectedMovie} filteredMovies={filteredMovies}/>;
  } 
  else if (currentScreen == "theatres") {
    return <Theatres selectedMovie={selectedMovie} filteredTheatres={filteredTheatres}/>;
  }
  return (
    <Splash setMovie={setSelectedMovie} filteredSpotlights={filteredSpotlights}/>
  );
}
