import React from "react";
import { IoStarSharp } from "react-icons/io5";

export default function Theatre({ setSelectedTheatre,filteredTheatres }) {


  return (
    <div className="theatre scrollbar-hide">
      {filteredTheatres.map((theatre) => {
        return (
          <div className="theatre-cards" key={theatre.id} onClick={()=>{setSelectedTheatre(theatre.id)}}>
            <div className="w-[100%] flex justify-between items-center"> 
                <span className=" text-lg font-semibold border-b-2 ">{theatre.name}</span>
                <span className="flex justify-end items-center"><IoStarSharp className="mr-1"/>{theatre.rate}</span>
            </div>
            <span>{theatre.location}</span>
          </div>
        );
      })}
    </div>
  );
}
