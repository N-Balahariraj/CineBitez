import React from "react";
import { Link } from "react-router-dom";
import {RxHome} from "react-icons/rx";
import {FiMail,FiUsers} from "react-icons/fi"
import { FaUserCog } from "react-icons/fa";

export default function NavBar() {
  
  return (
    <nav className="NavBar">
        <Link to="/"  className="NavOps">
          <div><RxHome className="NavIcons"/></div>
          <span className="NavText ml-3 font-medium">Home</span>
        </Link>
        <Link to="/About" className="NavOps">
          <div><FiUsers className="NavIcons"/></div>
          <span className="NavText ml-3 font-medium">About Us</span>
        </Link>
        <Link to="/Contacts" className="NavOps">
          <div><FiMail className="NavIcon" /></div>
          <span className="NavText ml-3 font-medium">Contact Us</span>
        </Link>
        <Link to="/Account|Settings" className="NavOps">
          <div><FaUserCog className="NavIcons"/></div>
          <span className="NavText ml-3 font-medium">Settings</span>
        </Link>
        <div className="bg-[#273158] w-[80%] h-0.5 mt-3 ml-5"></div>
    </nav>
  );

}
