import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteLoaderData, useLocation, useNavigate } from "react-router-dom";
import { notifyActions } from "../../app/features/notificationSlice";
import { selectionActions } from "../../app/features/selectionsSlice";

export default function TheatreDetails() {
  const userId = useRouteLoaderData("root")?._id;
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTheatre = useSelector(
    (state) => state.selection.selectedTheatre
  );
  const bookingSelection = useSelector(
    (state) => state.selection.bookingSelection
  );

  const dispatch = useDispatch();

  if (!selectedTheatre) {
    return (
      <div className="fallback">
        <span>Selected Theatre is displayed here</span>
      </div>
    );
  }

  const selectionForThisTheatre =
    bookingSelection &&
    String(bookingSelection.theatreId) === String(selectedTheatre._id);

  const seats = selectionForThisTheatre ? bookingSelection?.seats : [];
  const totalAmount = selectionForThisTheatre
    ? bookingSelection.totalAmount
    : null;

  async function confirmBooking(event) {
    event.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;

    if(!userId){
      dispatch(
        notifyActions.openModel({
          head: "Forbidden !",
          message: "Login or SignUp to book your tickets",
          type: "error",
        })
      );
      navigate('/auth');
      return;
    }

    try {
      const payload = {
        userId,
        showSessionId: bookingSelection.showSessionId,
        seats,
        totalAmount,
      };
      const res = await fetch(`${apiUrl}/new-booking`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      if(!res.ok){
        throw new Error("Booking failed due to some issue")
      }
      dispatch(
        selectionActions.clearBookingSelection()
      );
      const {message, newBooking} = await res.json();
      dispatch(
        notifyActions.openModel({
          head: "Booked Your Tickets",
          message: message || "Tickets booked successfully",
          type: "success",
        })
      );
      return newBooking;
    } 
    catch (e) {
      console.log(e);
      dispatch(
        notifyActions.openModel({
          head: "Booking failed !",
          message: e.message || "Booking failed due to some issue",
          type: "error",
        })
      );
    }
  }

  return (
    <div className="theatre__selection-info">
      <span className="my-2 text-center text-2xl font-semibold overflow-scroll scrollbar-hide">
        {selectedTheatre.name}
      </span>
      <span>
        Hall: {(selectionForThisTheatre && bookingSelection?.hallId) || "-"}
      </span>
      <span>Tickets: {seats?.length}</span>
      <span className="overflow-scroll scrollbar-hide">
        Seats: {seats.length ? seats.join(", ") : "-"}
      </span>
      <button
        disabled={!selectionForThisTheatre}
        onClick={confirmBooking}
        className={`rounded h-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 disabled:opacity-75 ${location.pathname.includes("movies")?"hidden":""}`}
      >
        {selectionForThisTheatre
          ? `Confirm Booking for ₹ ${totalAmount?.toFixed(2)}`
          : "Select Your Seats"}
      </button>
    </div>
  );
}
