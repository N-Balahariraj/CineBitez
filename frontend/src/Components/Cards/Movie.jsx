import React from "react";
import { RiMovieLine } from "react-icons/ri";
import { IoStarSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Movie(props) {
  const role = useSelector((state) => state.auth.user?.role);
  const { movie, rating, imageUrl, genres, votes } = props.MovieDetails;
  return (
    <div className="movie">
      {role === "admin" && (
        <div className="movie__edit-icons">
          <span
            className="movie__edit-icon"
            onClick={(e) => {
              e.stopPropagation();
              if (props.onEdit) props.onEdit(e);
            }}
          >
            <MdOutlineModeEdit className="mx-auto" />
          </span>
          <span
            className="movie__edit-icon"
            onClick={(e) => {
              e.stopPropagation();
              if (props.onDelete) props.onDelete(e);
            }}
          >
            <RiDeleteBin6Line className="mx-auto" />
          </span>
        </div>
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
          <span>{votes} Votes</span>
          <span className="flex jusify-between items-center">
            {rating}/10 <IoStarSharp />
          </span>
        </div>
        <div className="flex justify-between">
          <Link
            onClick={() => {
              props.setPlayer(props.id);
            }}
            className="flex justify-center items-center h-7 w-[100%] rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700"
          >
            Watch Trailer <RiMovieLine className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
