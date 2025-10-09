import React, { useState } from "react";
import { TbClockPlay } from "react-icons/tb";
import { Theatre_Data } from "../../../Data/Theatre_Data";
// import TheatreSeats from "./ScreensAndSeats";
import TheatreTime from "./ShowTimings";

export default function TheatrePreview({ selectedTheatre, filteredTheatres }) {
  const [com, setCom] = useState(false);
  const [opacity, setOpacity] = useState("opacity-100")

  const addComponent = () => {
    setCom(!com);
    setOpacity((opacity) => opacity === "opacity-100"? "opacity-70" : "opacity-100")
  };

  return (
    <>
      <div className="theatre-preview">
        <TbClockPlay
          className="theatre-preview__time-icon"
          onClick={addComponent}
        />
        <img
          src={
            // filteredTheatres.length
            //   ? filteredTheatres[0].bg :
            Theatre_Data[selectedTheatre - 1].bg
          }
          alt="theatre"
          className={`w-[100%] h-[100%] ${opacity}`}
        />
        {com && <TheatreTime selectedTheatre={selectedTheatre} />}
      </div>
    </>
  );
}
