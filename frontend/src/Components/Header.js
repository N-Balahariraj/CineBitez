import React from "react";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
// import Account from "./Account";

export default function Header({checked,check}) {
  return (
    <div className="Header">
      <label class="switch">
        <input type="checkbox" className="HCheck" onClick={(e)=>{e.target.checked?checked(1):checked(0)}}/>
        {/* {()=>{
          if(check)
            return <input type="checkbox" onClick={(e)=>{e.target.checked?checked(1):checked(0)}} checked/>;
          else
            return <input type="checkbox" onClick={(e)=>{e.target.checked?checked(1):checked(0)}} />;
        }} */}
        <span className="slider"></span>
        <div className="slideTo">
          <span>Movies</span>
          <span>Theatres</span>
        </div>
      </label>
      <div className="flex mr-3">
        <div className="flex flex-col text-right px-1">
          <span>N.Balahariraj</span>
          <span>Balahariraj@sample.com</span>
        </div>
        <Link to="/Account|Settings">
          <RxAvatar className="h-11 w-11 hover:cursor-pointer" />
        </Link>        
      </div>
    </div>
  );
}
