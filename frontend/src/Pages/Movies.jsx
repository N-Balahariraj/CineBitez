import React, { useState, useEffect } from "react";
import Movie from "../Components/Cards/Movie";
import Shimmer from "../Components/Shimmer";
import VideoPlayer from "../Components/VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import MovieForm from "../Components/Forms/MovieForm";
import { notifyActions } from "../app/features/notificationSlice";
import { useAddNewMovieMutation, useEditMovieMutation, useRemoveMovieMutation } from "../app/api/moviesApiSlice";

function Movies({ setSelectedMovie, filteredMovies }) {
  const role = useSelector((state) => state.auth.user?.role);
  const dispatch = useDispatch();
  const [addNewMovie, addNewMovieResponse] = useAddNewMovieMutation();
  const [editMovie, editMovieResponse] = useEditMovieMutation();
  const [removeMovie, removeMovieResponse] = useRemoveMovieMutation();

  const [player, setPlayer] = useState(1);
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    if (typeof setSelectedMovie === "function") {
      setSelectedMovie(player);
    }
  }, [player, setSelectedMovie]);

  async function handleFormSubmit(payload) {
    try {
      if (editingMovie) {
        const res = await editMovie({
          movieName: editingMovie.movie,
          movie: payload,
        }).unwrap();
        dispatch(
          notifyActions.openModel({
            head: "Updated",
            message: res?.message || "Movie updated",
            type: "success",
          })
        );
      } 
      else {
        const res = await addNewMovie(payload).unwrap();
        dispatch(
          notifyActions.openModel({
            head: "Added",
            message: res?.message || "Movie added",
            type: "success",
          })
        );
      }
    } 
    catch (err) {
      console.error("Movie save failed:", err);
      const msg =
        err?.data?.message || err?.error || err?.message || "Request failed";
      dispatch(
        notifyActions.openModel({ head: "Failed", message: msg, type: "error" })
      );
    } 
    finally {
      setIsMovieDialogOpen(false);
      setEditingMovie(null);
    }
  }

  async function handleDelete(e, movie) {
    e.stopPropagation();
     if (!window.confirm(`Delete movie "${movie.movie}"?`)) return;
    try {
        const res = await removeMovie(movie.movie).unwrap();
        setPlayer(1);
        dispatch(
          notifyActions.openModel({
            head: "Deleted",
            message: res?.message || "Movie removed",
            type: "success",
          })
        );
    } 
    catch (err) {
      console.error("Delete failed:", err);
      const msg =
        err?.data?.message || err?.error || err?.message || "Request failed";
      dispatch(
        notifyActions.openModel({ head: "Failed", message: msg, type: "error" })
      );
    }
  }

  return (
    <>
      <div className="movies">
        <VideoPlayer player={player} setSelectedMovie={setSelectedMovie} />
        <div className="flex flex-wrap justify-center gap-2">
          {filteredMovies?.map((movie) => {
            return (
              <Movie
                key={movie.id}
                id={movie.id}
                MovieDetails={movie}
                setPlayer={setPlayer}
                onEdit={(e) => {
                  e.stopPropagation();
                  setEditingMovie(movie);
                  setIsMovieDialogOpen(true);
                }}
                onDelete={(e) => handleDelete(e, movie)}
              />
            );
          }) ?? <Shimmer />}
        </div>
        {role === "admin" && (
          <>
            <button
              className="movies__add-icon"
              onClick={() => {
                setEditingMovie(null);
                setIsMovieDialogOpen(true);
              }}
            >
              +
            </button>

            <MovieForm
              isOpen={isMovieDialogOpen}
              initialData={editingMovie}
              onClose={() => {
                setIsMovieDialogOpen(false);
                setEditingMovie(null);
              }}
              onSubmit={handleFormSubmit}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Movies;
