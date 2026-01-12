import React, { useState } from "react";
import { IoStarSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { useRouteLoaderData } from "react-router-dom";
import Forms from "../UI/Forms/Forms";
import { useDispatch } from "react-redux";
import { selectionActions } from "../../app/features/selectionsSlice";

export default function Theatre({ theatre, onEditBtnClick }) {
  const role = useRouteLoaderData("root").role;
  const dispatch = useDispatch();

  return (
    <div
      className="theatre-cards"
      key={theatre.id}
      onClick={() => {
        dispatch(selectionActions.setSelectedTheatre(theatre));
      }}
    >
      {role === "admin" && (
        <Forms method="post" className="theatre-cards__edit-icons">
          <Forms.Input type="hidden" name="theatreName" value={theatre.name}/>
          <Forms.Button
            className="theatre-cards__edit-icon"
            onClick={onEditBtnClick}
          >
            <MdOutlineModeEdit className="mx-auto" />
          </Forms.Button>
          <Forms.Button
            className="theatre-cards__edit-icon"
            type="submit"
            formAction="/theatres"
            name="intent"
            value="delete-theatre"
          >
            <RiDeleteBin6Line className="mx-auto" />
          </Forms.Button>
        </Forms>
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
  );
}
