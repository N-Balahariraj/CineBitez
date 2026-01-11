import React from "react";
import { MdOutlineDarkMode,MdOutlineLightMode } from "react-icons/md";

export default function ThemeToggler() {
  function toggleTheme(){
    const body = document.querySelector('body');
    const bg = document.querySelector('.background');

    body.classList.toggle('light-theme')
    bg.classList.toggle('light-theme')

  }

  return (
    <>
    <label className="Toggler">
        <input type="checkbox" className="TCheck" onChange={toggleTheme}/>
        <span className="Theme"></span>
        <div className="ThemeTo">
          <MdOutlineDarkMode className="text-xl"/>
          <MdOutlineLightMode className="text-xl"/>
        </div>
      </label>
    </>
  );
}
