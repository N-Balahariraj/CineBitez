import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Profile from "./Pages/Profile.jsx";
import HeaderNav from "./Components/Navbar/HeaderNav.jsx";
import MainNav from "./Components/Navbar/MainNav.jsx";
import { Theatre_Data } from "./Data/Theatre_Data.js";
import { Movie_Data } from "./Data/Movie_Data.js";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [filteredTheatres, setFilteredTheatres] = useState(Theatre_Data);
  const [filteredMovies, setFilteredMovies] = useState(Movie_Data);
  const [filteredSpotlights, setFilteredSpotlights] = useState(Movie_Data);

  return (
    <>
      <Router>
        <HeaderNav
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          setFilteredTheatres={setFilteredTheatres}
          setFilteredMovies={setFilteredMovies}
          setFilteredSpotlights={setFilteredSpotlights}
        />
        <main className="main-content scrollbar-hide">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  currentScreen={currentScreen}
                  filteredTheatres={filteredTheatres}
                  filteredMovies={filteredMovies}
                  filteredSpotlights={filteredSpotlights}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </main>
        <MainNav />
        <footer className="footer">
          <h4> &copy; copyrights </h4>
          <span>All Rights Resesrved</span>
        </footer>
      </Router>
    </>
  );
}
