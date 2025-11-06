import React, { useState, useEffect } from "react";
import { FiEdit, FiLogOut, FiTwitter } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaRegSave } from "react-icons/fa";
import { MdOutlinePhotoCamera } from "react-icons/md";
import VolumeSlider from "../Components/Profile/VolumeSlider";
import ThemeToggler from "../Components/Profile/ThemeToggler";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../app/features/authSlice";
import { useEditProfileMutation } from "../app/api/usersApiSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editProfile, { isLoading, isError, error, data }] = useEditProfileMutation();

  const [InputState, setInputState] = useState(true);
  const [ButtonState, setButtonState] = useState("Edit");

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    socials: { instagram: "", facebook: "", twitter: "" },
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        socials: {
          instagram: user.socials?.instagram || "",
          facebook: user.socials?.facebook || "",
          twitter: user.socials?.twitter || "",
        },
      });
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setProfileForm((p) => ({ ...p, socials: { ...p.socials, [key]: value } }));
    } else {
      setProfileForm((p) => ({ ...p, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
      console.log("Profile form : ",profileForm)
      const username = profileForm.username
      const userData = await editProfile({username, user: profileForm}).unwrap();
      console.log("Updated user : ", userData);
      dispatch(authActions.login(userData?.user));
      localStorage.setItem("user", JSON.stringify(userData));
      setProfileForm({
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        bio: userData.bio || "",
        socials: {
          instagram: userData.socials?.instagram || "",
          facebook: userData.socials?.facebook || "",
          twitter: userData.socials?.twitter || "",
        },
      });
      setInputState(true);
      setButtonState("Edit");
    } 
    catch (error) {
      console.log("Error editing profile ", error);
    }
  }

  return (
    <div className="profile">
      <div className="profile__photo">
        <div className="h-[40%] w-[50%] bg-[#354069] m-3 rounded-full hover:opacity-80 cursor-pointer overflow-hidden self-center">
          <img
            src={`/Images/${user.avatar || "ProfileIcon.jpg"}`}
            alt="default avatar"
            className="h-[100%] w-[100%] p-2"
          />
          <div className="w-[100%] h-[100%] flex justify-center items-center z-10 text-white relative bottom-[100%] opacity-5 hover:opacity-100 rounded-full">
            <MdOutlinePhotoCamera className="text-4xl " />
          </div>
        </div>

        <textarea
          name="bio"
          cols="38"
          rows="2"
          placeholder="Few words who you are ?"
          className="text-center rounded-md outline-none"
          value={profileForm.bio}
          readOnly={InputState}
          onChange={handleChange}
        />

        <div className="w-[100%] h-[10%] flex justify-around my-8">
          <button
            className="h-[40px] w-[100px] flex justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            onClick={async (e) => {
              e.preventDefault();
              if (InputState) {
                setInputState(false);
                setButtonState("Update");
              } else {
                // save
                await handleSubmit();
                setInputState(true);
                setButtonState("Edit");
              }
            }}
          >
            {ButtonState}{" "}
            {InputState ? <FiEdit className="mx-1" /> : <FaRegSave className="mx-1" />}
          </button>

          <button
            className="h-[40px] w-[100px] flex justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            onClick={() => {
              dispatch(authActions.logout());
              localStorage.removeItem("user");
            }}
          >
            Log Out
            <FiLogOut className="mx-1" />
          </button>
        </div>
      </div>

      <div className="profile__contact">
        <span className="flex border-b-[1px] py-4">
          Full Name :
          <input
            name="username"
            type="text"
            readOnly={InputState}
            className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            value={profileForm.username}
            onChange={handleChange}
          />
        </span>
        <span className="flex border-b-[1px] py-4">
          Email :
          <input
            name="email"
            type="text"
            readOnly={true}
            className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            value={profileForm.email}
            onChange={handleChange}
          />
        </span>
        <span className="flex border-b-[1px] py-4">
          Phone :
          <input
            name="phone"
            type="text"
            readOnly={InputState}
            className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            value={profileForm.phone}
            onChange={handleChange}
          />
        </span>
        <span className="flex border-b-[1px] py-4">
          Address :
          <input
            name="address"
            type="text"
            readOnly={InputState}
            className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
            value={profileForm.address}
            onChange={handleChange}
          />
        </span>
      </div>

      <div className="profile__social-media">
        <span className="flex items-center border-b-[1px] py-3">
          <FaInstagram className="pr-2 text-2xl" />
          Instagram :
          <input
            name="socials.instagram"
            type="text"
            readOnly={InputState}
            className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
            value={profileForm.socials.instagram}
            onChange={handleChange}
          />
        </span>
        <span className="flex items-center border-b-[1px] py-3">
          <FaFacebookF className="pr-2 text-xl" />
          Facebook :
          <input
            name="socials.facebook"
            type="text"
            readOnly={InputState}
            className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
            value={profileForm.socials.facebook}
            onChange={handleChange}
          />
        </span>
        <span className="flex items-center border-b-[1px] py-3">
          <FiTwitter className="pr-2 text-2xl" />
          Twitter :
          <input
            name="socials.twitter"
            type="text"
            readOnly={InputState}
            className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
            value={profileForm.socials.twitter}
            onChange={handleChange}
          />
        </span>
      </div>

      <div className="profile__settings">
        <span className="flex items-center justify-between p-2 border-b-[1px] box-border text-xl">
          Pesonalize <FiEdit className="text-lg" />
        </span>
        <div className="flex justify-between items-center">
          <button className="h-[40px] w-[100px] text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2">
            Theme
          </button>
          <ThemeToggler />
        </div>
        <div className="flex justify-between items-center">
          <button className="h-[40px] w-[100px] text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md px-2">
            Sound
          </button>
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
