import React from "react";
import { Movie_Data } from "../Common/Movie_Data";
import StreamCards from "./StreamCards";
import { BiSolidDownArrow } from "react-icons/bi";

export default function Streaming({chooseTrailer,ShowsToTheatres,Scroll,FromShows}) {

  return (
    <>
      <div className="flex justify-between items-center my-3">
        <span className="text-2xl text-white font-semibold font-sherif">
          Streaming
        </span>
        <button
          onClick={() => {Scroll()}}
          className="flex items-center w-20 text-sm text-[lightgrey] hover:text-[#00a7fc]"
        >
          View all <BiSolidDownArrow className="pl-2 text-xl"/>
        </button>
      </div>
      <div className="StreamBox ml-2">
        {Movie_Data.map((Movies) => {
          return <StreamCards key={Movies.id} id={Movies.id} MovieDetails={Movies} Trailer={chooseTrailer} StreamingToTheatresViaShows = {ShowsToTheatres} FromStreaming={FromShows}/>;
        })}
      </div>
    </>
  );
}
