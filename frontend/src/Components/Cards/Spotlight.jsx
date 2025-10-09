import React from "react";
import { Link } from "react-router-dom";
import { RiMovieLine } from "react-icons/ri";
import { BsBookmarkPlus } from "react-icons/bs";
import { IoStarSharp } from "react-icons/io5";

export default function Spotlight(props) {
  // const { movie, rating, imageUrl, imdb_url  } = props.MovieDetails
  const { imageUrl, movie, theme, rating, Votes } = props.MovieDetails;

  return (
    // <>
    <div className={`spotlight ${props.tailwind}`}>
      <div className="h-[100%] w-[45%] rounded-lg">
        <img
          src={imageUrl}
          className="h-[100%] w-[100%] rounded-lg"
          alt="..."
        />
      </div>
      <div className="h-[100%] w-[55%] flex flex-col justify-around box-border p-2 text-[lightgrey] text-sm">
        <div className="flex justify-between items-center">
          <span className="whitespace-nowrap text-white text-lg font-medium w-[100%] overflow-x-auto scrollbar-hide">
            {movie}
          </span>
        </div>
        <span>
          {theme.map((T) => {
            if (theme[theme.length - 1] === T) return T;
            return T + " | ";
          })}
        </span>
        <div>
          <div className="w-[100%] h-[4px] bg-[#106097] mb-2">
            <div className="w-[60%] h-[4px] bg-[#07a0fc]"></div>
          </div>
          <div className="flex justify-between text-[orange]">
            <span>Votes {Votes}</span>
            <span className="flex flex-rowjusify-between items-center">
              {rating} <IoStarSharp />
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={(e) => {
              props.setTrailer(props.id);
            }}
            className="flex justify-around items-center h-7 w-20 text-white rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 outline-none hover:brightness-90"
          >
            Trailer <RiMovieLine />
          </button>
          <Link
            className="flex justify-around items-center h-7 w-20 text-white rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 outline-none hover:brightness-90"
            onClick={() => {
              props.setMovie(props.id);
            }}
          >
            Book <BsBookmarkPlus />
          </Link>
        </div>
      </div>
    </div>
    // </>
  );
}
