import React from "react";
import { MdOutlineDarkMode,MdOutlineLightMode } from "react-icons/md";

export default function ThemeToggler() {
  return (
    <>
    <label class="Toggler">
        <input type="checkbox" className="TCheck"/>
        <span className="Theme"></span>
        <div className="ThemeTo">
          <MdOutlineDarkMode className="text-xl"/>
          <MdOutlineLightMode className="text-xl"/>
        </div>
      </label>
    </>
  );
}
