import React, { useState } from "react";
import { Movie_Data } from "../Common/Movie_Data";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { CiBank } from "react-icons/ci";
import { BiMoviePlay } from "react-icons/bi";

export default function Discover({ chosenTrailer, ShowsToTheatres }) {
  const navigate = useNavigate();
  const [Date,setDate] = useState("");
  const [Time,setTime] = useState("")
  return (
    <>
      <span className="text-white font-semibold text-4xl mb-3.5 ">
        Discover
      </span>
      <div className="Discover ml-3">
        <div className="BookedMovie h-[100%] w-[62%] rounded-lg overflow-hidden">
          <ReactPlayer
            url={Movie_Data[chosenTrailer - 1].trailers[0]}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
        <form className="BookingDetails rounded-md">
          <span>Get Ticket</span>
          <div className=" flex justify-between content-center bg-[#0b122e] rounded-2xl h-[35px] px-3">
            <input
              type="text"
              className="outline-none  bg-[#0b122e]"
              placeholder="Choose Your Movie"
            />
            <BiMoviePlay
              onClick={() => {
                navigate("/Movies");
              }}
              className="mt-2 h-[23px] w-[23px] hover:cursor-pointer"
            />
          </div>
          <div className="flex justify-between content-center bg-[#0b122e] rounded-2xl h-[35px] px-3">
            <input
              type="text"
              className="outline-none bg-[#0b122e]"
              placeholder="Choose Your Theatre"
            />
            <CiBank
              onClick={() => {
                ShowsToTheatres(1);
              }}
              className="mt-2 h-[25px] w-[25px] hover:cursor-pointer"
            />
          </div>
          <div className="flex justify-between">
            <input
              type="date"
              placeholder="Choose date"
              value={Date}
              onChange={(e)=>{setDate(e.target.value)}}
              className="dateclass placeholderclass outline-none bg-[#0b122e] rounded-2xl h-[35px] w-[47%] text-center px-3"
            />
            <input
              type="time"
              placeholder="Choose time"
              value={Time}
              onChange={(e)=>{setTime(e.target.value)}}
              className="dateclass placeholderclass outline-none bg-[#0b122e] rounded-2xl h-[35px] w-[47%] text-center px-3"
            />
          </div>
          <button className="rounded-2xl h-[40px] w-[100%] self-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white">
            Book Now
          </button>
        </form>
      </div>
    </>
  );
}
