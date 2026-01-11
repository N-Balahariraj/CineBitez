import React, { useEffect, useState } from "react";
import { TbClockPlay } from "react-icons/tb";
// import TheatreSeats from "./ScreensAndSeats";
import TheatreSessions from "./TheatreSessions";
import { useSelector } from "react-redux";

export default function TheatrePreview() {
  const [com, setCom] = useState(false);
  const [opacity, setOpacity] = useState("");

  const selectedTheatre = useSelector(
    (state) => state.selection.selectedTheatre
  );

  useEffect(()=>{
    setCom(false)
    setOpacity("")
  },[selectedTheatre])

  const hasHalls = Array.isArray(selectedTheatre?.halls) && selectedTheatre.halls.length > 0;

  const addComponent = () => {
    if (!hasHalls) return;

    setCom((prev) => !prev);
    setOpacity((prev) => (prev === "" ? "opacity-70" : ""));
  };

  return (
    <>
      <div className="theatre-preview">
        <TbClockPlay
          className="theatre-preview__time-icon"
          onClick={addComponent}
        />
        {selectedTheatre && (
          <img
            src={
              // filteredTheatres.length
              //   ? filteredTheatres[0].bg :
              selectedTheatre.bg
            }
            alt="theatre"
            className={`w-[100%] h-[100%] ${opacity}`}
          />
        )}
        {com && hasHalls && <TheatreSessions />}
      </div>
    </>
  );
}
