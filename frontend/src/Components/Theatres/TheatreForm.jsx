import React, { useEffect, useRef } from "react";
import Forms from "../UI/Forms/Forms";

export default function TheatreForm({ initialData = null, id, activeStep }) {
  const picsCsv = Array.isArray(initialData?.pics)
    ? initialData.pics.filter(Boolean).join(", ")
    : "";
  return (
    <Forms.Fieldset
      legend={!id ? "Edit Theatre" : "Add New Theatre"}
      legendClassName={"form-title"}
      className={`form-grid ${activeStep !== 1 && 'hidden'}`}
    >
      <Forms.Input 
        type="hidden"
        name="theatreName"
        value={initialData?.name || ""}
      />

      <Forms.Input
        label={"ID*"}
        name="id"
        type="number"
        required
        defaultValue={initialData?.id || id}
        readOnly
      />

      <Forms.Input
        label={"Name*"}
        name="name"
        type="text"
        required
        defaultValue={initialData?.name ?? ""}
      />

      <Forms.Input
        label={"Rating"}
        name="rating"
        type="number"
        step="0.1"
        min="0"
        max="10"
        defaultValue={initialData?.rating ?? ""}
      />

      <Forms.Input
        label={"Price (e.g. 12.50)*"}
        name="price"
        type="number"
        step="0.01"
        min="0"
        required
        defaultValue={initialData?.price ?? ""}
      />

      <Forms.Input
        label={"Location*"}
        labelClassName="full"
        name="location"
        type="text"
        required
        defaultValue={initialData?.location ?? ""}
      />

      <Forms.Input
        label={"Background image URL*"}
        labelClassName="full"
        name="bg"
        type="url"
        required
        defaultValue={initialData?.bg ?? ""}
      />

      <Forms.Input
        label={"Pictures (repeat this field to add multiple)"}
        labelClassName="full"
      >
        <Forms.Input
          name="pics"
          type="text"
          placeholder="https://..."
          defaultValue={picsCsv}
        />
        <small className="hint">
          Add more "Pictures" inputs if you need multiple URLs.
        </small>
      </Forms.Input>
    </Forms.Fieldset>
  );
}
