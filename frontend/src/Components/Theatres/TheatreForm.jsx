import React, { useEffect, useState } from "react";
import Forms from "../UI/Forms/Forms";
import { MdFileUpload } from "react-icons/md";

export default function TheatreForm({ initialData = null, id, activeStep }) {
  // const picsCsv = Array.isArray(initialData?.pics)
  //   ? initialData.pics.filter(Boolean).join(", ")
  //   : "";

  const [bgPreviewUrl, setBgPreviewUrl] = useState(null);

  useEffect(() => {
    setBgPreviewUrl(initialData?.bg);
  }, [initialData]);

  useEffect(() => {
    if (!bgPreviewUrl) return;
    return () => URL.revokeObjectURL(bgPreviewUrl);
  }, [bgPreviewUrl]);

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

      {/* <Forms.Input
        label={"ID*"}
        name="id"
        type="number"
        required
        defaultValue={initialData?.id || id}
        readOnly
      /> */}

      <Forms.Input
        label={"Name*"}
        name="name"
        type="text"
        required
        defaultValue={initialData?.name ?? ""}
      />

      <Forms.Input
        label={"Background image URL*"}
        labelClassName="gap-2"
      >
        <div className="flex gap-5">
          <div className="h-[50px] w-[50px] border-[1px] rounded-full cursor-pointer bg-slate-800 hover:bg-[image:var(--alpha-linear-gradient)]">
            <MdFileUpload className="h-[100%] mx-auto text-xl " />
            <Forms.Input
              id="bgUrl"
              name="bgUrl"
              type="file"
              accept=".jpeg, .jpg, .png"
              required={!initialData}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  return;
                }
                setBgPreviewUrl(URL.createObjectURL(file));
              }}
            />
          </div>
          {bgPreviewUrl && (
            <div className="h-[50px] w-[100px] flex border-2 rounded-md overflow-hidden">
              <img
                src={bgPreviewUrl || ""}
                alt=""
                className="w-[70%]"
              />
              <button
                type="button"
                className="w-[30%] bg-slate-800 font-bold"
                onClick={(e) => {
                  setBgPreviewUrl(null);
                }}
              >
                X
              </button>
            </div>
          )}
        </div>
        <small>allowed types are *.png, *.jpg and *.jpeg</small>
      </Forms.Input>

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

      {/* <Forms.Input
        label={"Background image URL*"}
        labelClassName="full"
        name="bg"
        type="url"
        required
        defaultValue={initialData?.bg ?? ""}
      /> */}

      {/* <Forms.Input
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
      </Forms.Input> */}
    </Forms.Fieldset>
  );
}
