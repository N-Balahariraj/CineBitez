import React, { useState } from "react";
import { FiEdit, FiLogOut, FiTwitter } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaRegSave } from "react-icons/fa";
import { MdOutlinePhotoCamera } from "react-icons/md";
import ContinuousSlider from "./VolumeSlider";
import ThemeToggler from "./ThemeToggler";

export default function Profile() {
  const [InputState, setInputState] = useState("readOnly");
  const [ButtonState, setButtonState] = useState("Edit");

  return (
    <div className="Profile  w-[90vw] h-[90vh] flex absolute top-3 left-24">
      <div className="Pics-and-Options w-[35%] h-[100%] flex flex-col items-center bg-[#181f3b] my-4 mx-2 border-2 border-gray-400 rounded-lg">
        <div className="h-[40%] w-[50%] bg-[#354069] m-3 rounded-full hover:opacity-80 cursor-pointer overflow-hidden">
          <img
            src="/ProfileIcon.jpg"
            alt="ProfileIcon"
            className="h-[100%] w-[100%] p-2"
          />
          <div className="w-[100%] h-[100%] flex justify-center items-center z-10 text-white relative bottom-[100%] opacity-5 hover:opacity-100 rounded-full">
            <MdOutlinePhotoCamera className="text-4xl " />
          </div>
        </div>
        <textarea
          cols="38"
          rows="2"
          placeholder="Few words who you are ?"
          className="text-center rounded-md outline-none"
        ></textarea>
        <div className="w-[100%] h-[10%] flex justify-around my-8">
          <button
            className="h-[40px] w-[100px] flex justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            onClick={(e) => {
              if (InputState) {
                setInputState("");
                setButtonState("Update");
              } else {
                setInputState("readOnly");
                setButtonState("Edit");
              }
            }}
          >
            {ButtonState}{" "}
            {InputState ? (
              <FiEdit className="mx-1" />
            ) : (
              <FaRegSave className="mx-1" />
            )}
          </button>
          <button
            className="h-[40px] w-[100px] flex justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            onClick={""}
          >
            Log Out
            <FiLogOut className="mx-1" />
          </button>
        </div>
        <div className="w-[100%] h-[40%] flex flex-col justify-around p-2 text-white">
          <span className="flex items-center justify-between p-2 border-b-[1px] box-border text-xl">
            Pesonalize <FiEdit className="text-lg" />
          </span>
          <div className="flex justify-between items-center">
            <button className="h-[40px] w-[100px] text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2">
              Theme
            </button>
            <ThemeToggler/>
          </div>
          <div className="flex justify-between items-center">
            <button className="h-[40px] w-[100px] text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md px-2">
              Sound
            </button>
            <ContinuousSlider />
          </div>
        </div>
      </div>
      <div className="Profile-Details w-[65%] h-[100%] flex flex-col justify-between m-4">
        <div className="Personal-Details w-[100%] h-[59%] flex flex-col text-white bg-[#181f3b] border-2 border-gray-400 rounded-lg px-10 py-3">
          <span className="flex border-b-[1px] py-4">
            Full Name :
            <input
              type="text"
              readOnly={InputState}
              className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            />
          </span>
          <span className="flex border-b-[1px] py-4">
            Email :
            <input
              type="text"
              readOnly={InputState}
              className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            />
          </span>
          <span className="flex border-b-[1px] py-4">
            Phone :
            <input
              type="text"
              readOnly={InputState}
              className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            />
          </span>
          <span className="flex border-b-[1px] py-4">
            Address :
            <input
              type="text"
              readOnly={InputState}
              className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            />
          </span>
        </div>
        <div className="Contact-Details w-[100%] h-[39%] flex flex-col text-white bg-[#181f3b] border-2 border-gray-400 rounded-lg px-10 py-3">
          <span className="flex items-center border-b-[1px] py-3">
            <FaInstagram className="pr-2 text-2xl" />
            Instagram :
            <input
              type="text"
              readOnly={InputState}
              className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
            />
          </span>
          <span className="flex items-center border-b-[1px] py-3">
            <FaFacebookF className="pr-2 text-xl" />
            Facebook :
            <input
              type="text"
              readOnly={InputState}
              className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
            />
          </span>
          <span className="flex items-center border-b-[1px] py-3">
            <FiTwitter className="pr-2 text-2xl" />
            Twitter :
            <input
              type="text"
              readOnly={InputState}
              className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
