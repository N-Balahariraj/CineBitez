import React from "react";
import { RiMovieLine } from "react-icons/ri";
import { IoStarSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Movie(props) {
  const { movie, rating, imageUrl, theme, Votes } = props.MovieDetails;
  return (
    <div className="movie">
      <div className="h-[65%] w-[100%] rounded-lg">
        <img
          src={imageUrl}
          className="h-[100%] w-[100%] rounded-lg"
          alt="..."
        />
      </div>
      <div className="h-[35%] w-[100%] flex flex-col justify-around px-2 text-sm">
        <span className="whitespace-nowrap text-lg font-medium w-[100%] overflow-x-auto scrollbar-hide">
          {movie}
        </span>
        <span>{theme.map((T)=>{
          if(theme[theme.length-1] === T)
            return T;
          return T+" | ";
        })}</span>
        <div className="flex justify-between text-[orange]">
          <span>
            {Votes} Votes
          </span>
          <span className="flex jusify-between items-center">
            {rating}/10 <IoStarSharp />
          </span>
        </div>
        <div className="flex justify-between">
          <Link
            onClick={()=>{props.setPlayer(props.id)}}
            className="flex justify-center items-center h-7 w-[100%] rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700"
          >
            Watch Trailer <RiMovieLine className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
