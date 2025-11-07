import React, { useEffect, useRef } from "react";

export default function TheatreForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    try {
      if (isOpen) {
        if (typeof dialogRef.current.showModal === "function") dialogRef.current.showModal();
      } else {
        if (typeof dialogRef.current.close === "function") dialogRef.current.close();
      }
    } catch (e) {
      // ignore dialog API errors
    }
  }, [isOpen]);

  // populate form fields when dialog opens with initialData
  useEffect(() => {
    if (!isOpen || !formRef.current) return;
    const form = formRef.current;
    if (!initialData) {
      // reset form for add mode
      form.reset();
      return;
    }

    // set simple inputs
    const setInput = (name, value) => {
      const el = form.elements[name];
      if (!el) return;
      if ("value" in el) el.value = value ?? "";
    };

    setInput("id", initialData.id ?? "");
    setInput("name", initialData.name ?? "");
    setInput("rating", initialData.rating ?? "");
    // price is expected as a number (backend may want cents). convert if needed.
    setInput("price", initialData.price ?? "");
    setInput("location", initialData.location ?? "");
    setInput("bg", initialData.bg ?? "");

    // pics: set first pics input (form currently supports single pics input)
    if (initialData.pics && initialData.pics.length) {
      // remove existing extra pics inputs if any, set first one
      const picsEl = form.elements["pics"];
      if (picsEl) picsEl.value = initialData.pics[0] || "";
    }

    // shows: stringify into textarea
    const showsEl = form.elements["shows"];
    if (showsEl) {
      try {
        showsEl.value = initialData.shows ? JSON.stringify(initialData.shows) : "";
      } catch {
        showsEl.value = "";
      }
    }
  }, [isOpen, initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    // collect pics: supports repeated inputs named "pics"
    const pics = fd.getAll("pics").map((v) => (v instanceof File ? v.name : String(v))).filter(Boolean);

    // shows: try parse JSON from textarea, otherwise empty array
    let shows = [];
    const showsRaw = fd.get("shows");
    if (showsRaw) {
      try {
        const parsed = JSON.parse(showsRaw);
        if (Array.isArray(parsed)) shows = parsed;
      } catch (err) {
        console.warn("Invalid shows JSON, ignoring:", err);
      }
    }

    const payload = {
      id: fd.get("id") ? Number(fd.get("id")) : undefined,
      name: fd.get("name") ? String(fd.get("name")).trim() : "",
      rating: fd.get("rating") ? Number(fd.get("rating")) : undefined,
      price: fd.get("price") ? Number(fd.get("price")) : undefined,
      location: fd.get("location") ? String(fd.get("location")).trim() : "",
      bg: fd.get("bg") ? String(fd.get("bg")).trim() : "",
      pics,
      shows,
    };

    if (onSubmit) onSubmit(payload);
    if (onClose) onClose();
  }

  return (
    <dialog className="add-theatre-dialog" ref={dialogRef} open={!!isOpen}>
      <form ref={formRef} onSubmit={handleSubmit} className="add-theatre-form">
        <h3 className="form-title">Add New Theatre</h3>

        <div className="form-grid">
          <label>
            ID*
            <input name="id" type="number" required />
          </label>

          <label>
            Name*
            <input name="name" type="text" required />
          </label>

          <label>
            Rating
            <input name="rating" type="number" step="0.1" min="0" max="10" />
          </label>

          <label>
            Price (e.g. 12.50)*
            <input name="price" type="number" step="0.01" min="0" required />
          </label>

          <label className="full">
            Location*
            <input name="location" type="text" required />
          </label>

          <label className="full">
            Background image URL*
            <input name="bg" type="url" required />
          </label>

          <label className="full">
            Pictures (repeat this field to add multiple)
            <input name="pics" type="text" placeholder="https://..." />
            <small className="hint">Add more "Pictures" inputs if you need multiple URLs.</small>
          </label>

          <label className="full">
            Shows (JSON array)
            <textarea
              name="shows"
              placeholder='Example: [{"movie":"MovieID","languages":["english"],"showTimings":["07:00 PM"]}]'
              rows="4"
            />
            <small className="hint">Provide shows as JSON array or leave empty.</small>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}