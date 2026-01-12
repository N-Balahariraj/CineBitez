import React, { useEffect, useMemo } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function countBookedSeats(seatStatus) {
  if (!seatStatus) return 0;
  const entries = Object.values(seatStatus); // Map -> plain object in JSON
  return entries.reduce((acc, seat) => acc + (seat?.status === "booked" ? 1 : 0), 0);
}

export default function AdminDashboard() {
  const { movies = [], theatres = [], showSessions = [] } =
    useRouteLoaderData("home") || {};
 
  useEffect(()=>{},[movies, theatres, showSessions])

  const movieById = useMemo(() => {
    const map = new Map();
    for (const m of movies) map.set(String(m?._id), m);
    return map;
  }, [movies]);

  const theatreById = useMemo(() => {
    const map = new Map();
    for (const t of theatres) map.set(String(t?._id), t);
    return map;
  }, [theatres]);

  const rowData = useMemo(() => {
    const sessions = Array.isArray(showSessions) ? showSessions : [];
    return sessions.map((s) => {
      const movie = movieById.get(String(s?.movieId));
      const theatre = theatreById.get(String(s?.theatreId));

      return {
        sessionId: s?._id ?? "",
        movie: movie?.movie ?? "Unknown",
        theatre: theatre?.name ?? "Unknown",
        hall: s?.hallId ?? "-",
        start: s?.startTime ?? null,
        end: s?.endTime ?? null,
        price: s?.price ?? "-", // getter makes it a string like "12.00"
        bookedSeats: countBookedSeats(s?.seatStatus),
      };
    });
  }, [showSessions, movieById, theatreById]);

  const columnDefs = useMemo(
    () => [
      { headerName: "Movie", field: "movie", filter: true, sortable: true, flex: 1, minWidth: 180 },
      { headerName: "Theatre", field: "theatre", filter: true, sortable: true, flex: 1, minWidth: 180 },
      { headerName: "Hall", field: "hall", filter: true, sortable: true, width: 110 },
      {
        headerName: "Start",
        field: "start",
        filter: true,
        sortable: true,
        valueFormatter: (p) => formatDateTime(p.value),
        minWidth: 190,
      },
      {
        headerName: "End",
        field: "end",
        filter: true,
        sortable: true,
        valueFormatter: (p) => formatDateTime(p.value),
        minWidth: 190,
      },
      { headerName: "Price", field: "price", filter: true, sortable: true, width: 110 },
      { headerName: "Booked", field: "bookedSeats", filter: true, sortable: true, width: 120 },
      { headerName: "Session ID", field: "sessionId", filter: true, sortable: true, minWidth: 220 },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  return (
    <section className="ag-theme-quartz cine-grid scrollbar-hide">
      <h1 className="admin-dasboard__header">Admin Dasboard</h1>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
      />
    </section>
  );
}
