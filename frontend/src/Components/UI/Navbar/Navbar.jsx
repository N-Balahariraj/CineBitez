import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ children, className }) {
  return <nav className={className}>{children}</nav>;
}

function NavItem({ children, className, to }) {
  return (
    <NavLink to={to} className={className}>
      {children}
    </NavLink>
  );
}

function NavTitle({ children, className }) {
  return <span className={className}>{children}</span>;
}

function NavIcon({ Element, spanClassName, iconClassName }) {
  return (
    <span className={spanClassName}>
      <Element className={iconClassName} />
    </span>
  );
}

Navbar.Item = NavItem;
Navbar.Title = NavTitle;
Navbar.Icon = NavIcon;
