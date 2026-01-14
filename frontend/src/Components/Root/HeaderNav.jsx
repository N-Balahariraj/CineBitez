import Navbar from "../UI/Navbar/Navbar";
import { IoNotifications } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { IoTicket } from "react-icons/io5";

export default function HeaderNav() {
  return (
    <header className="header">
      <aside>
        <img
          src="/Images/CineBiteIcon.png"
          alt="CineBitez Logo"
          className="header-logo"
        />
        <span className="header-title">CineBitez</span>
      </aside>
      <Navbar className={"header-nav"}>
        <Navbar.Item
          to={"profile/notifications"}
          className={"header-nav__item"}
        >
          <Navbar.Icon
            Element={IoNotifications}
            spanClassName={"header-nav__item__icon-container"}
            iconClassName={"header-nav__item__icon"}
            />
        </Navbar.Item>
        <Navbar.Item to={"profile"} className={"header-nav__item"}>
          <Navbar.Icon
            Element={FaUserCircle}
            spanClassName={"header-nav__item__icon-container"}
            iconClassName={"header-nav__item__icon"}
            />
        </Navbar.Item>
        <Navbar.Item to={"profile/bookings"} className={"header-nav__item"}>
          <Navbar.Icon
            Element={IoTicket}
            spanClassName={"header-nav__item__icon-container"}
            iconClassName={"header-nav__item__icon"}
          />
        </Navbar.Item>
      </Navbar>
    </header>
  );
}
