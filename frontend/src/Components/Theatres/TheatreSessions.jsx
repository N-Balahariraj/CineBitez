import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouteLoaderData } from "react-router-dom";
import TheatreHallSeatsForm from "./TheatreHallSeatsForm";

export default function TheatreSessions() {
  const selectedTheatre = useSelector(
    (state) => state.selection.selectedTheatre
  );
  const selectedMovie = useSelector((state) => state.selection.selectedMovie);

  const { movies = [], showSessions: sessions = [] } =
    useRouteLoaderData("home") ?? {};

  const { role } = useRouteLoaderData("root") ?? {};
  const isUser = role === "user";

  const [isSeatDialogOpen, setIsSeatDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const hasHalls =
    Array.isArray(selectedTheatre?.halls) && selectedTheatre.halls.length > 0;

  const [activeDateKey, setActiveDateKey] = useState("");

  const sessionsForTheatre = useMemo(() => {
    if (!selectedTheatre?._id) return [];
    const now = Date.now();
    return sessions.filter(
      (s) =>
        s.theatreId === selectedTheatre._id &&
        new Date(s.endTime).getTime() >= now
    );
  }, [sessions, selectedTheatre?._id]);

  const availableDateKeys = useMemo(() => {
    return Array.from(
      new Set(sessionsForTheatre.map((s) => toDateKey(s.startTime)))
    )
      .filter(Boolean)
      .sort();
  }, [sessionsForTheatre]);

  useEffect(() => {
    if (!availableDateKeys.length) {
      setActiveDateKey("");
      return;
    }
    const todayKey = toDateKey(new Date());
    setActiveDateKey(
      availableDateKeys.find((k) => k >= todayKey) || availableDateKeys[0]
    );
  }, [availableDateKeys, selectedTheatre?._id]);;

  const sessionsForDate = useMemo(() => {
    if (!activeDateKey) return sessionsForTheatre;
    return sessionsForTheatre.filter(
      (s) => toDateKey(s.startTime) === activeDateKey
    );
  }, [sessionsForTheatre, activeDateKey]);

  const hallIdsForSelectedMovieOnDate = useMemo(() => {
    if (!selectedMovie?._id) return null;
    const ids = new Set();
    for (const s of sessionsForDate) {
      if (String(s.movieId) === String(selectedMovie._id)) ids.add(s.hallId);
    }
    return ids;
  }, [sessionsForDate, selectedMovie?._id]);

  const visibleHalls = useMemo(() => {
    if (!hasHalls) return [];
    if (!hallIdsForSelectedMovieOnDate) return selectedTheatre.halls;
    return selectedTheatre.halls.filter((h) =>
      hallIdsForSelectedMovieOnDate.has(h.hallId)
    );
  }, [hasHalls, selectedTheatre?.halls, hallIdsForSelectedMovieOnDate]);

  const [activeHallId, setActiveHallId] = useState(
    () => selectedTheatre?.halls?.[0]?.hallId
  );

  useEffect(() => {
    if (!hasHalls) return;
    const first = visibleHalls?.[0]?.hallId;
    if (!first) {
      setActiveHallId(undefined);
      return;
    }
    const stillValid = visibleHalls.some((h) => h.hallId === activeHallId);
    if (!stillValid) setActiveHallId(first);
  }, [hasHalls, visibleHalls, activeHallId]);

  const sessionsForActiveHall = useMemo(() => {
    if (!activeHallId) return [];
    const list = sessionsForDate.filter((s) => s.hallId === activeHallId);
    const filtered = selectedMovie?._id
      ? list.filter((s) => String(s.movieId) === String(selectedMovie._id))
      : list;

    return filtered
      .slice()
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  }, [sessionsForDate, activeHallId, selectedMovie?._id]);

  const activeMovieName = selectedMovie?.movie;

  const initialHallsForSession = useMemo(() => {
    if (!selectedSession?.hallId) return [];
    const halls = selectedTheatre?.halls ?? [];
    return halls.filter((h) => h.hallId === selectedSession.hallId);
  }, [selectedSession?.hallId, selectedTheatre?.halls]);

  const pricePerSeat = useMemo(() => {
    const v = selectedSession?.price;
    if (v == null) return null;
    return Number(v);
  }, [selectedSession?.price]);

  function handleSessionClick(session) {
    if (!isUser) return;
    setSelectedSession(session);
    setIsSeatDialogOpen(true);
  }

  return (
    <div className="show-timings scrollbar-hide">
      <div className="show-timings__header">
        <div className="show-timings__title">Show Timings</div>
        {activeMovieName ? (
          <div className="show-timings__subtitle">Movie: {activeMovieName}</div>
        ) : (
          <div className="show-timings__subtitle">
            Showing all movies (optional: select a movie to filter)
          </div>
        )}
      </div>

      <div className="show-timings__dates scrollbar-hide">
        {availableDateKeys.map((key) => {
          const d = new Date(`${key}T00:00:00`);
          const isActive = key === activeDateKey;
          return (
            <button
              key={key}
              type="button"
              className={`show-timings__chip ${
                isActive ? "show-timings__chip--active" : ""
              }`}
              onClick={() => setActiveDateKey(key)}
            >
              <span className="show-timings__chip-day">{formatWeekday(d)}</span>
              <span className="show-timings__chip-date">
                {formatMonthDay(d)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="show-timings__halls scrollbar-hide">
        {(visibleHalls ?? []).map((hall) => (
          <button
            key={hall.hallId}
            type="button"
            className={`show-timings__chip ${
              hall.hallId === activeHallId ? "show-timings__chip--active" : ""
            }`}
            onClick={() => setActiveHallId(hall.hallId)}
          >
            {hall.hallId}
          </button>
        ))}
      </div>

      <div className="show-timings__sessions scrollbar-hide">
        {!hasHalls ? (
          <div className="show-timings__empty">No halls available</div>
        ) : !activeHallId ? (
          <div className="show-timings__empty">
            {selectedMovie?._id
              ? "No halls screening this movie for the selected date"
              : "Select a hall"}
          </div>
        ) : sessionsForActiveHall.length === 0 ? (
          <div className="show-timings__empty">
            No sessions for this hall and date
          </div>
        ) : (
          sessionsForActiveHall.map((session) => {
            const movie = movies.find(
              (m) => String(m._id) === String(session.movieId)
            );
            return (
              <div
                key={String(
                  session._id ?? `${session.hallId}-${session.startTime}`
                )}
                className="show-timings__session"
                onClick={() => handleSessionClick(session)}
                role={isUser ? "button" : undefined}
              >
                <div className="show-timings__session-time">
                  {formatTime(session.startTime)}
                </div>
                {!selectedMovie?._id && (
                  <div className="show-timings__session-movie">
                    {movie?.movie ?? "Unknown movie"}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isUser && (
        <TheatreHallSeatsForm
          asDialog
          isOpen={isSeatDialogOpen}
          onClose={() => setIsSeatDialogOpen(false)}
          theatreId={selectedTheatre?._id ?? ""}
          theatreName={selectedTheatre?.name ?? ""}
          initialHalls={initialHallsForSession}
          showSessionId={selectedSession?._id ?? ""}
          pricePerSeat={pricePerSeat}
          initialSessionSeatStatus={selectedSession?.seatStatus ?? null}
        />
      )}
    </div>
  );
}

function toDateKey(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatWeekday(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(d);
}

function formatMonthDay(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
  }).format(d);
}

function formatTime(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
