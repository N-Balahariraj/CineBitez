import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { notifyActions } from "../../app/features/notificationSlice";
import { selectionActions } from "../../app/features/selectionsSlice";
import TheatreHallSeatsForm from "../Theatres/TheatreHallSeatsForm";
import Forms from "../UI/Forms/Forms";
import { BiMoviePlay } from "react-icons/bi";
import { TbCalendarPin } from "react-icons/tb";
import { MdOutlineCurtains } from "react-icons/md";

export default function SplashForm() {
  const userId = useRouteLoaderData("root")?._id; // assuming logged-in user
  const { movies, theatres, showSessions } = useRouteLoaderData("home");

  const bookingSelection = useSelector(
    (state) => state.selection.bookingSelection
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const activeSessions = useMemo(() => {
    const now = Date.now();
    return showSessions.filter((s) => new Date(s.endTime).getTime() >= now);
  }, [showSessions]);

  const [movieId, setMovieId] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [location, setLocation] = useState("");
  const [isSeatDialogOpen, setIsSeatDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const theatreById = useMemo(
    () => new Map(theatres.map((t) => [t._id, t])),
    [theatres]
  );

  const lockedLocation = theatreId ? theatreById.get(theatreId)?.location : "";
  const effectiveLocation = lockedLocation || location;

  useEffect(() => {
    if (lockedLocation) setLocation(lockedLocation);
  }, [lockedLocation]);

  const sessionsFor = useCallback((ignore = []) =>
    activeSessions.filter((s) => {
      if (!ignore.includes("movie") && movieId && s.movieId !== movieId)
        return false;
      if (!ignore.includes("theatre") && theatreId && s.theatreId !== theatreId)
        return false;
      if (!ignore.includes("date") && date && s.startTime.slice(0, 10) !== date)
        return false;
      if (!ignore.includes("location") && effectiveLocation) {
        return theatreById.get(s.theatreId)?.location === effectiveLocation;
      }
      return true;
    }),
    [activeSessions, movieId, theatreId, date, effectiveLocation, theatreById]
  );

  const sessionToBook = useMemo(() => {
    if (!movieId || !theatreId) return null;

    let list = activeSessions.filter(
      (s) => s.movieId === movieId && s.theatreId === theatreId
    );

    if (date) list = list.filter((s) => s.startTime.slice(0, 10) === date);
    if (effectiveLocation) {
      list = list.filter(
        (s) => theatreById.get(s.theatreId)?.location === effectiveLocation
      );
    }

    list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    return list[0] || null;
  }, [
    activeSessions,
    movieId,
    theatreId,
    date,
    effectiveLocation,
    theatreById,
  ]);

  const initialHallsForSession = useMemo(() => {
    if (!selectedSession) return [];
    const theatre = theatreById.get(selectedSession.theatreId);
    return theatre.halls.filter((h) => h.hallId === selectedSession.hallId);
  }, [selectedSession, theatreById]);

  const pricePerSeat = selectedSession ? Number(selectedSession.price) : null;

  const hasSeatSelection =
    bookingSelection &&
    selectedSession &&
    bookingSelection.theatreId === selectedSession.theatreId &&
    bookingSelection.showSessionId === selectedSession._id &&
    bookingSelection.totalAmount != null;

  const theatreOptions = useMemo(() => {
    const ids = new Set(sessionsFor(["theatre"]).map((s) => s.theatreId));
    return theatres
      .filter((t) => ids.has(t._id))
      .map((t) => ({ value: t._id, label: t.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [theatres, sessionsFor]);

  const movieOptions = useMemo(() => {
    const ids = new Set(sessionsFor(["movie"]).map((s) => s.movieId));
    return movies
      .filter((m) => ids.has(m._id))
      .map((m) => ({ value: m._id, label: m.movie }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [movies, sessionsFor]);

  const dateOptions = useMemo(() => {
    const keys = new Set(
      sessionsFor(["date"]).map((s) => s.startTime.slice(0, 10))
    );
    return Array.from(keys)
      .sort()
      .map((d) => ({ value: d, label: d }));
  }, [sessionsFor]);

  const locationOptions = useMemo(() => {
    if (lockedLocation) return [{ value: lockedLocation, label: lockedLocation }];

    const theatreIds = new Set(sessionsFor(["location"]).map((s) => s.theatreId));
    const locs = new Set(theatres.filter((t) => theatreIds.has(t._id)).map((t) => t.location));

    return Array.from(locs).sort().map((l) => ({ value: l, label: l }));
  }, [lockedLocation, theatres, sessionsFor]);

  // auto-clear if current selection becomes invalid
  useEffect(() => {
    if (movieId && !movieOptions.some((o) => o.value === movieId))
      setMovieId("");
  }, [movieId, movieOptions]);

  useEffect(() => {
    if (theatreId && !theatreOptions.some((o) => o.value === theatreId))
      setTheatreId("");
  }, [theatreId, theatreOptions]);

  useEffect(() => {
    if (date && !dateOptions.some((o) => o.value === date)) setDate("");
  }, [date, dateOptions]);

  useEffect(() => {
    if (
      !lockedLocation &&
      location &&
      !locationOptions.some((o) => o.value === location)
    ) {
      setLocation("");
    }
  }, [location, locationOptions, lockedLocation]);

  async function confirmBooking() {
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const payload = {
        userId,
        showSessionId: bookingSelection.showSessionId,
        seats: bookingSelection.seats,
        totalAmount: bookingSelection.totalAmount,
      };

      const res = await fetch(`${apiUrl}/new-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking failed");

      const data = await res.json();

      dispatch(
        notifyActions.openModel({
          head: "Booked Your Tickets",
          message: data.message || "Tickets booked successfully",
          type: "success",
        })
      );

      dispatch(selectionActions.clearBookingSelection());
      setMovieId("");
      setTheatreId("");
      setDate("");
      setLocation("");
      setIsSeatDialogOpen(false);
      setSelectedSession(null);
    } catch (e) {
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
    <Forms className="discover__form">
      <span className="text-xl font-bold">Get Your Ticket</span>

      <Forms.Fieldset
        className="h-[60px] flex border-[1px] rounded-md px-3"
        legend="Choose Your Movie "
        legendClassName="flex gap-2 text-center"
        Icon={BiMoviePlay}
        iconClassName="h-[23px] w-[23px] hover:cursor-pointer"
      >
        <Forms.Selection
          name="movieId"
          className="w-[100%] mt-2 outline-none bg-transparent"
          options={movieOptions}
          optionsClassName="bg-[#0b122e]"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        />
      </Forms.Fieldset>

      <Forms.Fieldset
        className="h-[60px] flex border-[1px] rounded-md px-3"
        legend="Choose Your Theatre "
        legendClassName="flex gap-2 text-center"
        Icon={MdOutlineCurtains}
        iconClassName="h-[23px] w-[23px] hover:cursor-pointer"
      >
        <Forms.Selection
          name="theatreId"
          className="w-[100%] mt-2 outline-none bg-transparent"
          options={theatreOptions}
          optionsClassName="bg-[#0b122e]"
          value={theatreId}
          onChange={(e) => setTheatreId(e.target.value)}
        />
      </Forms.Fieldset>

      <Forms.Fieldset
        className="h-[60px] flex justify-between border-[1px] rounded-md px-3"
        legend="Date and Location "
        legendClassName="flex gap-2 text-center"
        Icon={TbCalendarPin}
        iconClassName="h-[23px] w-[23px] hover:cursor-pointer"
      >
        <Forms.Selection
          name="date"
          className="outline-none bg-[#0b122e] rounded-md h-[35px] w-[47%] text-center px-3"
          options={dateOptions}
          optionsClassName="bg-[#0b122e]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
        />

        <Forms.Selection
          name="location"
          className="outline-none bg-[#0b122e] rounded-md h-[35px] w-[47%] text-center px-3"
          options={locationOptions}
          optionsClassName="bg-[#0b122e]"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={!!lockedLocation}
          placeholder="Location"
        />
      </Forms.Fieldset>

      <Forms.Button
        type="button"
        disabled={!sessionToBook && !hasSeatSelection}
        onClick={() => {
          if(!userId){
            dispatch(notifyActions.openModel({
              head: "Forbidden",
              message: "Login or SignUp to book your seats",
              type: "error"
            }));
            navigate("/auth");
            return;
          }
          if (hasSeatSelection) {
            confirmBooking();
            return;
          }
          setSelectedSession(sessionToBook);
          setIsSeatDialogOpen(true);
        }}
        className="h-[40px] w-[100%] rounded-md bg-[image:var(--primary-linear-gradient)] text-white disabled:bg-[image:var(--alpha-linear-gradient)] disabled:cursor-not-allowed"
      >
        {hasSeatSelection
          ? `Confirm Booking for ₹ ${Number(
              bookingSelection.totalAmount
            ).toFixed(2)}`
          : "Select Your Seats"}
      </Forms.Button>

      {selectedSession && (
        <TheatreHallSeatsForm
          asDialog
          isOpen={isSeatDialogOpen}
          onClose={() => setIsSeatDialogOpen(false)}
          theatreId={selectedSession.theatreId}
          theatreName={theatreById.get(selectedSession.theatreId)?.name}
          initialHalls={initialHallsForSession}
          showSessionId={selectedSession._id}
          pricePerSeat={pricePerSeat}
          initialSessionSeatStatus={selectedSession.seatStatus}
        />
      )}
    </Forms>
  );
}
