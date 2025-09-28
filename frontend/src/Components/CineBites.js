import React, { useState } from "react";
import Header from "./Header";
import Shows from "./Shows";
// import Theatres from "./Theatres";
// import Movies from "./Movies";

export default function CineBites(props) {
  const [check, setCheck] = useState(false);
  const [Movie, setMovie] = useState(1);

  // if(props)
  //     setCheck = 1;

  return (
    <div>
      <Header checked={setCheck} check={check} />
      <Shows checked={setCheck} FromCineBites={setMovie} />
    </div>
  );
}
