import React, { useEffect, useRef } from "react";
import Forms from "../UI/Forms/Forms";

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
export default function MovieForm({ isOpen, onClose, initialData = null }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    try {
      if (isOpen) {
        if (typeof dialogRef.current.showModal === "function")
          dialogRef.current.showModal();
      } else {
        if (typeof dialogRef.current.close === "function")
          dialogRef.current.close();
      }
    } catch (e) {
      // ignore dialog API in unsupported browsers
    }
  }, [isOpen]);

  const defaults = {
    id: initialData?.id ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    movie: initialData?.movie ?? "",
    languages: Array.isArray(initialData?.languages)
      ? initialData.languages.join(", ")
      : "",
    genres: Array.isArray(initialData?.genres)
      ? initialData.genres.join(", ")
      : "",
    rating: initialData?.rating ?? "",
    votes: initialData?.votes ?? "",
    price: initialData?.price ?? "",
    duration: initialData?.duration ? (initialData.duration/(1000*60*60)).toFixed(2) : "",
    pics: initialData?.pics?.[0] ?? "",
    trailers: Array.isArray(initialData?.trailers)
      ? initialData.trailers.join(", ")
      : "",
  };

  return (
    <dialog
      className="add-theatre-dialog"
      ref={dialogRef}
      open={!!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <Forms
        key={initialData?.id ?? "new"}
        method={"post"}
        className="add-theatre-form"
      >
        <Forms.Fieldset
          legend={initialData ? "Edit Movie" : "Add New Movie"}
          legendClassName={"form-title"}
          className="form-grid"
        >
          <Forms.Input
            type="hidden"
            name="movieName"
            value={initialData?.movie ?? ""}
          />

          <Forms.Input
            label={"ID*"}
            name="id"
            type="number"
            required
            defaultValue={defaults.id}
          />

          <Forms.Input
            label={"Title*"}
            name="movie"
            type="text"
            required
            defaultValue={defaults.movie}
          />

          <Forms.Input
            label={"Duration (In hours)*"} 
            name="duration"
            type="number"
            step="0.01"
            required
            defaultValue={defaults.duration}
          />

          <Forms.Input
            label={"Languages (comma separated)*"}
            name="languages"
            type="text"
            required
            defaultValue={defaults.languages}
          />

          <Forms.Input
            label={"Genres (comma separated)*"}
            name="genres"
            type="text"
            required
            defaultValue={defaults.genres}
          />

          <Forms.Input
            label={"Rating (0 - 10)"}
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            defaultValue={defaults.rating}
          />

          <Forms.Input
            label={"Votes (e.g. 1.2K or 1200)"}
            name="votes"
            type="text"
            defaultValue={defaults.votes}
          />

          <Forms.Input
            label={"Price (e.g. 12.50)*"}
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaults.price}
          />
                    
          <Forms.Input
            label={"Poster URL*"}
            labelClassName="full"
            name="imageUrl"
            type="url"
            required
            defaultValue={defaults.imageUrl}
          />

          <Forms.Input
            label={"Pictures (one URL input shown; add more by app changes)"}
            labelClassName="full"
          >
            <Forms.Input
              name="pics"
              type="text"
              placeholder="https://..."
              defaultValue={defaults.pics}
            />
            <small className="hint">
              If you have multiple pictures, supply them as separate inputs
              (advanced).
            </small>
          </Forms.Input>

          <Forms.Input
            label="Trailers (comma separated URLs)"
            labelClassName="full"
          >
            <textarea
              name="trailers"
              placeholder="https://youtube.com/... , ..."
              rows="3"
              defaultValue={defaults.trailers}
            />
            <small className="hint">Comma-separated trailer URLs</small>
          </Forms.Input>
        </Forms.Fieldset>

        <Forms.Fieldset className="form-actions">
          <Forms.Button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </Forms.Button>
          <Forms.Button
            type="submit"
            name="intent"
            value={initialData ? "update" : "create"}
            className="btn-primary"
          // onClick={onClose}
          >
            Save
          </Forms.Button>
        </Forms.Fieldset>
      </Forms>
    </dialog>
  );
}
