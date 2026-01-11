import React, { useState, useEffect } from "react";
import Movie from "../Components/Movies/Movie";
import Shimmer from "../Components/UI/Feedbacks/Shimmer";
import MoviePreview from "../Components/Movies/MoviePreview";
import { useDispatch, useSelector } from "react-redux";
import MovieForm from "../Components/Movies/MovieForm";
import { notifyActions } from "../app/features/notificationSlice";
import {
  useAddNewMovieMutation,
  useEditMovieMutation,
  useRemoveMovieMutation,
} from "../app/api/moviesApiSlice";
import MovieFilters from "../Components/Movies/MovieFilters";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import { store } from "../app/store";
import MovieDetails from "../Components/Movies/MovieDetails";
import TheatreDetails from "../Components/Theatres/TheatreDetails";
import { useMediaQuery } from "react-responsive";
import { selectionActions } from "../app/features/selectionsSlice";

export default function Movies() {
  const role = useRouteLoaderData("root").role;
  const { message, movies } = useLoaderData();
  const selectedTheatre = useSelector((state) => state.selection.selectedTheatre);
  const selectedMovie = useSelector(state => state.selection.selectedMovie);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(selectionActions.setSelectedMovie(movies?.[0]))
  },[])
  const [addNewMovie, addNewMovieResponse] = useAddNewMovieMutation();
  const [editMovie, editMovieResponse] = useEditMovieMutation();
  const [removeMovie, removeMovieResponse] = useRemoveMovieMutation();

  const [filteredMovies, setFilteredMovies] = useState(movies || []);
  // const [selectedMovie, setSelectedMovie] = useState(movies?.[0]);
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const isTablet = useMediaQuery({
    query: '(min-width: 40rem) and (max-width: 63.9rem)'
  })

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
      } else {
        const res = await addNewMovie(payload).unwrap();
        dispatch(
          notifyActions.openModel({
            head: "Added",
            message: res?.message || "Movie added",
            type: "success",
          })
        );
      }
    } catch (err) {
      console.error("Movie save failed:", err);
      const msg =
        err?.data?.message || err?.error || err?.message || "Request failed";
      dispatch(
        notifyActions.openModel({ head: "Failed", message: msg, type: "error" })
      );
    } finally {
      setIsMovieDialogOpen(false);
      setEditingMovie(null);
    }
  }

  async function handleDelete(e, movie) {
    e.stopPropagation();
    if (!window.confirm(`Delete movie "${movie.movie}"?`)) return;
    try {
      const res = await removeMovie(movie.movie).unwrap();
      dispatch(
        notifyActions.openModel({
          head: "Deleted",
          message: res?.message || "Movie removed",
          type: "success",
        })
      );
    } catch (err) {
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
      <section className="movies scrollbar-hide">
        <MovieFilters />
        <MoviePreview selectedMovie={selectedMovie} className={"player"} />
        <MovieDetails selectedMovie={selectedMovie} />
        {!isTablet && <TheatreDetails selectedTheatre={selectedTheatre} />}
        <div className="movie">
          {filteredMovies?.map((movie) => {
            return (
              <Movie
                key={movie.id}
                movie={movie}
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
      </section>
    </>
  );
}

export async function loader() {
  try {
    const res = await fetch("http://localhost:5000/api/movies");
    if (!res.ok) {
      store.dispatch(
        notifyActions.openModel({
          head: "Error !",
          message: "Could not fetch movies",
          type: "error",
        })
      );
      return new Response(
        JSON.stringify({ message: "Could not fetch movies" }),
        {
          status: 500,
        }
      );
    }
    return res;
  } catch (error) {
    store.dispatch(
      notifyActions.openModel({
        head: "Error !",
        message: error.message || "Could not fetch movies",
        type: "error",
      })
    );
    return new Response(
      JSON.stringify({
        message: error.message || "Could not fetch movies",
      }),
      { status: error.status || 500 }
    );
  }
}

export async function action({ request, params }) {

  try {
    const fd = await request.formData();

    const intent = fd.get("intent");

    
    
  } 
  
  catch (error) {
    
  }
}
