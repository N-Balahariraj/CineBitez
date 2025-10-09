import { useState, useEffect } from "react";
import { Movie_Data } from "../../Data/Movie_Data";
import { BiSearchAlt } from "react-icons/bi";


export default function SplashFilters({currentScreen, setFilteredSpotlights}) {
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    filterBySearchText();
  }, [searchText]);
  
  function filterBySearchText() {
    const filteredSpotlights = Movie_Data.filter((spotlight) => {
      return spotlight.movie.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredSpotlights(filteredSpotlights);
  }

  return (
    <div
      className={`header-nav__item-filters ${
        currentScreen === "splash" && "flex"
      }`}
    >
      <input
        type="text"
        name="search-text"
        className="h-[100%] w-[70%] outline-none bg-transparent"
        onChange={(e)=>setSearchText(e.target.value)}
      />
      <BiSearchAlt className="h-[100%] w-[15%] pr-2 cursor-pointer" />
    </div>
  );
}
