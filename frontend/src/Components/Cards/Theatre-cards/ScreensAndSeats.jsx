import React from "react";

function Seats({ clsnm, src, n }) {
  const images = [];
  for (let i = 0; i < n; i++) {
    images.push(
      <img src={src} alt="Seat" key={i} className="h-[45px] w-[45px]" />
    );
  }
  return <div className={clsnm}>{images}</div>;
}

export default function ScreensAndSeats() {
  return (
    <div className="T-Seates">
      <Seats
        clsnm={"A Seat"}
        src="/Images/TheatreSeat.png"
        n={16}
      />
      <Seats
        clsnm={"B Seat"}
        src="/Images/TheatreSeat.png"
        n={36}
      />
      <Seats
        clsnm={"C Seat"}
        src="/Images/TheatreSeat.png"
        n={16}
      />
      <Seats
        clsnm={"D Seat"}
        src="/Images/TheatreSeat.png"
        n={4}
      />
      <Seats
        clsnm={"E Seat"}
        src="/Images/TheatreSeat.png"
        n={18}
      />
      <Seats
        clsnm={"F Seat"}
        src="/Images/TheatreSeat.png"
        n={4}
      />
      <div className="G Seat">
        <span className="text-center">Screen</span>
      </div>
    </div>
  );
}
