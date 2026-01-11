import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiMovieLine } from "react-icons/ri";
import { BsBookmarkPlus } from "react-icons/bs";
import { IoStarSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { selectionActions } from "../../app/features/selectionsSlice";

export default function Spotlight({spotlight, setMovie}) {
  // const { movie, rating, imageUrl, imdb_url  } = MovieDetails
  // console.log("Spotllight : ",MovieDetails)
  const { id, languages, imageUrl, movie, genres, rating, votes } = spotlight;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    // <>
    <div className={`spotlight`}>
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
          {genres?.map((genre) => {
            if (genres.at(-1) === genre) return genre;
            return genre + " | ";
          })}
        </span>
        <span>
          {languages?.map((language) => {
            if (languages.at(-1) === language) return language;
            return language + " | ";
          })}
        </span>
        <div>
          <div className="w-[100%] h-[4px] bg-[#106097] mb-2">
            <div className="w-[60%] h-[4px] bg-[#07a0fc]"></div>
          </div>
          <div className="flex justify-between text-[orange]">
            <span>Votes {votes}</span>
            <span className="flex flex-rowjusify-between items-center">
              {rating} <IoStarSharp />
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={(e) => {
              setMovie(spotlight);
            }}
            className="flex justify-around items-center h-7 w-20 text-white rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 outline-none hover:brightness-90"
          >
            Trailer <RiMovieLine />
          </button>
          <button
            className="flex justify-around items-center h-7 w-20 text-white rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 outline-none hover:brightness-90"
            onClick={() => {
              dispatch(selectionActions.setSelectedMovie(spotlight));
              navigate('/theatres')
            }}
          >
            Book <BsBookmarkPlus />
          </button>
        </div>
      </div>
    </div>
    // </>
  );
}
