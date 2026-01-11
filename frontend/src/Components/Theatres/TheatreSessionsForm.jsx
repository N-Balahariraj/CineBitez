import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import Forms from "../UI/Forms/Forms";

export default function TheatreSessionsForm({
  theatreId = "",
  theatreName = "",
  halls = [],
  initialSessions = [],
  viewOnly = false,
  onClose,
  activeStep,
}) {
  const { movies } = useRouteLoaderData("home") || {};
  // const movies = [{ _id: "abc", duration: 3 * 60 * 60 * 1000, price: 150 }];

  const { role } = useRouteLoaderData("root") || {};
  const isStaff = role === "operator" || role === "admin";
  const canEdit = isStaff && !viewOnly;

  const [activeHallId, setActiveHallId] = useState(halls[0]?.hallId || "");
  const [sessions, setSessions] = useState(() =>
    (initialSessions || []).map((s, idx) => {
      const movie = movies.find((m) => String(m._id) === String(s.movieId));
      const start = toDTLocalValue(s.startTime);
      const end = movie?.duration
        ? toDTLocalValue(
            new Date(
              new Date(s.startTime).getTime() + (movie?.duration || 9000000)
            )
          )
        : "";

      const hydrated = {
        _id: s._id || `local-${idx}`,
        theatreId,
        movieId: String(s.movieId || ""),
        hallId: String(s.hallId || ""),
        startTime: start,
        endTime: end,
        price: movie?.price ?? s.price ?? 0,
      };

      return hydrated;
    })
  );

  // if halls arrive after first render, keep activeHallId meaningful
  useEffect(() => {
    if (!activeHallId && halls?.length) setActiveHallId(halls[0]?.hallId || "");
  }, [halls, activeHallId]);

  const sessionsForHall = useMemo(() => {
    return sessions
      .filter((s) => s.hallId === activeHallId)
      .slice()
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [sessions, activeHallId]);

  const initialSessionIds = useMemo(() => {
    return (initialSessions || [])
      .map((s) => String(s?._id || ""))
      .filter(Boolean);
  }, [initialSessions]);

  const errorBoxRef = useRef(null);

  // Refs for add-session inputs
  const movieIdRef = useRef(null);
  const startTimeRef = useRef(null);

  function showError(msg) {
    if (errorBoxRef.current) errorBoxRef.current.textContent = msg;
  }
  function clearError() {
    if (errorBoxRef.current) errorBoxRef.current.textContent = "";
  }

  function validateSession(next, listForHall) {
    if (!next.movieId) return "movieId is required";
    if (!next.startTime) return "startTime is required";

    const movie = movies.find((m) => String(m._id) === String(next.movieId));
    if (!movie) return "Invalid movieId (movie not found)";

    if (movie.duration <= 0) return "Movie duration is invalid";
    if (movie.price == null || Number(movie.price) < 0)
      return "Movie price is invalid";

    const start = new Date(next.startTime);
    const end = new Date(next.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return "Invalid startTime/endTime";
    if (end <= start) return "endTime must be after startTime";

    const overlaps = listForHall.some((s) => {
      const sStart = new Date(s.startTime);
      const sEnd = new Date(s.endTime);
      return start < sEnd && end > sStart;
    });
    if (overlaps) return "Overlaps with another session in the same hall";

    return null;
  }

  function removeLocal(id) {
    if (!canEdit) return;
    setSessions((prev) => prev.filter((s) => s._id !== id));
  }

  function addLocalFromInputs() {
    if (!canEdit) return;
    if (!activeHallId) return showError("Pick a hall first.");

    const movieId = String(movieIdRef.current?.value || "").trim();
    const startTime = String(startTimeRef.current?.value || "").trim();

    // Requirement: allow "Add to list" only when all required fields for draft are present.
    // Here required fields are movieId and startTime (price/endTime are derived)
    if (!movieId || !startTime) {
      return showError("Please select a movie and start time before adding.");
    }

    const movie = movies.find((m) => String(m._id) === String(movieId));
    if (!movie) return showError("Movie not found.");

    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) return showError("Invalid start time.");

    const end = new Date(start.getTime() + Number(movie?.duration || 9000000));
    const next = {
      _id: `local-${Date.now()}`,
      hallId: activeHallId,
      theatreId,
      movieId,
      startTime,
      endTime: toDTLocalValue(end),
      price: Number(movie.price),
    };

    // embed theatreId only if available (edit flow)
    if (theatreId) next.theatreId = theatreId;

    const err = validateSession(next, sessionsForHall);
    if (err) return showError(err);

    setSessions((prev) => [...prev, next]);

    // clear draft inputs
    if (movieIdRef.current) movieIdRef.current.value = "";
    if (startTimeRef.current) startTimeRef.current.value = "";
    clearError();
  }

  // Wizard submit rule:
  // - allow submit ONLY if draft is empty (no half-filled inputs)
  function handleWizardSubmitCapture(e) {
    if (!canEdit) return;

    const movieId = String(movieIdRef.current?.value || "").trim();
    const startTime = String(startTimeRef.current?.value || "").trim();

    const any = !!(movieId || startTime);
    const all = !!(movieId && startTime);

    if (any && !all) {
      e.preventDefault();
      showError(
        "Incomplete session draft. Either add it to list or clear the fields."
      );
      return;
    }

    if (all) {
      e.preventDefault();
      showError(
        "You have a complete session draft. Click 'Add to list' or clear the fields before submitting."
      );
      return;
    }
  }

  const inner = (
    <>
      {canEdit && (
        <>
          <input
            type="hidden"
            name="sessionsJson"
            value={JSON.stringify(sessions)}
          />
          <input
            type="hidden"
            name="initialSessionIds"
            value={JSON.stringify(initialSessionIds)}
          />
        </>
      )}

      <Forms.Fieldset
        legend={`Sessions${theatreName ? ` •${theatreName}` : ""}`}
        legendClassName="form-title"
        className={`flex flex-col gap-5 ${activeStep !== 3 ? "hidden" : ""}`}
        onSubmitCapture={handleWizardSubmitCapture}
      >
        <div style={styles.tabsRow}>
          {halls.map((h) => (
            <button
              key={h.hallId}
              type="button"
              className="btn-secondary"
              style={activeHallId === h.hallId ? styles.tabActive : styles.tab}
              onClick={() => setActiveHallId(h.hallId)}
            >
              {h.hallId}
            </button>
          ))}
          {halls.length === 0 && (
            <div style={styles.muted}>No halls found.</div>
          )}
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>
            Sessions {activeHallId ? `• ${activeHallId}` : ""}
          </div>

          {sessionsForHall.length === 0 ? (
            <div style={styles.muted}>No sessions for this hall.</div>
          ) : (
            <ul style={styles.list}>
              {sessionsForHall.map((s) => (
                <li key={s._id} style={styles.listItem}>
                  <div>
                    <div>
                      <strong>Theatre:</strong> {s.theatreId}
                    </div>
                    <div>
                      <strong>Movie:</strong> {s.movieId}
                    </div>
                    <div>
                      <strong>Hall:</strong> {s.hallId}
                    </div>
                    <div>
                      <strong>Start:</strong> {formatDT(s.startTime)}
                    </div>
                    <div>
                      <strong>End:</strong> {formatDT(s.endTime)}
                    </div>
                    <div>
                      <strong>Price:</strong> {formatPrice(s.price)}
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => removeLocal(s._id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {canEdit && (
          <div style={styles.panel}>
            <div style={styles.panelTitle}>Add session (this hall)</div>

            <div ref={errorBoxRef} style={styles.error} />

            <div className="form-grid">
              {/* <Forms.Input label="Movie ID*" name="movieId_ui" type="text" ref={movieIdRef} /> */}
              <Forms.Input label="Movie ID*" labelClassName={"full"}>
                <select
                  name="movieId_ui"
                  id="movieId_ui"
                  className="form-select"
                  ref={movieIdRef}
                >
                  {movies.map((movie, i) => (
                    <option key={i} value={movie._id}>{movie.movie}</option>
                  ))}
                </select>
              </Forms.Input>
              <Forms.Input
                label="Start Time*"
                labelClassName="full"
                name="startTime_ui"
                type="datetime-local"
                ref={startTimeRef}
              />

              <Forms.Button
                type="button"
                className="btn-primary col-span-full"
                disabled={!activeHallId}
                onClick={addLocalFromInputs}
              >
                Add to list
              </Forms.Button>
            </div>

            <small>End time &amp; price are derived from selected movie.</small>
          </div>
        )}
      </Forms.Fieldset>
    </>
  );

  if (typeof activeStep !== "undefined") return inner;

  return (
    <Forms className="add-theatre-form" method="post">
      {inner}
      <Forms.Fieldset className="form-actions">
        <Forms.Button type="button" className="btn-secondary" onClick={onClose}>
          Close
        </Forms.Button>
        {canEdit && (
          <Forms.Button
            type="submit"
            className="btn-primary"
            disabled={sessions.length === 0}
          >
            Save Sessions
          </Forms.Button>
        )}
      </Forms.Fieldset>
    </Forms>
  );
}

function toDTLocalValue(v) {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function formatDT(v) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function formatPrice(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  return n.toFixed(2);
}

const styles = {
  tabsRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  tab: {
    padding: "0.35rem 0.6rem",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
  },
  tabActive: {
    padding: "0.35rem 0.6rem",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.28)",
    background: "rgba(255,255,255,0.12)",
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "10px",
    padding: "0.75rem",
  },
  panelTitle: { fontWeight: 700 },
  muted: { opacity: 0.85, fontSize: "0.95rem" },
  list: { margin: 0, paddingLeft: "1.1rem", display: "grid", gap: "0.6rem" },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.75rem",
    alignItems: "start",
  },
  error: { color: "#ff8080", minHeight: "1.2rem" },
};
