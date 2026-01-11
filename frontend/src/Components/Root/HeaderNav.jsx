// import { useLocation } from "react-router-dom";
// import { useMediaQuery } from "react-responsive";

// import { LuPopcorn } from "react-icons/lu";
// import { Gi3DGlasses } from "react-icons/gi";
// import { MdOutlineVideocam } from "react-icons/md";

// import MovieFilters from "../Filters/MovieFilters";
// import TheatreFilters from "../Filters/TheatreFilters";
// import SplashFilters from "../Filters/SplashFilters";
// import MobileFilters from "../Filters/MobileFilters";


// export default function HeaderNav({
//   currentScreen,
//   setCurrentScreen,
//   setFilteredTheatres,
//   setFilteredMovies,
//   setFilteredSpotlights,
// }) {
//   const location = useLocation();
//   const isMobile = useMediaQuery({ query: "(max-width: 40rem)" });
//   return (
//     <div className={`header-nav ${location.pathname !== "/" && "hidden"}`}>
//       <div className="header-nav__item">
//         <MdOutlineVideocam
//           className="header-nav__item-logo"
//           onClick={(e) => {
//             e.preventDefault();
//             setCurrentScreen("splash");
//           }}
//         />
//         {isMobile && currentScreen === "splash" ? (
//           <MobileFilters
//             currentScreen={currentScreen}
//             setFilteredSpotlights={setFilteredSpotlights}
//           />
//         ) : (
//           <SplashFilters
//             currentScreen={currentScreen}
//             setFilteredSpotlights={setFilteredSpotlights}
//           />
//         )}
//       </div>
//       <div className="header-nav__item">
//         <Gi3DGlasses
//           className="header-nav__item-logo"
//           onClick={(e) => {
//             e.preventDefault();
//             setCurrentScreen("movies");
//           }}
//         />
//         {isMobile && currentScreen === "movies" ? (
//           <MobileFilters
//             currentScreen={currentScreen}
//             setFilteredMovies={setFilteredMovies}
//           />
//         ) : (
//           <MovieFilters
//             currentScreen={currentScreen}
//             setFilteredMovies={setFilteredMovies}
//           />
//         )}
//       </div>
//       <div className="header-nav__item">
//         <LuPopcorn
//           className="header-nav__item-logo"
//           onClick={(e) => {
//             e.preventDefault();
//             setCurrentScreen("theatres");
//           }}
//         />
//         {isMobile && currentScreen === "theatres" ? (
//           <MobileFilters
//             currentScreen={currentScreen}
//             setFilteredTheatres={setFilteredTheatres}
//           />
//         ) : (
//           <TheatreFilters
//             currentScreen={currentScreen}
//             setFilteredTheatres={setFilteredTheatres}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

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

{
  // import { FaHistory } from "react-icons/fa";
  // import { GoGear } from "react-icons/go";
  // import { RxAvatar } from "react-icons/rx";
  /* <Navbar.Item to={"profile/settings"} className={"header-nav__item"}>
          <Navbar.Icon
            Element={GoGear}
            spanClassName={"header-nav__item__icon-container"}
            iconClassName={"header-nav__item__icon"}
          />
        </Navbar.Item>
        <Navbar.Item
          to={"profile/bookings-history"}
          className={"header-nav__item"}
        >
          <Navbar.Icon
            Element={FaHistory}
            spanClassName={"header-nav__item__icon-container"}
            iconClassName={"header-nav__item__icon"}
          />
        </Navbar.Item> */
}
