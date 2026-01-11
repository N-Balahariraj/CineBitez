import React, { useState } from "react";
import { IoStarSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import TheatreForm from "./TheatreForm";
import {
  useAddNewTheatreMutation,
  useEditTheatreMutation,
  useRemoveTheatreMutation,
} from "../../app/api/theatresApiSlice";
import { notifyActions } from "../../app/features/notificationSlice";
import Shimmer from "../UI/Feedbacks/Shimmer";
import { useRouteLoaderData } from "react-router-dom";

export default function Theatre({ setSelectedTheatre, filteredTheatres }) {
  const [addNewTheatre, addNewTheatreResponse] = useAddNewTheatreMutation();
  const [editTheatre, editTheatreResponse] = useEditTheatreMutation();
  const [removeTheatre, removeTheatreResponse] = useRemoveTheatreMutation();
  const dispatch = useDispatch();
  const role = useRouteLoaderData("root").role;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);

  async function handleRemoveTheatre(name){
    try {
      const res = await removeTheatre(name).unwrap();
      if(res.error){
        throw new Error(res.error.error)
      }
      dispatch(notifyActions.openModel({
        head : "Theatre removed",
        message : `${res?.message || "Theatre removed successfully"}. Refresh to view the change`,
        type : "success"
      }))
    } 
    catch (error) {
      console.log("Error removing theatre : ",error)
      dispatch(notifyActions.openModel({
        head : "Operation failed",
        message : error?.data?.message || error?.message,
        type : "error"
      }))
    }
  }

  async function handleFormSubmit(payload) {
    console.log(
      "Theatre form submit payload:",
      payload,
      "editing:",
      !!editingTheatre
    );

    try {
      let res;
      if (editingTheatre) {
        res = await editTheatre({
          theatreName: editingTheatre.name,
          theatre: payload,
        }).unwrap();
      } else {
        res = await addNewTheatre(payload).unwrap();
      }
      console.log("Theatre API response:", res);
      dispatch(
        notifyActions.openModel({
          head: editingTheatre ? "Updated Theatre" : "Added Theatre",
          message: res?.message || "Operation successful",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Theatre API error:", error);
      dispatch(
        notifyActions.openModel({
          head: "Failed",
          message: error?.data?.message || error?.message || "Request failed",
          type: "error",
        })
      );
    } finally {
      setIsAddDialogOpen(false);
      setEditingTheatre(null);
    }
  }

  return (
    <div className="theatre scrollbar-hide">
      {filteredTheatres?.map((theatre) => {
        return (
          <div
            className="theatre-cards"
            key={theatre.id}
            onClick={() => {
              setSelectedTheatre(theatre);
            }}
          >
            {role === "admin" && (
              <div className="theatre-cards__edit-icons">
                <span
                  className="theatre-cards__edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTheatre(theatre);
                    setIsAddDialogOpen(true);
                  }}
                >
                  <MdOutlineModeEdit className="mx-auto" />
                </span>
                <span
                  className="theatre-cards__edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTheatre(theatre.name);
                  }}
                >
                  <RiDeleteBin6Line className="mx-auto" />
                </span>
              </div>
            )}
            <div className="w-[100%] flex justify-between items-center">
              <span className=" text-lg font-semibold border-b-2 ">
                {theatre.name}
              </span>
              <span className="flex justify-end items-center">
                <IoStarSharp className="mr-1" />
                {theatre.rating}
              </span>
            </div>
            <span>{theatre.location}</span>
          </div>
        )?? <Shimmer />;
      })}

      {role === "admin" && (
        <>
          <button
            className="theatre-cards theatre__add-icon"
            onClick={() => {
              setEditingTheatre(null); // ensure add mode
              setIsAddDialogOpen(true);
            }}
          >
            +
          </button>

          <TheatreForm
            isOpen={isAddDialogOpen}
            initialData={editingTheatre}
            onClose={() => {
              setIsAddDialogOpen(false);
              setEditingTheatre(null);
            }}
            onSubmit={handleFormSubmit}
          />
        </>
      )}
    </div>
  );
}
