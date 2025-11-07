import React, { useEffect, useRef } from "react";

/**
 * MovieForm - uncontrolled form read by FormData on submit.
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSubmit: (payload) => void
 *  - initialData: movie object or null
 *
 * Fields (based on backend movies.model.js):
 *  id, imageUrl, movie (title), languages (comma-separated),
 *  genres (comma-separated), rating, votes (string or number),
 *  price (decimal), pics (repeatable text inputs supported - first used),
 *  trailers (comma-separated)
 */
export default function MovieForm({ isOpen, onClose, onSubmit, initialData = null }) {
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
      // ignore dialog API in unsupported browsers
    }
  }, [isOpen]);

  // populate uncontrolled inputs when dialog opens with initialData
  useEffect(() => {
    if (!isOpen || !formRef.current) return;
    const form = formRef.current;
    if (!initialData) {
      form.reset();
      return;
    }

    const setInput = (name, value) => {
      const el = form.elements[name];
      if (!el) return;
      if ("value" in el) el.value = value ?? "";
    };

    setInput("id", initialData.id ?? "");
    setInput("imageUrl", initialData.imageUrl ?? "");
    setInput("movie", initialData.movie ?? "");
    // languages/genres as comma-separated strings for easy editing
    setInput("languages", Array.isArray(initialData.languages) ? initialData.languages.join(", ") : "");
    setInput("genres", Array.isArray(initialData.genres) ? initialData.genres.join(", ") : "");
    setInput("rating", initialData.rating ?? "");
    setInput("votes", initialData.votes ?? "");
    // price: model uses cents internally; expose decimal to user (if price getter returns string)
    try {
      const priceVal = (typeof initialData.price === "number") ? initialData.price : initialData.price;
      setInput("price", priceVal ?? "");
    } catch { setInput("price", ""); }

    setInput("pics", (initialData.pics && initialData.pics[0]) ? initialData.pics[0] : "");
    setInput("trailers", (initialData.trailers && initialData.trailers.join(", ")) || "");
  }, [isOpen, initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    const pics = fd.getAll("pics").map((v) => (v instanceof File ? v.name : String(v))).filter(Boolean);
    const trailersRaw = fd.get("trailers") ? String(fd.get("trailers")) : "";
    const trailers = trailersRaw ? trailersRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

    const languagesRaw = fd.get("languages") ? String(fd.get("languages")) : "";
    const languages = languagesRaw ? languagesRaw.split(",").map(s => s.trim()) : [];

    const genresRaw = fd.get("genres") ? String(fd.get("genres")) : "";
    const genres = genresRaw ? genresRaw.split(",").map(s => s.trim()) : [];

    const payload = {
      id: fd.get("id") ? Number(fd.get("id")) : undefined,
      imageUrl: fd.get("imageUrl") ? String(fd.get("imageUrl")).trim() : "",
      movie: fd.get("movie") ? String(fd.get("movie")).trim() : "",
      languages,
      genres,
      rating: fd.get("rating") ? Number(fd.get("rating")) : undefined,
      votes: fd.get("votes") ? String(fd.get("votes")).trim() : undefined,
      price: fd.get("price") ? Number(fd.get("price")) : undefined,
      pics,
      trailers,
    };

    if (onSubmit) onSubmit(payload);
    if (onClose) onClose();
  }

  return (
    <dialog className="add-theatre-dialog" ref={dialogRef} open={!!isOpen} role="dialog" aria-modal="true">
      <form ref={formRef} onSubmit={handleSubmit} className="add-theatre-form">
        <h3 className="form-title">{initialData ? "Edit Movie" : "Add New Movie"}</h3>

        <div className="form-grid">
          <label>
            ID*
            <input name="id" type="number" required />
          </label>

          <label>
            Poster URL*
            <input name="imageUrl" type="url" required />
          </label>

          <label>
            Title*
            <input name="movie" type="text" required />
          </label>

          <label>
            Languages (comma separated)*
            <input name="languages" type="text" required />
          </label>

          <label>
            Genres (comma separated)*
            <input name="genres" type="text" required />
          </label>

          <label>
            Rating (0 - 10)
            <input name="rating" type="number" step="0.1" min="0" max="10" />
          </label>

          <label>
            Votes (e.g. 1.2K or 1200)
            <input name="votes" type="text" />
          </label>

          <label>
            Price (e.g. 12.50)*
            <input name="price" type="number" step="0.01" min="0" required />
          </label>

          <label className="full">
            Pictures (one URL input shown; add more by app changes)
            <input name="pics" type="text" placeholder="https://..." />
            <small className="hint">If you have multiple pictures, supply them as separate inputs (advanced).</small>
          </label>

          <label className="full">
            Trailers (comma separated URLs)
            <textarea name="trailers" placeholder="https://youtube.com/... , ..." rows="3" />
            <small className="hint">Comma-separated trailer URLs</small>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save</button>
        </div>
      </form>
    </dialog>
  );
}