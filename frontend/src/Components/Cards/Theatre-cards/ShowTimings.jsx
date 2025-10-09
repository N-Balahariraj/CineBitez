import React from "react";
import { Theatre_Data } from "../../../Data/Theatre_Data";

export default function ShowTimings({ selectedTheatre }) {
  return (
    <div className="show-timings">
      {Theatre_Data[selectedTheatre - 1].movies.map((m) => (
        <span className="block text-white font-semibold h-[20%] m-2">
          {m.movie} :
          {m.shows.map((s) => (
            <span className=" border-white border-[1px] rounded-md m-2 p-2 cursor-pointer hover:brightness-95">{s}</span>
          ))}
        </span>
      ))}
    </div>
  );
}
