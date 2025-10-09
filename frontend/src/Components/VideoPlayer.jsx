import React from "react";
import ReactPlayer from "react-player";
import { Movie_Data } from "../Data/Movie_Data";
import { IoStarSharp } from "react-icons/io5";

export default function VideoPlayer(props) {
  const Data = Movie_Data[props.player - 1];

  return (
    <div className="movie-player">
      <div className="player">
        <ReactPlayer
          url={Data?.trailers[0]}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
      <div className="details">
        <span className=" text-center text-2xl font-semibold border-y-[1px] py-1 whitespace-nowrap">
          {Data.movie}
        </span>
        <span>
          {Data.theme.map((T) => {
            if (Data.theme[Data.theme.length - 1] === T) return T;
            return T + " | ";
          })}
        </span>
        <span>
          {Data.languages.map((T) => {
            if (Data.languages[Data.languages.length - 1] === T) return T;
            return T + " | ";
          })}
        </span>
        <div className="flex justify-between text-[orange]">
          <span>{Data.Votes} Votes</span>
          <span className="flex flex-row jusify-between items-center">
            {Data.rating}/10 <IoStarSharp />
          </span>
        </div>
        <span>₹ {Data.price}</span>
        <button
          className="h-[35px] mb-1 rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700"
          onClick={() => {
            props.setSelectedMovie(1);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
