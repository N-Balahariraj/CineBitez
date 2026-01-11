import React from "react";
import { useLoaderData } from "react-router-dom";
import { store } from "../../app/store";
import { notifyActions } from "../../app/features/notificationSlice";

function formatTimestamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function statusToAccent(paymentStatus) {
  const s = String(paymentStatus || "").toLowerCase();
  if (s === "paid") return "success";
  if (s === "failed") return "error";
  if (s === "refunded") return "warning";
  return "info";
}

function formatMoneyINR(v) {
  if (v == null) return "-";
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return String(v);
  return `₹ ${n.toFixed(2)}`;
}

function formatSeats(seats) {
  if (!Array.isArray(seats) || seats.length === 0) return "-";
  return seats.join(", ");
}

export default function Bookings() {
  const { message = "", bookings = [] } = useLoaderData() || {};

  return (
    <section className="notifications-page scrollbar-hide">
      <header className="notifications-page__header">
        <div>
          <h1 className="notifications-page__title">Bookings</h1>
          <p className="notifications-page__subtitle">
            {bookings.length ? `${bookings.length} booking(s)` : "No bookings yet"}
            {message ? ` • ${message}` : ""}
          </p>
        </div>
        <div />
      </header>

      {bookings.length === 0 ? (
        <div className="notifications-empty">
          <div className="notifications-empty__card">
            No bookings found for this account.
          </div>
        </div>
      ) : (
        <ul className="notifications-list">
          {bookings.map((b, idx) => {
            const accent = statusToAccent(b?.paymentStatus);
            const when = b?.bookingDate || b?.createdAt;
            const idSuffix = b?._id ? String(b._id).slice(-6) : String(idx + 1);

            return (
              <li
                key={b?._id ?? `booking-${idx}`}
                className={`notifications-card notifications-card--${accent}`}
              >
                <div className="notifications-card__top">
                  <div className="notifications-card__meta">
                    <h2 className="notifications-card__head">
                      Booking #{idSuffix}
                    </h2>
                    {!!formatTimestamp(when) && (
                      <time className="notifications-card__time">
                        {formatTimestamp(when)}
                      </time>
                    )}
                  </div>
                </div>

                <p className="notifications-card__message">
                  <strong>Status:</strong> {b?.paymentStatus ?? "-"}
                </p>

                <p className="notifications-card__message">
                  <strong>Show Session:</strong> {b?.showSessionId ?? "-"}
                </p>

                <p className="notifications-card__message">
                  <strong>Seats:</strong> {formatSeats(b?.seats)}{" "}
                  {Array.isArray(b?.seats) ? `(${b.seats.length})` : ""}
                </p>

                <p className="notifications-card__message">
                  <strong>Total:</strong> {formatMoneyINR(b?.totalAmount)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export async function loader(){
  try{
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const res = await fetch(`http://localhost:5000/api/bookings?userId=${userId}`);
    if(!res.ok){
      throw new Error("Unable to fetch your bookings");
    }
    return res;
  }
  catch(e){
    console.log(e);
    store.dispatch(
      notifyActions.openModel({
        head: "Error !",
        message: "Error fetching bookings",
        type: 'error'
      })
    );
    return null;
  }
}
