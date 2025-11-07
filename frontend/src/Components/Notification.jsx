import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { notifyActions } from "../app/features/notificationSlice";

const COUNTDOWN = 5000;

export default function Notification({ head, message, type }) {
  const dispatch = useDispatch();

  const [remainingTime, setRemainingTime] = useState(COUNTDOWN);
  const dialogRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // reset timer when a new notification arrives
  useEffect(() => {
    setRemainingTime(COUNTDOWN);
  }, [head, message, type]);

  function closeNotification() {
    dialogRef.current.close();
    dispatch(notifyActions.closeModal());
  }

  useEffect(() => {
    if (remainingTime <= 0) {
      closeNotification();
    }
  }, [remainingTime]);

  return (
    <dialog className={`notification ${type}`} ref={dialogRef} open>
      <button
        type="button"
        className="notification__close"
        onClick={closeNotification}
      >
        X
      </button>
      <h2 className="notification__head">{head}</h2>
      <p className="notification__message">
        {message}
      </p>
      <progress
        className="notification__timer"
        value={remainingTime}
        max={COUNTDOWN}
      ></progress>
    </dialog>
  );
}
