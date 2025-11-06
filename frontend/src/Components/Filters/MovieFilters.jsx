import React, { useState, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useGetMoviesQuery } from "../../app/api/moviesApiSlice";

export default function MovieFilters({ currentScreen, setFilteredMovies }) {
  const {data} = useGetMoviesQuery();

  const {message = " ", movies : Movie_Data = []} = data || {}

  const [SearchInput, setSearchInput] = useState("");
  const [SelectedLanguage, setSelectedLanguage] = useState("Language");
  const [SelectedGenere, setSelectedGenere] = useState("Genere");
  const [SelectedPrice, setSelectedPrice] = useState("Pricings");
  const [SelectedRate, setSelectedRate] = useState("Ratings");


  const Languages = [
    {
      key: 0,
      name: "Language",
    },
    {
      key: 1,
      name: "English",
    },
    {
      key: 2,
      name: "Hindi",
    },
    {
      key: 3,
      name: "Tamil",
    },
    {
      key: 4,
      name: "Malayalam",
    },
    {
      key: 5,
      name: "Telugu",
    },
    {
      key: 6,
      name: "Kannadam",
    },
  ];

  const Generes = [
    {
      key: 0,
      name: "Genere",
    },
    {
      key: 1,
      name: "Horror",
    },
    {
      key: 2,
      name: "Thriller",
    },
    {
      key: 3,
      name: "Action",
    },
    {
      key: 4,
      name: "Drama",
    },
    {
      key: 5,
      name: "Sci-Fi",
    },
    {
      key: 6,
      name: "Crime",
    },
    {
      key: 7,
      name: "Comedy",
    },
    {
      key: 8,
      name: "Romance",
    },
    {
      key: 9,
      name: "Adventure",
    },
  ];

  const Price = [
    {
      key: 0,
      name: "Pricings",
    },
    {
      key: 1,
      name: "Low to High",
    },
    {
      key: 2,
      name: "High to Low",
    },
  ];

  const Rate = [
    {
      key: 0,
      name: "Ratings",
    },
    {
      key: 1,
      name: "Low to High",
    },
    {
      key: 2,
      name: "High to Low",
    },
  ];

  useEffect(() => {
    filterBySearchInput();
  }, [SearchInput]);

  function filterBySearchInput() {
    const filteredMovieData = Movie_Data?.filter((Movie) => {
      return Movie?.movie.toLowerCase().includes(SearchInput.toLowerCase());
    });
    setFilteredMovies(filteredMovieData ?? []);
  }

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    const newFilteredMovies = Movie_Data.filter((movie) => {
      return movie.languages.includes(newLanguage);
    });
    if (newLanguage !== "Language") setFilteredMovies(newFilteredMovies);
    else setFilteredMovies(Movie_Data);
  };

  const handleGenereChange = (event) => {
    const newGenere = event.target.value;
    setSelectedGenere(newGenere);
    const newFilteredMovies = Movie_Data.filter((movie) => {
      return movie.theme.includes(newGenere);
    });
    if (newGenere !== "Genere") setFilteredMovies(newFilteredMovies);
    else setFilteredMovies(Movie_Data);
  };

  const handlePriceChange = (event) => {
    const newPrice = event.target.value;
    setSelectedPrice(newPrice);
    const Ascending = Array.from(Movie_Data).sort((a, b) => a.price - b.price);
    const Descending = Array.from(Movie_Data).sort((a, b) => b.price - a.price);
    if (newPrice === "Low to High") setFilteredMovies(Ascending);
    else if (newPrice === "High to Low") setFilteredMovies(Descending);
    else setFilteredMovies(Movie_Data);
  };

  const handleRateChange = (event) => {
    const newRate = event.target.value;
    setSelectedRate(newRate);
    const Ascending = Array.from(Movie_Data).sort(
      (a, b) => a.rating - b.rating
    );
    const Descending = Array.from(Movie_Data).sort(
      (a, b) => b.rating - a.rating
    );
    if (newRate === "Low to High") setFilteredMovies(Ascending);
    else if (newRate === "High to Low") setFilteredMovies(Descending);
    else setFilteredMovies(Movie_Data);
  };

  return (
    <div
      className={`movies-filter header-nav__item-filters ${
        currentScreen === "movies" && "flex"
      }`}
    >
      <div className="w-[20%] h-[100%] flex items-center justify-around border rounded-lg p-2 ">
        <input
          placeholder="Search"
          className="w-[100%] bg-transparent text-center text-lg outline-none"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        ></input>
        <BiSearchAlt
          className="text-xl cursor-pointer"
          onClick={() => {
            setFilteredMovies(Movie_Data);
          }}
        />
      </div>
      <select
        value={SelectedLanguage}
        className="movies-filter__options"
        onChange={handleLanguageChange}
      >
        {Languages.map((Lang) => {
          return (
            <option
              key={Lang.key}
              value={Lang.name}
              className="movies-filter__option"
            >
              {Lang.name}
            </option>
          );
        })}
      </select>
      <select
        value={SelectedGenere}
        className="movies-filter__options"
        onChange={handleGenereChange}
      >
        {Generes.map((Gen) => {
          return (
            <option
              key={Gen.key}
              value={Gen.name}
              className="movies-filter__option"
            >
              {Gen.name}
            </option>
          );
        })}
      </select>
      <select
        value={SelectedPrice}
        className="movies-filter__options"
        onChange={handlePriceChange}
      >
        {Price.map((Price) => {
          return (
            <option
              key={Price.key}
              value={Price.name}
              className="movies-filter__option"
            >
              {Price.name}
            </option>
          );
        })}
      </select>
      <select
        value={SelectedRate}
        className="movies-filter__options"
        onChange={handleRateChange}
      >
        {Rate.map((Rate) => {
          return (
            <option
              key={Rate.key}
              value={Rate.name}
              className="movies-filter__option"
            >
              {Rate.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
