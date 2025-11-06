import ReactPlayer from "react-player";
import { IoStarSharp } from "react-icons/io5";
import { useGetMoviesQuery } from "../app/api/moviesApiSlice";

export default function VideoPlayer({player, setSelectedMovie}) {
  const {data : {_, movies} = {}} = useGetMoviesQuery();
  const movie = movies[player - 1];

  return (
    <div className="movie-player">
      <div className="player">
        <ReactPlayer
          url={movie?.trailers[0]}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
      <div className="details">
        <span className=" text-center text-2xl font-semibold border-y-[1px] py-1 whitespace-nowrap">
          {movie.movie}
        </span>
        <span>
          {movie.genres.map((genre) => {
            if (movie.genres.at(-1) === genre) return genre;
            return genre + " | ";
          })}
        </span>
        <span>
          {movie.languages.map((language) => {
            if (movie.languages.at(-1) === language) return language;
            return language + " | ";
          })}
        </span>
        <div className="flex justify-between text-[orange]">
          <span>{movie.votes} Votes</span>
          <span className="flex flex-row jusify-between items-center">
            {movie.rating}/10 <IoStarSharp />
          </span>
        </div>
        <span>₹ {movie.price}</span>
        <button
          className="h-[35px] mb-1 rounded box-border bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700"
          onClick={() => {
            setSelectedMovie(1);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
