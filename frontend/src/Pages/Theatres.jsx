import React, { useState } from "react";
import { Movie_Data } from "../Data/Movie_Data";
import Theatre from "../Components/Cards/Theatre-cards/Theatre";
import TheatrePreview from "../Components/Cards/Theatre-cards/TheatrePreview";
import Spotlight from "../Components/Cards/Spotlight";
import { useMediaQuery } from 'react-responsive'

export default function Theatres({ selectedMovie, filteredTheatres }) {
  const [selectedTheatre, setSelectedTheatre] = useState(1);

  // Here the searchText changes even on firstLoad/Reload of a page.
  // So,the useEffect calls the filter function and sets filteredTheatres' length to 8.
  // And so, the ternary operator in "T-Pics" cannot change the image on clicking the respective theatre

  const isMobile = useMediaQuery({query: '(max-width: 40rem)'})

  return (
    <>
      <div className="theatres">
        <TheatrePreview
          selectedTheatre={selectedTheatre}
          filteredTheatres={filteredTheatres}
        />
        <div className="selection-info">
          {
            !isMobile && <Spotlight MovieDetails={Movie_Data[selectedMovie-1]} tailwind={"max-w-[none]"}/>
          }
          <div className="selection-info__theatre">
            <span>Theatre</span>
            <span>Show Date and Time</span>
            <span>Snack</span>
            <span>No.of Tickets</span>
            <button className=" rounded h-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90">
              Book for ₹ 400
            </button>
          </div>
        </div>
        <Theatre
          setSelectedTheatre={setSelectedTheatre}
          filteredTheatres={filteredTheatres}
        />
      </div>
    </>
  );
}
