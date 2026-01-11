import React from "react";
import { RiMovieLine } from "react-icons/ri";
import { IoStarSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { Link, useRouteLoaderData } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectionActions } from "../../app/features/selectionsSlice";
import Forms from "../UI/Forms/Forms";

export default function Movie(props) {
  const role = useRouteLoaderData("root").role;
  const { movie, rating, imageUrl, genres, votes } = props.movie;
  const dispatch = useDispatch();
  return (
    <div className="movie-cards">
      {role === "admin" && (
        <Forms method={"post"} className="movie-cards__edit-icons">
          <Forms.Input type="hidden" name="movieName" value={movie} />
          <Forms.Button
            type="button"
            onClick={props.onEdit}
            className="movie-cards__edit-icon"
          >
            <MdOutlineModeEdit className="mx-auto" />
          </Forms.Button>
          <Forms.Button
            type="submit"
            name="intent"
            value="delete"
            className="movie-cards__edit-icon"
          >
            <RiDeleteBin6Line className="mx-auto" />
          </Forms.Button>
        </Forms>
      )}
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
        <span>
          {genres?.map((genre) => {
            if (genres.at(-1) === genre) return genre;
            return genre + " | ";
          })}
        </span>
        <div className="flex justify-between text-[orange]">
          <span>{`${votes} Votes`}</span>
          <span className="flex jusify-between items-center">
            {`${rating}/10`} <IoStarSharp />
          </span>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => {
              // console.log("movie selected ...");
              dispatch(selectionActions.setSelectedMovie(props.movie));
            }}
            className="flex justify-center items-center h-7 w-[100%] rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700"
          >
            Watch Trailer <RiMovieLine className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
