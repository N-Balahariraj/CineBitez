import React, { useEffect, useRef, useState } from "react";
import Theatre from "../Components/Theatres/Theatre";
import TheatrePreview from "../Components/Theatres/TheatrePreview";
import { useMediaQuery } from "react-responsive";
import TheatreFilters from "../Components/Theatres/TheatreFilters";
import { store } from "../app/store";
import { notifyActions } from "../app/features/notificationSlice";
import {
  useActionData,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import TheatreDetails from "../Components/Theatres/TheatreDetails";
import Forms from "../Components/UI/Forms/Forms";
import TheatreForm from "../Components/Theatres/TheatreForm";
import TheatreHallSeatsForm from "../Components/Theatres/TheatreHallSeatsForm";
import TheatreSessionsForm from "../Components/Theatres/TheatreSessionsForm";
import MovieDetails from "../Components/Movies/MovieDetails";
import { useDispatch, useSelector } from "react-redux";
import { selectionActions } from "../app/features/selectionsSlice";

export default function Theatres() {
  const role = useRouteLoaderData("root").role;
  const { theatres, showSessions } = useRouteLoaderData("home");
  const { theatre: createdTheatre, showSessions: sessions } = useActionData() || {};
  const navigation = useNavigation();
  
  const selectedMovie = useSelector((state) => state.selection.selectedMovie);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectionActions.setSelectedTheatre(theatres?.[0]));
  }, []);

  useEffect(() => {
    setFilteredTheatres(theatres);
    selectionActions.setSelectedTheatre(null);
  }, [createdTheatre,sessions,theatres,showSessions]);

  const [wizardKey, setWizardKey] = useState(0);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [filteredTheatres, setFilteredTheatres] = useState(theatres);
  const [wizardHallsForSessions, setWizardHallsForSessions] = useState([]);

  const [step, setStep] = useState(1);
  const wizardDialogRef = useRef(null);
  const wizardFormRef = useRef(null);

  const isIdle = navigation.state === "idle";
  const isWizardSessionsEnabled =
    !!editingTheatre?._id || (!!createdTheatre?._id && isIdle);

  const isTablet = useMediaQuery({
    query: "(min-width: 40rem) and (max-width: 63.9rem)",
  });

  // dialog open/close
  useEffect(() => {
    if (!wizardDialogRef.current) return;
    try {
      if (isWizardOpen) wizardDialogRef.current.showModal?.();
      else wizardDialogRef.current.close?.();
    } catch {
      // ignore
    }
  }, [isWizardOpen]);

  function openCreateWizard() {
    setWizardKey((k) => k + 1);
    setEditingTheatre(null);
    setWizardHallsForSessions([]);
    setStep(1);
    setIsWizardOpen(true);
  }

  function openEditWizard(theatre) {
    setWizardKey((k) => k + 1);
    setEditingTheatre(theatre);
    setWizardHallsForSessions(theatre?.halls || []);
    setStep(1);
    setIsWizardOpen(true);
  }

  function closeWizard() {
    try {
      wizardFormRef.current?.reset?.();
    } catch {
      // ignore
    }
    setIsWizardOpen(false);
    setEditingTheatre(null);
    setWizardHallsForSessions([]);
    setStep(1);
  }

  function readHallsJson() {
    const form = wizardFormRef.current;
    const raw = (form?.elements?.["halls"]?.value ?? "[]").toString();
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function validateStep1() {
    // IMPORTANT: DO NOT call reportValidity() on entire form; hidden required controls in other steps
    // will trigger "not focusable". Validate only step 1 fields.
    const form = wizardFormRef.current;
    if (!form) return false;

    const step1FieldNames = ["id", "name", "price", "location", "bg"]; // add/remove based on TheatreForm
    for (const name of step1FieldNames) {
      const el = form.elements?.[name];
      if (!el) continue;
      if (typeof el.checkValidity === "function" && !el.checkValidity()) {
        el.reportValidity?.();
        el.focus?.();
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (step === 1) {
      if (!validateStep1()) {
        dispatch(
          notifyActions.openModel({
            head: "Required",
            message: "Please fill all the required* fields.",
            type: "error",
          })
        );
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      const halls = readHallsJson();
      if (!halls.length) {
        dispatch(
          notifyActions.openModel({
            head: "Halls are required*",
            message: "Please add at least one hall before continuing.",
            type: "error",
          })
        );
        return;
      }
      setWizardHallsForSessions(halls);
      setStep(3);
      return;
    }
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <>
      <div className="theatres scrollbar-hide">
        <TheatreFilters theatres={theatres} setFilteredTheatres={setFilteredTheatres}/>
        <TheatrePreview />
        <TheatreDetails />
        {!isTablet && <MovieDetails selectedMovie={selectedMovie} />}

        <div className="theatre scrollbar-hide">
          {filteredTheatres?.map((theatre) => (
            <Theatre
              key={theatre.id}
              theatre={theatre}
              onEditBtnClick={(e) => {
                e.stopPropagation();
                openEditWizard(theatre);
              }}
            />
          ))}

          {role === "admin" && (
            <button
              className="theatre-cards theatre__add-icon"
              onClick={openCreateWizard}
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* WIZARD DIALOG */}
      {(role === "admin" || role === "operator") && (
        <dialog
          className="add-theatre-dialog"
          ref={wizardDialogRef}
          open={!!isWizardOpen}
        >
          <Forms
            key={wizardKey}
            ref={wizardFormRef}
            className="add-theatre-form"
            method="post"
          >
            {/* Note: keep all steps mounted; components should hide themselves based on activeStep */}
            <TheatreForm
              initialData={editingTheatre}
              id={!editingTheatre && theatres?.length + 1}
              activeStep={step}
            />

            <TheatreHallSeatsForm
              activeStep={step}
              theatreId={editingTheatre?._id || ""}
              theatreName={editingTheatre?.name || ""}
              initialHalls={editingTheatre?.halls || []}
              onHallsChange={(payload) =>
                setWizardHallsForSessions(payload || [])
              }
            />

            {isWizardSessionsEnabled && (
              <TheatreSessionsForm
                activeStep={step}
                theatreId={editingTheatre?._id || createdTheatre?._id || ""}
                theatreName={editingTheatre?.name || createdTheatre?.name || ""}
                halls={safeHallsFromTheatre(wizardHallsForSessions)}
                initialSessions={safeSessionsForTheatre(
                  showSessions,
                  editingTheatre?._id || createdTheatre?._id
                )}
                viewOnly={false}
              />
            )}

            <Forms.Fieldset className="form-actions">
              <Forms.Button
                type="button"
                className="btn-secondary"
                onClick={closeWizard}
              >
                Cancel
              </Forms.Button>

              {step > 1 && (
                <Forms.Button
                  type="button"
                  className="btn-secondary"
                  onClick={goBack}
                >
                  Back
                </Forms.Button>
              )}

              {(step === 2 || step === 3) && (
                <Forms.Button
                  type="submit"
                  className="btn-primary disabled:opacity-75"
                  disabled={!isIdle || wizardHallsForSessions.length === 0}
                  name="intent"
                  value={
                    step === 2
                      ? !!editingTheatre
                        ? "edit-theatre"
                        : "create-theatre"
                      : "session"
                  }
                >
                  {isIdle && step === 2 ? "Submit" : "Submit All"}
                  {!isIdle && "Submitting..."}
                </Forms.Button>
              )}

              {step < 3 && (
                <Forms.Button
                  type="button"
                  className="btn-primary disabled:opacity-75"
                  disabled={
                    (step === 2 && !isWizardSessionsEnabled) ||
                    (step === 2 && wizardHallsForSessions.length === 0)
                  }
                  onClick={goNext}
                >
                  {step === 2 ? "Add sessions ?" : "Next"}
                </Forms.Button>
              )}
            </Forms.Fieldset>
          </Forms>
        </dialog>
      )}
    </>
  );
}

function safeHallsFromTheatre(halls) {
  if (!Array.isArray(halls)) return [];
  return halls.map((h) => ({ hallId: h?.hallId || h?.id || String(h) }));
}

function safeSessionsForTheatre(showSessions, theatreId) {
  if (!theatreId) return [];
  const list = Array.isArray(showSessions) ? showSessions : [];
  return list.filter((s) => String(s?.theatreId) === String(theatreId));
}

export async function action({ request }) {
  try {
    const fd = await request.formData();
    let intent = fd.get("intent");

    let showSessions = {};

    if (intent.includes("session")) {
      // Helpers for sessions payload
      function buildSeatStatusFromLayout(layoutTemplate) {
        const seatStatus = {};
        if (!Array.isArray(layoutTemplate)) return seatStatus;

        for (let r = 0; r < layoutTemplate.length; r++) {
          const rowStr = layoutTemplate[r] || "";
          for (let c = 0; c < rowStr.length; c++) {
            const ch = rowStr[c];
            if (ch === "_") continue; // aisle/no-seat

            const seatId = `R${r + 1}C${c + 1}`;
            seatStatus[seatId] = {
              status: "available",
              reservedUntil: null,
              bookingId: null,
            };
          }
        }
        return seatStatus;
      }

      const isLocalId = (id) => String(id || "").startsWith("local-");

      const sessions = JSON.parse(fd.get("sessionsJson") || "[]");
      const halls = JSON.parse(fd.get("halls") || "[]");
      const initialSessionIds = JSON.parse(fd.get("initialSessionIds")) || [];

      const hallById = new Map(halls.map((h) => [String(h.hallId), h]));

      // ---- toCreate ----
      const toCreate = (Array.isArray(sessions) ? sessions : [])
        .filter((s) => isLocalId(s?._id))
        .map((s) => {
          const hall = hallById.get(String(s?.hallId));
          return {
            theatreId: String(s?.theatreId || ""),
            movieId: String(s?.movieId || ""),
            hallId: String(s?.hallId || ""),
            startTime: new Date(s?.startTime),
            endTime: new Date(s?.endTime),
            price: Number(s?.price),
            seatStatus: buildSeatStatusFromLayout(hall?.layoutTemplate),
          };
        });

      // ---- toDelete ----
      const currentDbIds = new Set(
        (Array.isArray(sessions) ? sessions : [])
          .map((s) => String(s?._id || ""))
          .filter((id) => id && !isLocalId(id))
      );

      const toDelete = (
        Array.isArray(initialSessionIds) ? initialSessionIds : []
      )
        .map((id) => String(id || ""))
        .filter(Boolean)
        .filter((id) => !currentDbIds.has(id));

      // execute both (delete first is usually safer)
      const failures = [];

      if (toDelete.length) {
        const res = await fetch(
          "http://localhost:5000/api/flush-showSessions",
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: toDelete }),
          }
        );
        if(!res.ok) failures.push(`Delete failed (${res.status})`)
      }

      if (toCreate.length) {
        const res = await fetch("http://localhost:5000/api/new-showSessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toCreate), // backend supports array insertMany
        });
        if (!res.ok) failures.push(`Create failed (${res.status})`);
        const data = await res.json();
        showSessions = data.showSessions
      }

      if (failures.length) {
        store.dispatch(
          notifyActions.openModel({
            head: "Sessions save failed",
            message: failures.join(" | "),
            type: "error",
          })
        );
        return null;
      }

      store.dispatch(
        notifyActions.openModel({
          head: "Sessions saved",
          message: `Created: ${toCreate.length}, Deleted: ${toDelete.length}`,
          type: "success",
        })
      );

      if(fd.get("id"))
        intent = "edit-theatre"
    }

    const theatreName = fd.get("theatreName");

    // Helpers for Theatre Payload
    const pics = String(fd.get("pics") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Theatre Payload
    const theatrePayload = {
      id: fd.get("id"),
      name: fd.get("name"),
      rating: fd.get("rating"),
      price: fd.get("price"),
      location: fd.get("location"),
      bg: fd.get("bg"),
      pics,
      halls: JSON.parse(fd.get("halls")),
    };

    const OPTIONS_BY_INTENT = {
      "create-theatre": {
        url: "http://localhost:5000/api/new-theatres",
        method: "POST",
        body: theatrePayload,
      },
      "edit-theatre": {
        url: `http://localhost:5000/api/edit-theatre/${encodeURIComponent(
          theatreName || ""
        )}`,
        method: "PUT",
        body: theatrePayload,
      },
      "delete-theatre": {
        url: `http://localhost:5000/api/remove-theatre/${encodeURIComponent(
          theatreName
        )}`,
        method: "DELETE",
      },
    };

    const options = OPTIONS_BY_INTENT[intent];
    if (!options) throw new Response("Invalid intent", { status: 400 });

    const res = await fetch(options.url, {
      method: options.method,
      headers: { "Content-Type": "application/json" },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    console.log(res);

    if (!res.ok) {
      store.dispatch(
        notifyActions.openModel({
          head: "Error !",
          message: `Could not perform ${intent} on theatres`,
          type: "error",
        })
      );
      return new Response(
        JSON.stringify({ message: `Could not perform ${intent} on theatres` }),
        {
          status: 500,
        }
      );
    }

    const { message, theatre } = await res.json();

    store.dispatch(
      notifyActions.openModel({
        head: `${intent}`,
        message: message ?? `${intent} success`,
        type: "success",
      })
    );

    return {
      theatre,
      showSessions
    };
  } catch (error) {
    console.log(error);
  }
  // async function handleRemoveTheatre(name) {
  //   try {
  //     const res = await removeTheatre(name).unwrap();
  //     if (res.error) {
  //       throw new Error(res.error.error);
  //     }
  //     dispatch(
  //       notifyActions.openModel({
  //         head: "Theatre removed",
  //         message: `${
  //           res?.message || "Theatre removed successfully"
  //         }. Refresh to view the change`,
  //         type: "success",
  //       })
  //     );
  //   } catch (error) {
  //     console.log("Error removing theatre : ", error);
  //     dispatch(
  //       notifyActions.openModel({
  //         head: "Operation failed",
  //         message: error?.data?.message || error?.message,
  //         type: "error",
  //       })
  //     );
  //   }
  // }
  // async function handleFormSubmit(payload) {
  //   console.log(
  //     "Theatre form submit payload:",
  //     payload,
  //     "editing:",
  //     !!editingTheatre
  //   );
  //   try {
  //     let res;
  //     if (editingTheatre) {
  //       res = await editTheatre({
  //         theatreName: editingTheatre.name,
  //         theatre: payload,
  //       }).unwrap();
  //     } else {
  //       res = await addNewTheatre(payload).unwrap();
  //     }
  //     console.log("Theatre API response:", res);
  //     dispatch(
  //       notifyActions.openModel({
  //         head: editingTheatre ? "Updated Theatre" : "Added Theatre",
  //         message: res?.message || "Operation successful",
  //         type: "success",
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Theatre API error:", error);
  //     dispatch(
  //       notifyActions.openModel({
  //         head: "Failed",
  //         message: error?.data?.message || error?.message || "Request failed",
  //         type: "error",
  //       })
  //     );
  //   } finally {
  //     setIsAddDialogOpen(false);
  //     setEditingTheatre(null);
  //   }
  // }
}
