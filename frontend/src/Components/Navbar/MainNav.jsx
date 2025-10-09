import React from "react";
import { NavLink } from "react-router-dom";
import { RxHome } from "react-icons/rx";
import { FiMail, FiUsers } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

export default function MainNav() {
  return (
    <nav className="main-nav">
      <NavLink to="/" className="main-nav__item">
        <div className={`main-nav__item-icon-div`} >
          <RxHome className="main-nav__item-icon" />
        </div>
        <span className="main-nav__item-title">Home</span>
      </NavLink>
      <NavLink to="/About" className="main-nav__item">
        <div className={`main-nav__item-icon-div`}>
          <FiUsers className="main-nav__item-icon" />
        </div>
        <span className="main-nav__item-title">About Us</span>
      </NavLink>
      <NavLink to="/Contact" className="main-nav__item">
        <div className={`main-nav__item-icon-div`}>
          <FiMail className="main-nav__item-icon" />
        </div>
        <span className="main-nav__item-title">Contact Us</span>
      </NavLink>
      <NavLink to="/Profile" className="main-nav__item">
        <div className={`main-nav__item-icon-div`}>
          <RxAvatar className="main-nav__item-icon" />
        </div>
        <span className="main-nav__item-title">Profile</span>
      </NavLink>
    </nav>
  );
}
