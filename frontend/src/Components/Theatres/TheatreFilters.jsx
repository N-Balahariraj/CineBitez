import { useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoIosPricetags } from "react-icons/io";
import { FaStarHalfAlt } from "react-icons/fa";
import Filters from "../UI/Filters/Filters";

export default function TheatreFilters({ theatres, setFilteredTheatres }) {
  const [selectedLocation, setSelectedLocation] = useState("Location")
  const descendingRate = Array.from(theatres).sort(
    (a, b) => b.rating - a.rating
  );
  const ascendingPrice = Array.from(theatres).sort((a, b) => a.price - b.price);

  const locations = ["Location","Coimbatore", "Pune"];

  function filterTheatre(event) {
    const searchInput = event.target.value;
    const filteredTheatres = theatres?.filter((theatre) => {
      return theatre?.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    setFilteredTheatres(filteredTheatres);
  }

  function handleLocationChange(event) {
    const location = event.target.value;
    setSelectedLocation(location);
    const filteredTheatres = theatres?.filter((theatre)=>{
      return theatre?.location.toLowerCase().includes(location.toLowerCase());
    })
    if(location !== "Location") setFilteredTheatres(filteredTheatres);
    else setFilteredTheatres(theatres)
  }

  return (
    <Filters className={`theatres-filter`}>
      <Filters.Item
        className={"flex items-center justify-around border rounded-lg p-2 "}
      >
        <Filters.Searchbar
          iconClassName={"text-xl cursor-pointer"}
          inputClassName={
            "w-[100%] bg-transparent text-center text-lg outline-none"
          }
          placeholder="Search"
          onChange={filterTheatre}
        />
      </Filters.Item>
      <Filters.Item className={"filter__item "}>
        <Filters.Title className="filter__selected">
          {selectedLocation !== "Location" ? selectedLocation : ""}
        </Filters.Title>
        <Filters.Options
          options={locations}
          id={"Languages"}
          className={"filter__options"}
          onChange={handleLocationChange}
          value={selectedLocation}
        />
        <Filters.Icon Element={FaLocationCrosshairs} />
      </Filters.Item>
      <Filters.Toggle
        className={"filter__item"}
        handleClick={() => setFilteredTheatres(ascendingPrice)}
        handleClear={() => setFilteredTheatres(theatres)}
      >
        <Filters.Title className="filter__options">In Budget</Filters.Title>
        <Filters.Icon Element={IoIosPricetags} />
      </Filters.Toggle>
      <Filters.Toggle
        className={"filter__item "}
        handleClick={() => setFilteredTheatres(descendingRate)}
        handleClear={() => setFilteredTheatres(theatres)}
      >
        <Filters.Title className="filter__options">Top Rated</Filters.Title>
        <Filters.Icon Element={FaStarHalfAlt} />
      </Filters.Toggle>
    </Filters>
  );
}
