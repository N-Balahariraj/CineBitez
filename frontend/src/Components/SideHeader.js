import React from "react";

export default function SideHeader(props) {
  return (
    <>
      <div className="Title">
        <img src={process.env.PUBLIC_URL + '/CineBiteIcon.png'} alt="logo" className="h-[37px] w-[37px] m-1"/>
        <h3>CineBite</h3>
      </div>
    </>
  );
}
