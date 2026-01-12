import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import HeaderNav from "../Components/Root/HeaderNav";
import MainNav from "../Components/Root/MainNav";
import Footer from "../Components/Root/Footer";
import Notification from "../Components/UI/Feedbacks/Notification";
import WeatherModal from "../Components/Root/WeatherModal"
import { useSelector } from "react-redux";


export default function Root() {
  const notify = useSelector(state => state.notify.notifications?.at(-1));
  return (
    <>
      {(notify?.message || notify?.head) && (
        <Notification
          key={Date.now()}
          head={notify.head}
          message={notify.message}
          type={notify.type}
        />
      )}
      <WeatherModal/>
      <HeaderNav/>
      <Outlet />
      <MainNav />
      {/* <Footer /> */}
    </>
  );
}
