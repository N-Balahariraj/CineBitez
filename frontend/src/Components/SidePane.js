import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SideHeader from "./SideHeader";
import { FaGreaterThan } from "react-icons/fa6";

export default function SidePane() {

  const Arrow = document.getElementById("Arrow");
  const SidePane = document.getElementById("SidePane");
  
  const handleClick = () =>{
    Arrow.classList.toggle("Collapse");
    SidePane.classList.toggle("Expand")
  }

  return (
    <>
      <div className="SidePaneCollapse" id="SidePane">
        <SideHeader />
        <NavBar />
        <Footer />
      </div>
      <div className="S-Arrow">
        <div className="ArrowExpand" id="Arrow" onClick={handleClick}>
          <FaGreaterThan/>
        </div>
      </div>
    </>
  );
}
