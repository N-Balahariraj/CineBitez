import { FaCirclePlay, FaMasksTheater, FaCircleInfo } from "react-icons/fa6";
import { GiTheater } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";
import Navbar from "../UI/Navbar/Navbar";

export default function MainNav() {
  return (
    <Navbar className="main-nav">
      <Navbar.Item to="" className="main-nav__item">
        <Navbar.Icon
          Element={FaMasksTheater}
          spanClassName={`main-nav__item__icon-container`}
          iconClassName="main-nav__item__icon"
        />
        <Navbar.Title className="main-nav__item-title">Home</Navbar.Title>
      </Navbar.Item>
      <Navbar.Item to="movies" className="main-nav__item">
        <Navbar.Icon
          Element={FaCirclePlay}
          spanClassName={`main-nav__item__icon-container`}
          iconClassName="main-nav__item__icon"
        />
        <Navbar.Title className="main-nav__item-title">Movies</Navbar.Title>
      </Navbar.Item>
      <Navbar.Item to="theatres" className="main-nav__item">
        <Navbar.Icon
          Element={GiTheater}
          spanClassName={`main-nav__item__icon-container`}
          iconClassName="main-nav__item__icon"
        />
        <Navbar.Title className="main-nav__item-title">Theatres</Navbar.Title>
      </Navbar.Item>
      <Navbar.Item to="about" className="main-nav__item">
        <Navbar.Icon
          Element={FaCircleInfo}
          spanClassName={`main-nav__item__icon-container`}
          iconClassName="main-nav__item__icon"
        />
        <Navbar.Title className="main-nav__item-title">About</Navbar.Title>
      </Navbar.Item>
      <Navbar.Item to="contact" className="main-nav__item">
        <Navbar.Icon
          Element={FaHandshake}
          spanClassName={`main-nav__item__icon-container`}
          iconClassName="main-nav__item__icon"
        />
        <Navbar.Title className="main-nav__item-title">Contact</Navbar.Title>
      </Navbar.Item>
    </Navbar>
  );
}
