// Hooks
import React, { useState, useEffect } from "react";
import {
  useActionData,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// React-Redux
import { store } from "../app/store";
import { selectionActions } from "../app/features/selectionsSlice";
import { notifyActions } from "../app/features/notificationSlice";
import { useDispatch, useSelector } from "react-redux";

// Components
import MovieFilters from "../Components/Movies/MovieFilters";
import MoviePreview from "../Components/Movies/MoviePreview";
import MovieDetails from "../Components/Movies/MovieDetails";
import Movie from "../Components/Movies/Movie";
import MovieForm from "../Components/Movies/MovieForm";
import Shimmer from "../Components/UI/Feedbacks/Shimmer";
import TheatreDetails from "../Components/Theatres/TheatreDetails";
import convertTobase64 from "../utils/base64";

export default function Movies() {
  // react-router-dom
  const user = useRouteLoaderData("root");
  const role = user?.role || "user";
  const { movies } = useRouteLoaderData('home');
  const movie = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // react-redux
  const dispatch = useDispatch();
  const selectedMovie = useSelector((state) => state.selection.selectedMovie);
  const selectedTheatre = useSelector(
    (state) => state.selection.selectedTheatre
  );

  const [filteredMovies, setFilteredMovies] = useState(movies || []);
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const onClose = () => {
    setIsMovieDialogOpen(false);
    setEditingMovie(null);
  };

  useEffect(() => {
    setFilteredMovies(movies || []);
    if (movies?.length)
      dispatch(selectionActions.setSelectedMovie(movies?.[0]));
  }, [movies, dispatch]);

  useEffect(() => {
    if (!isSubmitting && movie) {
      onClose();
      // revalidate();
    }
  }, [isSubmitting, movie]);

  const isTablet = useMediaQuery({
    query: "(min-width: 40rem) and (max-width: 63.9rem)",
  });

  return (
    <>
      <section className="movies scrollbar-hide">
        <MovieFilters movies={movies} setFilteredMovies={setFilteredMovies}/>
        <MoviePreview selectedMovie={selectedMovie} className={"player"} />
        <MovieDetails selectedMovie={selectedMovie} />
        {!isTablet && <TheatreDetails selectedTheatre={selectedTheatre} />}
        <div className="movie">
          {filteredMovies?.map((movie) => {
            return (
              <Movie
                key={movie._id}
                movie={movie}
                onEdit={(e) => {
                  e.stopPropagation();
                  setEditingMovie(movie);
                  setIsMovieDialogOpen(true);
                }}
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
              onClose={onClose}
            />
          </>
        )}
      </section>
    </>
  );
}

export async function loader() {
  
}

export async function action({ request, params }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const fd = await request.formData();

    const intent = fd.get("intent");

    // console.log(fd.get("posterUrl")?.size)

    const posterUrl = await convertTobase64(fd.get("posterUrl"));
    // console.log(posterUrl)

    const payload = {
      imageUrl: posterUrl,
      movie: String(fd.get("movie") || "").trim(),
      languages: String(fd.get("languages") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      genres: String(fd.get("genres") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      rating: fd.get("rating") ? Number(fd.get("rating")) : undefined,
      votes: fd.get("votes") ? String(fd.get("votes")).trim() : undefined,
      price: fd.get("price") ? Number(fd.get("price")) : undefined,
      duration: fd.get("duration") ? Math.round(Number(fd.get("duration")) * 3600000) : undefined,
      trailers: String(fd.get("trailers") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    // console.log(payload);

    const movieName = fd.get("movieName");

    const OPTIONS_BY_INTENT = {
      create: {
        url: `${apiUrl}/new-movies`,
        method: "POST",
        body: payload,
      },
      update: {
        url: `${apiUrl}/edit-movie/${encodeURIComponent(
          movieName || ""
        )}`,
        method: "PUT",
        body: payload,
      },
      delete: {
        url: `${apiUrl}/remove-movie/${encodeURIComponent(
          movieName
        )}`,
        method: "DELETE",
      },
    };

    const options = OPTIONS_BY_INTENT[intent];
    if (!options) throw new Response("Invalid intent", { status: 400 });

    const res = await fetch(options.url, {
      method: options.method,
      headers: { "Content-Type": "application/json" },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      store.dispatch(
        notifyActions.openModel({
          head: "Error !",
          message: `Could not perform ${intent} on movies`,
          type: "error",
        })
      );
      return new Response(
        JSON.stringify({ message: `Could not perform ${intent} on movies` }),
        {
          status: 500,
        }
      );
    }

    const { message, movie } = await res.json();

    store.dispatch(
      notifyActions.openModel({
        head: `${intent}ed movie`,
        message: message ?? `${intent}ed movie successfully`,
        type: "success",
      })
    );

    return movie;
  } catch (error) {
    store.dispatch(
      notifyActions.openModel({
        head: "Error ",
        message: error.message ?? "Failed to update movie!",
        type: "error",
      })
    );
    return new Response(
      JSON.stringify({
        message: error.message || "Failed to update movie!",
      }),
      { status: error.status || 500 }
    );
  }
}
