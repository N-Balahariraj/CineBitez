import React, { useState, useEffect } from "react";
import { IoIosPricetags } from "react-icons/io";
import { FaStarHalfAlt } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { MdMovieFilter } from "react-icons/md";
import Filters from "../UI/Filters/Filters";

export default function MovieFilters({ movies, setFilteredMovies }) {
  const [SelectedLanguage, setSelectedLanguage] = useState("Languages");
  const [SelectedGenere, setSelectedGenere] = useState("Genres");
  const [SelectedPrice, setSelectedPrice] = useState("Pricings");
  const [SelectedRate, setSelectedRate] = useState("Ratings");

  //prettier-ignore
  const Languages = ["Languages","English","Hindi","Tamil","Malayalam","Telugu","Kannadam"];

  //prettier-ignore
  const Genres = ["Genres","Horror","Thriller","Action","Drama","Sci-Fi","Crime","Comedy","Romance","Adventure"];

  const descendingRate = Array.from(movies).sort((a, b) => b.rating - a.rating);
  const ascendingPrice = Array.from(movies).sort((a, b) => a.price - b.price);

  function filterBySearchInput(event) {
    const searchInput = event.target.value;
    const filteredMovieData = movies?.filter((Movie) => {
      return Movie?.movie.toLowerCase().includes(searchInput.toLowerCase());
    });
    setFilteredMovies(filteredMovieData ?? []);
  }

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    const newFilteredMovies = movies.filter((movie) => {
      return movie.languages.includes(newLanguage);
    });
    if (newLanguage === "Languages") setFilteredMovies(movies);
    else setFilteredMovies(newFilteredMovies);
  };

  const handleGenereChange = (event) => {
    const newGenre = event.target.value;
    setSelectedGenere(newGenre);
    const newFilteredMovies = movies.filter((movie) => {
      return movie.genres.includes(newGenre);
    });
    if (newGenre === "Genres") setFilteredMovies(movies);
    else setFilteredMovies(newFilteredMovies);
  };

  return (
    <Filters className={`movies-filter`}>
      <Filters.Item
        className={"flex items-center justify-around border rounded-lg p-2 "}
      >
        <Filters.Searchbar
          iconClassName={"text-xl cursor-pointer"}
          inputClassName={
            "w-[100%] bg-transparent text-center text-lg outline-none"
          }
          placeholder="Search"
          onChange={filterBySearchInput}
        />
      </Filters.Item>
      <Filters.Item className={"filter__item"}>
        <Filters.Icon Element={RiRobot2Fill} />
        <Filters.Title className="filter__selected">
          {SelectedLanguage !== "Languages" ? SelectedLanguage : ""}
        </Filters.Title>
        <Filters.Options
          options={Languages}
          id={"Languages"}
          className={"filter__options"}
          onChange={handleLanguageChange}
          value={SelectedLanguage}
        />
      </Filters.Item>
      <Filters.Item className={"filter__item"}>
        <Filters.Icon Element={MdMovieFilter} />
        <Filters.Title className="filter__selected">
          {SelectedGenere !== "Genres" ? SelectedGenere : ""}
        </Filters.Title>
        <Filters.Options
          id={"Generes"}
          className={"filter__options"}
          options={Genres}
          onChange={handleGenereChange}
          value={SelectedGenere}
        />
      </Filters.Item>
      <Filters.Toggle
        className={"filter__item"}
        handleClick={() => setFilteredMovies(ascendingPrice)}
        handleClear={() => setFilteredMovies(movies)}
      >
        <Filters.Title className="filter__options">In Budget</Filters.Title>
        <Filters.Icon Element={IoIosPricetags} />
      </Filters.Toggle>
      <Filters.Toggle
        className={"filter__item "}
        handleClick={() => setFilteredMovies(descendingRate)}
        handleClear={() => setFilteredMovies(movies)}
      >
        <Filters.Title className="filter__options">Top Rated</Filters.Title>
        <Filters.Icon Element={FaStarHalfAlt} />
      </Filters.Toggle>
    </Filters>
  );
}
