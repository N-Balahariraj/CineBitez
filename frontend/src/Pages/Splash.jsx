import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

import Spotlight from "../Components/Cards/Spotlight";

import { CiBank } from "react-icons/ci";
import { BiMoviePlay } from "react-icons/bi";

export default function Splash({ setSelectedMovie, filteredSpotlights }) {
  const navigate = useNavigate();
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [trailer, setTrailer] = useState(1);
  return (
    <section className="splash">
      <h2 className="discover-title">
        Discover
      </h2>
      <section className="discover">
        <div className="discover__player">
          <ReactPlayer
            url={filteredSpotlights?.[trailer]?.trailers[0]}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
        <form className="discover__form">
          <span>Get Ticket</span>
          <div className=" flex justify-between content-center bg-[#0b122e] rounded-2xl h-[35px] px-3">
            <input
              type="text"
              className="outline-none  bg-[#0b122e]"
              placeholder="Choose Your Movie"
            />
            <BiMoviePlay
              onClick={() => {
                navigate("/movies");
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
                navigate("/theatres")
              }}
              className="mt-2 h-[25px] w-[25px] hover:cursor-pointer"
            />
          </div>
          <div className="flex justify-between">
            <input
              type="date"
              placeholder="Choose date"
              value={Date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              className="dateclass placeholderclass outline-none bg-[#0b122e] rounded-2xl h-[35px] w-[47%] text-center px-3"
            />
            <input
              type="time"
              placeholder="Choose time"
              value={Time}
              onChange={(e) => {
                setTime(e.target.value);
              }}
              className="dateclass placeholderclass outline-none bg-[#0b122e] rounded-2xl h-[35px] w-[47%] text-center px-3"
            />
          </div>
          <button className="rounded-2xl h-[40px] w-[100%] self-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white">
            Book Now
          </button>
        </form>
      </section>
      <h2 className="spotlights-title">SpotLights</h2>
      <section className="spotlights scrollbar-hide">
        {filteredSpotlights?.map((spotlight) => {
          return (
            <Spotlight
              key={spotlight.id}
              spotlight={spotlight}
              setTrailer={setTrailer}
              setSelectedMovie={setSelectedMovie}
            />
          );
        })}
      </section>
    </section>
  );
}
