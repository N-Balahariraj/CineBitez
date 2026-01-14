import React from "react";

export default function Fallback() {
  return (
    <section className="app-page-center">
      <div className="app-card app-card--compact">
        <h1 className="app-card__title">Loading...</h1>
        <p className="app-card__subtitle">Please wait a moment.</p>
      </div>
    </section>
  );
}
