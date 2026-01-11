import React from "react";
import { FaStar } from "react-icons/fa6";
import { useLocation, useNavigate } from 'react-router-dom';

export default function MovieDetails({ selectedMovie }) {
  const location = useLocation();
  const navigate = useNavigate();
  if (!selectedMovie) {
    return (
      <div className="fallback">
        <span>Selected movie is diplayed here</span>
      </div>
    );
  }
  const { movie, genres, languages, votes, rating, price } = selectedMovie;

  return (
    <div className="movie__selection-info">
      <span className="my-2 text-center text-2xl font-semibold overflow-scroll scrollbar-hide">
        {movie}
      </span>
      <span>
        {genres?.map((genre) => {
          if (genres?.at(-1) === genre) return genre;
          return genre + " | ";
        })}
      </span>
      <span>
        {languages?.map((language) => {
          if (languages?.at(-1) === language) return language;
          return language + " | ";
        })}
      </span>
      <div className="flex justify-between text-[orange]">
        <span>{`${votes} Votes`}</span>
        <span>
          {`${rating}/10`} <FaStar className="inline-block" />
        </span>
      </div>
      <span>₹ {price}</span>
      <button
        className={`h-[35px] mb-1 rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 ${location.pathname.includes("theatres")?"hidden":""}`}
        onClick={()=>navigate('/theatres')}
      >
        Book Now
      </button>
    </div>
  );
}
