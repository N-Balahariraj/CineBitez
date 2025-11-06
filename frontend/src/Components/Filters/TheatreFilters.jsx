import React, { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { TbCurrentLocation } from "react-icons/tb";
import { useGetTheatresQuery } from "../../app/api/theatresApiSlice";

export default function TheatreFilters({ currentScreen, setFilteredTheatres, Movie }) {
  const {data} = useGetTheatresQuery();
  const {message = " ", theatres: Theatres_Data = []} = data || {}
  const [SearchInput, setSearchInput] = useState("");
  const [RateOrder, setRateOrder] = useState("reset");
  const RateBtn = document.getElementById("RateBtn");
  const [PriceOrder, setPriceOrder] = useState("reset");
  const PriceBtn = document.getElementById("PriceBtn");
  const DescendingRate = Array.from(Theatres_Data).sort(
    (a, b) => b.rate - a.rate
  );
  const AscendingPrice = Array.from(Theatres_Data).sort(
    (a, b) => a.price - b.price
  );

  function filterTheatre() {
    const Filter = Theatres_Data?.filter((Theatre) => {
      return Theatre?.name.toLowerCase().includes(SearchInput.toLowerCase());
    });
    setFilteredTheatres(Filter);
  }

  const sortRate = () => {
    RateBtn.classList.toggle("BtnActive");
    if (RateOrder === "reset") {
      setRateOrder("set");
      setFilteredTheatres(DescendingRate);
    } else {
      setRateOrder("reset");
      setFilteredTheatres(Theatres_Data);
    }
  };

  const sortPrice = () => {
    PriceBtn.classList.toggle("BtnActive");
    if (PriceOrder === "reset") {
      setPriceOrder("set");
      setFilteredTheatres(AscendingPrice);
    } else {
      setPriceOrder("reset");
      setFilteredTheatres(Theatres_Data);
    }
  };

  return (
    <div className={`theatres-filter header-nav__item-filters ${ currentScreen === "theatres" && "flex" }`}>
      <div className="theatres-filter__searchbar">
        <BiSearchAlt
          className=" h-[100%] w-[15%] pr-2 cursor-pointer"
          onClick={() => {
            filterTheatre();
          }}
        />
        <input
          type="text"
          placeholder="Search"
          className="h-[100%] w-[70%] outline-none bg-transparent"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <TbCurrentLocation className=" h-[100%] w-[15%] pl-2 border-l border-l-white cursor-pointer" />
      </div>
      <span
        className="theatres-filter__options "
        id="RateBtn"
        onClick={sortRate}
      >
        Top Rated
      </span>
      <span
        className="theatres-filter__options"
        id="PriceBtn"
        onClick={sortPrice}
      >
        In Budget
      </span>
    </div>
  );
}
