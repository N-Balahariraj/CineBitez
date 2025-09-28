import React, { useRef, useState } from "react";
import Discover from "./Discover";
import Streaming from "./Streaming";
// import Movies from "./Movies";

export default function Shows({checked,FromCineBites}) {
  const [Trailer, setTrailer] = useState(1);

  const MovieRef = useRef(null);

  const ScrollIntoMovies = ()=>{
      // console.log("Scroll is Triggered");
      // console.log(MovieRef.current.scrollIntoView);
      // MovieRef.current?.scrollIntoView({behavior:"smooth"});

  }

  return (
    <div className="Shows-Movies">
      <div className="Show">
        <Discover chosenTrailer={Trailer} ShowsToTheatres={checked}/>
        <Streaming chooseTrailer={setTrailer} ShowsToTheatres={checked} Scroll={ScrollIntoMovies} FromShows={FromCineBites}/>
      </div>
      {/* <Movies ShowsToTheatres={checked} Ref={MovieRef} FromShows={FromCineBites}/> */}
    </div>
  );
}
