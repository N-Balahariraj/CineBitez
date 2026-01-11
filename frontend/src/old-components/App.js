import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Profile from "./Pages/Profile.jsx";
import HeaderNav from "./Components/Root/HeaderNav.jsx";
import MainNav from "./Components/Root/MainNav.jsx";
import Authenticate from "./Pages/Authenticate.jsx";
import { useGetMoviesQuery } from "./app/api/moviesApiSlice.js";
import { useGetTheatresQuery } from "./app/api/theatresApiSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./app/features/authSlice.js";
import Notification from "./Components/UI/Feedbacks/Notification.jsx";

export default function App() {
  const {
    data: movieData = {},
    isError: movieDataError,
    isLoading: movieDataLoading,
  } = useGetMoviesQuery();
  const {
    data: theatreData = {},
    isError: theatreDataError,
    isLoading: theatreDataLoading,
  } = useGetTheatresQuery();

  const { message: movieDataStatus = " ", movies: Movies_Data = [] } =
    movieData || {};
  const { message: theatreDataStatus = " ", theatres: Theatres_Data = [] } =
    theatreData || {};
  const { message: userDataStatus = " ", user: User_Data = {} } =
    JSON.parse(localStorage.getItem("user")) || {};

  const [currentScreen, setCurrentScreen] = useState("splash");
  const [filteredTheatres, setFilteredTheatres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSpotlights, setFilteredSpotlights] = useState([]);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const notify = useSelector((state) => state.notify);
  // console.log(notify);

  // console.log("movieData : ",Movies_Data)
  // console.log("theatreData : ",Theatres_Data)

  useEffect(() => {
    if (Movies_Data) {
      setFilteredSpotlights(Movies_Data);
      setFilteredMovies(Movies_Data);
    }
    if (Theatres_Data) {
      setFilteredTheatres(Theatres_Data);
    }
    if (Object.keys(User_Data).length) {
      dispatch(authActions.login(User_Data));
    }
  }, []);

  return (
    <>
      <Router>
        {(notify?.message || notify?.head) && (
          <Notification
            key={notify.head}
            head={notify.head}
            message={notify.message}
            type={notify.type}
          />
        )}
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
            <Route
              path="/Profile"
              element={isAuthenticated ? <Profile /> : <Authenticate />}
            />
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
