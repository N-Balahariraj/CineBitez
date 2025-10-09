import React, { useState, forwardRef } from "react";
import Movie from "../Components/Cards/Movie";
import Shimmer from "../Components/Shimmer";
import VideoPlayer from "../Components/VideoPlayer";

function Movies({ setSelectedMovie, filteredMovies }) {
  const [player, setPlayer] = useState(1);
  setSelectedMovie(player);

  return (
    <>
      <div className="movies">
        <VideoPlayer player={player} setSelectedMovie={setSelectedMovie} />
        <div className="flex flex-wrap justify-center gap-2">
          {filteredMovies.length === 0 ? (
            <Shimmer />
          ) : (
            filteredMovies.map((movie) => {
              return (
                <Movie
                  key={movie.id}
                  id={movie.id}
                  MovieDetails={movie}
                  setPlayer={setPlayer}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default forwardRef(Movies);
