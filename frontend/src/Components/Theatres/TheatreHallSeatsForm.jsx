import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouteLoaderData } from "react-router-dom";
import Forms from "../UI/Forms/Forms";
import { useDispatch, useSelector } from "react-redux";
import { selectionActions } from "../../app/features/selectionsSlice";

export default function TheatreHallSeatsForm({
  isOpen = false,
  asDialog = false,
  onClose,

  theatreId = "",
  theatreName = "",
  initialHalls = [],

  showSessionId = "",
  pricePerSeat = null,
  initialSessionSeatStatus = null, // expected: { "R1C1": {status:"booked"} ... }
  maxSelectableSeats = null,

  activeStep,
  onHallsChange,
}) {
  const { role } = useRouteLoaderData("root") || {};
  const isUser = role === "user";
  const isStaff = !isUser;
  const dispatch = useDispatch();

  const hideByStep =
    typeof activeStep !== "undefined" && Number(activeStep) !== 2;

  const dialogRef = useRef(null);

  // ----- core state -----
  // halls: [{ hallId, type, rows, cols, grid: boolean[][] }]
  const [halls, setHalls] = useState(() => initHalls(initialHalls));
  const [activeHallIndex, setActiveHallIndex] = useState(0);

  // selected seats per hallId (user): { [hallId]: string[] }
  const [selected, setSelected] = useState({});

  const bookingSelection = useSelector(
    (state) => state.selection.bookingSelection
  );
  const prevContextKey = useRef(null);

  useEffect(() => {
    // If user flow but no session selected yet, do nothing.
    if (isUser && !showSessionId) return;

    const contextKey = `${String(theatreId)}|${String(showSessionId)}`;
    if (prevContextKey.current === contextKey) return;
    prevContextKey.current = contextKey;

    const nextHalls = initHalls(initialHalls);
    setHalls(nextHalls);

    // Default: empty selection for a new session
    let nextSelected = {};
    let nextActiveHallIndex = 0;

    // If we previously CONFIRMED seats for this exact theatre+session, restore them
    const matchesConfirmed =
      bookingSelection &&
      String(bookingSelection.theatreId) === String(theatreId) &&
      String(bookingSelection.showSessionId) === String(showSessionId) &&
      Array.isArray(bookingSelection.seats);

    if (matchesConfirmed) {
      const hallId = bookingSelection.hallId || (nextHalls?.[0]?.hallId ?? "");

      if (hallId) {
        nextSelected = { [hallId]: bookingSelection.seats };
        const idx = nextHalls.findIndex((h) => h.hallId === hallId);
        nextActiveHallIndex = idx >= 0 ? idx : 0;
      }
    }

    setSelected(nextSelected);
    setActiveHallIndex(nextActiveHallIndex);
  }, [theatreId, showSessionId, initialHalls, isUser, bookingSelection]);

  // optional dialog open/close
  useEffect(() => {
    if (!asDialog || !dialogRef.current) return;
    try {
      if (isOpen) dialogRef.current.showModal?.();
      else dialogRef.current.close?.();
    } catch {
      // ignore
    }
  }, [asDialog, isOpen]);

  const activeHall = halls[activeHallIndex];

  // ----- derived values -----
  const hallsPayload = useMemo(() => {
    // staff only: convert grids to layoutTemplate for backend
    return halls.map((h) => ({
      hallId: h.hallId,
      type: h.type,
      layoutTemplate: gridToTemplate(h.grid),
    }));
  }, [halls]);

  useEffect(() => {
    onHallsChange?.(hallsPayload);
  }, [hallsPayload, onHallsChange]);

  const activeSelectedSeats = useMemo(() => {
    if (!activeHall) return [];
    return selected[activeHall.hallId] || [];
  }, [selected, activeHall]);

  const totalAmount = useMemo(() => {
    if (!isUser) return null;
    if (typeof pricePerSeat !== "number") return null;
    return activeSelectedSeats.length * pricePerSeat;
  }, [isUser, pricePerSeat, activeSelectedSeats.length]);

  const totalSeatsInHall = useMemo(() => {
    if (!activeHall) return 0;
    return countSeats(activeHall.grid);
  }, [activeHall]);

  // ----- staff actions -----
  function addHall() {
    const next = {
      hallId: `Hall-${halls.length + 1}`,
      type: "standard",
      rows: 6,
      cols: 10,
      grid: makeGrid(6, 10, true),
    };
    setHalls((p) => [...p, next]);
    setActiveHallIndex(halls.length);
  }

  function removeHall() {
    if (halls.length === 0) return;
    const idx = activeHallIndex;
    setHalls((p) => p.filter((_, i) => i !== idx));
    setActiveHallIndex((p) => Math.max(0, p - 1));
  }

  function updateActiveHall(patch) {
    setHalls((prev) =>
      prev.map((h, i) => (i === activeHallIndex ? { ...h, ...patch } : h))
    );
  }

  function setRowsCols(rows, cols) {
    // resize grid, keep existing values where possible
    setHalls((prev) =>
      prev.map((h, i) => {
        if (i !== activeHallIndex) return h;

        const r = Math.max(1, Math.min(40, Number(rows || 1)));
        const c = Math.max(1, Math.min(40, Number(cols || 1)));
        const nextGrid = resizeGrid(h.grid, r, c, true);

        // if user mode: drop selected seats that are now out of bounds or aisle
        if (isUser) {
          const hallId = h.hallId;
          const kept = (selected[hallId] || []).filter((seatId) => {
            const rc = parseSeatId(seatId);
            if (!rc) return false;
            if (rc.r > r || rc.c > c) return false;
            return nextGrid[rc.r - 1][rc.c - 1] === true;
          });
          setSelected((s) => ({ ...s, [hallId]: kept }));
        }

        return { ...h, rows: r, cols: c, grid: nextGrid };
      })
    );
  }

  // ----- checkbox handling -----
  function isSeatBlocked(seatId) {
    if (!initialSessionSeatStatus) return false;
    const st = initialSessionSeatStatus[seatId];
    return st?.status === "booked" || st?.status === "reserved";
  }

  function toggleCell(rIdx, cIdx, nextChecked) {
    if (!activeHall) return;

    const seatId = `R${rIdx + 1}C${cIdx + 1}`;

    if (isStaff) {
      // staff: checked means seat exists (edit layout)
      const nextGrid = activeHall.grid.map((row, rr) =>
        rr === rIdx
          ? row.map((cell, cc) => (cc === cIdx ? nextChecked : cell))
          : row
      );
      updateActiveHall({ grid: nextGrid });
      return;
    }

    // user: checked means selected seat
    const seatExists = activeHall.grid[rIdx][cIdx] === true;
    if (!seatExists) return;
    if (isSeatBlocked(seatId)) return;

    const hallId = activeHall.hallId;
    const current = selected[hallId] || [];
    const has = current.includes(seatId);

    let next = current;
    if (nextChecked && !has) {
      if (
        typeof maxSelectableSeats === "number" &&
        current.length >= maxSelectableSeats
      )
        return;
      next = [...current, seatId];
    }
    if (!nextChecked && has) {
      next = current.filter((x) => x !== seatId);
    }
    setSelected((s) => ({ ...s, [hallId]: next }));
  }

  // ----- render guards -----
  // user must have showSessionId to book; staff must have theatreId to save
  const submitDisabled = isUser
    ? !showSessionId || activeSelectedSeats.length === 0
    : !theatreId || halls.length === 0;

  const content = (
    <>
      {/* intent is decided by wizard final submit; still keep halls JSON available */}
      {isStaff && (
        <>
          <input
            type="hidden"
            name="halls"
            value={JSON.stringify(hallsPayload)}
          />
        </>
      )}

      {/* For user booking flow this component is used elsewhere; wizard is staff */}
      {/* Keep the existing Fieldset UI */}
      <Forms.Fieldset
        legend={
          isUser
            ? `Select Seats${theatreName ? ` • ${theatreName}` : ""}`
            : `Edit Halls${theatreName ? ` • ${theatreName}` : ""}`
        }
        legendClassName="form-title"
        className={`form-grid ${hideByStep ? "hidden" : ""}`}
      >
        {/* hall tabs */}
        <div className="col-span-full" style={styles.row}>
          <div style={styles.tabs}>
            {halls.map((h, i) => (
              <button
                key={`${h.hallId}-${i}`}
                type="button"
                className="btn-secondary"
                style={i === activeHallIndex ? styles.tabActive : styles.tab}
                onClick={() => setActiveHallIndex(i)}
              >
                {h.hallId}
              </button>
            ))}
          </div>

          {isStaff && (
            <div style={styles.actions}>
              <button type="button" className="btn-primary" onClick={addHall}>
                + Add Hall
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={removeHall}
                disabled={halls.length === 0}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {!activeHall && isStaff && (
          <div className="full" style={styles.note}>
            Add at least one hall to start.
          </div>
        )}

        {activeHall && (
          <>
            <Forms.Input
              label="Hall ID"
              type="text"
              disabled={isUser}
              value={activeHall.hallId}
              onChange={(e) => updateActiveHall({ hallId: e.target.value })}
            />

            <Forms.Input
              label="Type"
              type="text"
              disabled={isUser}
              value={activeHall.type}
              onChange={(e) => updateActiveHall({ type: e.target.value })}
            />

            <Forms.Input
              label="Rows"
              type="number"
              min="1"
              max="40"
              disabled={isUser}
              value={activeHall.rows}
              onChange={(e) => setRowsCols(e.target.value, activeHall.cols)}
            />

            <Forms.Input
              label="Columns"
              type="number"
              min="1"
              max="40"
              disabled={isUser}
              value={activeHall.cols}
              onChange={(e) => setRowsCols(activeHall.rows, e.target.value)}
            />

            <div className="full" style={styles.note}>
              {isStaff ? (
                <>
                  Total seats in this hall: <strong>{totalSeatsInHall}</strong>
                </>
              ) : (
                <>
                  Selected: <strong>{activeSelectedSeats.length}</strong>
                  {typeof totalAmount === "number" ? (
                    <>
                      {" "}
                      • Amount: <strong>{totalAmount.toFixed(2)}</strong>
                    </>
                  ) : null}
                </>
              )}
            </div>

            {/* grid */}
            <div className="full" style={styles.gridWrap}>
              <div
                style={{
                  ...styles.grid,
                  gridTemplateColumns: `repeat(${activeHall.cols}, 22px)`,
                }}
              >
                {activeHall.grid.map((row, rIdx) =>
                  row.map((isSeat, cIdx) => {
                    const seatId = `R${rIdx + 1}C${cIdx + 1}`;

                    const checked = isStaff
                      ? isSeat
                      : activeSelectedSeats.includes(seatId);
                    const disabled = isStaff
                      ? false
                      : !isSeat || isSeatBlocked(seatId);

                    return (
                      <label
                        key={`${rIdx}-${cIdx}`}
                        style={{
                          ...styles.cell,
                          ...(isSeat ? styles.seatCell : styles.aisleCell),
                          ...(!isStaff && checked ? styles.selectedCell : null),
                          ...(disabled ? styles.disabledCell : null),
                          ...(!isStaff && isSeatBlocked(seatId)
                            ? styles.blockedCell
                            : null),
                        }}
                        title={seatId}
                      >
                        <input
                          type="checkbox"
                          name={`R${rIdx + 1}C${cIdx + 1}`}
                          value={`${rIdx + 1},${cIdx + 1}`}
                          checked={checked}
                          disabled={disabled}
                          onChange={(e) =>
                            toggleCell(rIdx, cIdx, e.target.checked)
                          }
                          style={styles.hiddenCheckbox}
                        />
                      </label>
                    );
                  })
                )}
              </div>

              {/* LEGEND */}
              <div style={styles.legend}>
                {isStaff ? (
                  <>
                    <div style={styles.legendItem}>
                      <span
                        style={{ ...styles.legendSwatch, ...styles.seatCell }}
                      />
                      <span>Seat (checked)</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span
                        style={{ ...styles.legendSwatch, ...styles.aisleCell }}
                      />
                      <span>Aisle (unchecked)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.legendItem}>
                      <span
                        style={{ ...styles.legendSwatch, ...styles.seatCell }}
                      />
                      <span>Available</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span
                        style={{
                          ...styles.legendSwatch,
                          ...styles.selectedCell,
                        }}
                      />
                      <span>Selected</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span
                        style={{ ...styles.legendSwatch, ...styles.aisleCell }}
                      />
                      <span>Aisle</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span
                        style={{
                          ...styles.legendSwatch,
                          ...styles.blockedCell,
                        }}
                      />
                      <span>Booked / Reserved</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Forms.Fieldset>

      {/* NEW: user dialog actions */}
      {isUser && (
        <Forms.Fieldset className="form-actions">
          <Forms.Button
            type="button"
            className="btn-secondary"
            onClick={() => onClose?.()}
          >
            Cancel
          </Forms.Button>

          <Forms.Button
            type="button"
            className="btn-primary"
            disabled={submitDisabled}
            onClick={() => {
              const payload = {
                theatreId,
                theatreName,
                showSessionId,
                hallId: activeHall?.hallId ?? "",
                seats: activeSelectedSeats,
                pricePerSeat:
                  typeof pricePerSeat === "number" ? pricePerSeat : null,
                totalAmount:
                  typeof totalAmount === "number" ? totalAmount : null,
              };

              dispatch(selectionActions.setBookingSelection(payload));
              onClose?.();
            }}
          >
            Confirm Seats
          </Forms.Button>
        </Forms.Fieldset>
      )}
    </>
  );

  if (typeof activeStep !== "undefined") return content;

  const dialogUi = (
    <dialog
      className="add-theatre-dialog"
      ref={dialogRef}
      open={!!isOpen}
      onCancel={(e) => {
        // ESC closes modal -> keep React state in sync
        e.preventDefault();
        onClose?.();
      }}
      onClose={() => onClose?.()}
    >
      <div className="add-theatre-form">{content}</div>
    </dialog>
  );

  // When used as a dialog (user flow), render it at document.body level
  if (asDialog) return createPortal(dialogUi, document.body);

  return dialogUi;
}

/* ========= minimal helpers ========= */

// initialHalls (from backend) -> editable halls (with bool grid)
function initHalls(initialHalls) {
  if (!initialHalls?.length) return [];
  return initialHalls.map((h, i) => {
    const tpl = h.layoutTemplate?.length ? h.layoutTemplate : null;
    const rows = tpl ? tpl.length : 6;
    const cols = tpl ? tpl[0].length : 10;
    const grid = tpl
      ? tpl.map((rowStr) => rowStr.split("").map((ch) => ch !== "_"))
      : makeGrid(rows, cols, true);
    return {
      hallId: h.hallId || `Hall-${i + 1}`,
      type: h.type || "standard",
      rows,
      cols,
      grid,
    };
  });
}

function makeGrid(rows, cols, value) {
  const r = Number(rows);
  const c = Number(cols);
  return Array.from({ length: r }, () =>
    Array.from({ length: c }, () => value)
  );
}

function resizeGrid(oldGrid, rows, cols, defaultValue) {
  const next = makeGrid(rows, cols, defaultValue);
  for (let r = 0; r < Math.min(rows, oldGrid.length); r++) {
    for (let c = 0; c < Math.min(cols, oldGrid[0].length); c++) {
      next[r][c] = oldGrid[r][c];
    }
  }
  return next;
}

function gridToTemplate(grid) {
  return grid.map((row) => row.map((v) => (v ? "A" : "_")).join(""));
}

function countSeats(grid) {
  let n = 0;
  for (const row of grid) for (const cell of row) if (cell) n++;
  return n;
}

function parseSeatId(seatId) {
  const m = /^R(\d+)C(\d+)$/.exec(seatId);
  if (!m) return null;
  return { r: Number(m[1]), c: Number(m[2]) };
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  tabs: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  actions: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },

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

  note: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "0.6rem",
  },

  gridWrap: { overflow: "auto", paddingBottom: "0.5rem" },
  grid: { display: "grid", gap: "6px", width: "max-content" },

  cell: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.18)",
    position: "relative",
  },
  hiddenCheckbox: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    margin: 0,
    cursor: "pointer",
  },

  seatCell: { background: "rgba(255,255,255,0.12)" },
  aisleCell: {
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.16)",
  },

  selectedCell: {
    background: "var(--primary-linear-gradient)",
    border: "1px solid rgba(255,255,255,0.28)",
  },
  disabledCell: { opacity: 0.6, cursor: "not-allowed" },
  blockedCell: {
    background: "rgba(255, 90, 90, 0.20)",
    border: "1px solid rgba(255, 90, 90, 0.30)",
  },

  legend: {
    display: "flex",
    gap: "0.9rem",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: "0.65rem",
    opacity: 0.95,
    fontSize: "0.9rem",
  },
  legendItem: { display: "inline-flex", gap: "0.4rem", alignItems: "center" },
  legendSwatch: { width: "14px", height: "14px", borderRadius: "4px" },
};
