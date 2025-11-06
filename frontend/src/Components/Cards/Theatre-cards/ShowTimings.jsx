import React from "react";
import { useGetTheatresQuery } from "../../../app/api/theatresApiSlice";

export default function ShowTimings({ selectedTheatre }) {
  const {data:{message = " ",theatres: Theatres_Data = []}} = useGetTheatresQuery();
  return (
    <div className="show-timings">
      {Theatres_Data[selectedTheatre - 1].shows.map((show) => (
        <span className="block text-white font-semibold h-[20%] m-2">
          {show.movie} :
          {show.showTimings.map((showTiming) => (
            <span className=" border-white border-[1px] rounded-md m-2 p-2 cursor-pointer hover:brightness-95">{showTiming}</span>
          ))}
        </span>
      ))}
    </div>
  );
}
