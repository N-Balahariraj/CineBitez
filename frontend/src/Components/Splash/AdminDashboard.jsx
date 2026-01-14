import React, { useEffect, useMemo } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";

const GRID_BORDER = "color-mix(in srgb, var(--primary-text-color) 12%, transparent)";
const GRID_BORDER_STRONG = "color-mix(in srgb, var(--primary-text-color) 18%, transparent)";

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function countBookedSeats(seatStatus) {
  if (!seatStatus) return 0;
  const entries = Object.values(seatStatus); // Map -> plain object in JSON
  return entries.reduce(
    (acc, seat) => acc + (seat?.status === "booked" ? 1 : 0),
    0
  );
}

export default function AdminDashboard() {
  const {
    movies = [],
    theatres = [],
    showSessions = [],
  } = useRouteLoaderData("home") || {};

  useEffect(() => {}, [movies, theatres, showSessions]);

  const cineTheme = useMemo(() => {
    return themeQuartz.withParams({
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: "14px",
      spacing: "10px",
      borderRadius: "var(--standard-border-radius)",
      borderWidth: "1px",
      borderColor: GRID_BORDER_STRONG,

      backgroundColor: "var(--alpha-bg-color)",
      chromeBackgroundColor: "var(--alpha-bg-color)",
      dataBackgroundColor: "transparent",

      textColor: "var(--primary-text-color)",
      cellTextColor: "var(--primary-text-color)",
      foregroundColor: "var(--primary-text-color)",
      subtleTextColor: "var(--alpha-text-color)",

      accentColor: "var(--primary-text-color)",

      cellHorizontalPadding: "20px",
      headerHeight: "56px",
      rowHeight: "49px",

      headerBackgroundColor: "var(--alpha-bg-color)",
      headerTextColor: "var(--primary-text-color)",
      headerRowBorder: `1px solid ${GRID_BORDER_STRONG}`,
      headerColumnBorder: `1px solid ${GRID_BORDER_STRONG}`,

      rowBorder: `1px solid ${GRID_BORDER}`,
      columnBorder: `1px solid ${GRID_BORDER}`,

      // You already render gradient hover/selection via CSS ::before
      rowHoverColor: "transparent",
      selectedRowBackgroundColor: "transparent",

      menuBackgroundColor: "var(--primary-bg-color)",
      menuTextColor: "var(--primary-text-color)",
      menuBorder: `1px solid ${GRID_BORDER_STRONG}`,
      panelBackgroundColor: "var(--alpha-bg-color)",
      tooltipBackgroundColor: "var(--alpha-bg-color)",
      tooltipTextColor: "var(--primary-text-color)",
    });
  }, []);

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
      {
        headerName: "Movie",
        field: "movie",
        filter: true,
        sortable: true,
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Theatre",
        field: "theatre",
        filter: true,
        sortable: true,
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Hall",
        field: "hall",
        filter: true,
        sortable: true,
        width: 110,
      },
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
      {
        headerName: "Price",
        field: "price",
        filter: true,
        sortable: true,
        width: 110,
      },
      {
        headerName: "Booked",
        field: "bookedSeats",
        filter: true,
        sortable: true,
        width: 120,
      },
      {
        headerName: "Session ID",
        field: "sessionId",
        filter: true,
        sortable: true,
        minWidth: 220,
      },
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
        theme={cineTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
      />
    </section>
  );
}
