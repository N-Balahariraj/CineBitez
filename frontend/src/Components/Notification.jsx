import { useEffect, useRef, useState } from "react";

const COUNTDOWN = 5000;

export default function Notification({ head, message, type }) {
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

  function closeNotification() {
    dialogRef.current.close();
  }

  if (remainingTime <= 0) closeNotification();

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
