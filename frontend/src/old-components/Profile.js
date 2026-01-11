import React, { useState, useEffect } from "react";
import { FiEdit, FiLogOut, FiTwitter } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaRegSave } from "react-icons/fa";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import VolumeSlider from "../Components/UI/Forms/VolumeSlider";
import ThemeToggler from "../Components/UI/Forms/ThemeToggler";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../app/features/authSlice";
import { notifyActions } from "../app/features/notificationSlice";
import {
  useEditProfileMutation,
  useRemoveAccountMutation,
} from "../app/api/usersApiSlice";
import Forms from "../Components/UI/Forms/Forms";
import { store } from "../app/store";
import { useRouteLoaderData } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editProfile, editProfileResponse] = useEditProfileMutation();
  const [removeAccount, removeAccountResponse] = useRemoveAccountMutation();
  const userData = useRouteLoaderData("profile");
  console.log("User data : ",userData);

  const [InputState, setInputState] = useState(false);
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
      setProfileForm((p) => ({
        ...p,
        socials: { ...p.socials, [key]: value },
      }));
    } else {
      setProfileForm((p) => ({ ...p, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
      console.log("Profile form : ", profileForm);
      const username = profileForm.username;
      const userData = await editProfile({
        username,
        user: profileForm,
      }).unwrap();
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
      dispatch(
        notifyActions.openModel({
          head: "Update Successfull",
          message: userData?.message,
          type: "error",
        })
      );
    } catch (err) {
      console.log("Error editing profile ", err);
      dispatch(
        notifyActions.openModel({
          head: "Update failed",
          message: err?.data?.message || err?.message,
          type: "error",
        })
      );
    }
  }

  return (
    <Forms method={"post"} className="profile">
      <Forms.Fieldset className="profile__photo">
        <div className="h-[40%] w-[50%] bg-[#354069] m-3 rounded-full hover:opacity-80 cursor-pointer overflow-hidden self-center">
          <img
            src={`/Images/ProfileIcon.jpg`}
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

        <Forms.Fieldset className="w-[100%] h-[10%] flex justify-around my-8">
          <Forms.Button
            className="h-[40px] w-[100px] flex justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            type="submit"
            // onClick={async (e) => {
            //   e.preventDefault();
            //   if (InputState) {
            //     setInputState(false);
            //     setButtonState("Update");
            //   } else {
            //     // save
            //     // await handleSubmit();
            //     setInputState(true);
            //     setButtonState("Edit");
            //   }
            // }}
          >
            {/* {ButtonState}{" "}
            {InputState ? (
              <FiEdit className="mx-1" />
            ) : (
              <FaRegSave className="mx-1" />
            )} */}
            edit
          </Forms.Button>

          <Forms.Button
            className="h-[40px] w-[100px] flex justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            onClick={() => {
              dispatch(authActions.logout());
              localStorage.removeItem("user");
              dispatch(
                notifyActions.openModel({
                  head: "Logged Out",
                  message: "User logged out successfully",
                  type: "success",
                })
              );
            }}
          >
            Log Out
            <FiLogOut className="mx-1" />
          </Forms.Button>

          <Forms.Button
            className="h-[40px] w-[100px] flex justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            onClick={async () => {
              try {
                const data = await removeAccount(profileForm.username);
                dispatch(authActions.logout());
                localStorage.removeItem("user");
                dispatch(
                  notifyActions.openModel({
                    head: "Account removed",
                    message: data?.message,
                    type: "success",
                  })
                );
              } catch (error) {
                console.log(error);
                dispatch(
                  notifyActions.openModel({
                    head: "Account removal failed",
                    message: error?.data?.message || error?.message,
                    type: "error",
                  })
                );
              }
            }}
          >
            Remove
            <RiDeleteBin6Line className="mx-1" />
          </Forms.Button>
        </Forms.Fieldset>
      </Forms.Fieldset>

      <Forms.Fieldset className="profile__contact">
        <Forms.Input
          label={"Full Name :"}
          labelClassName={"flex border-b-[1px] py-4"}
          name="username"
          type="text"
          readOnly={InputState}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          value={profileForm.username}
          onChange={handleChange}
        />
        <Forms.Input
          label={"Email :"}
          labelClassName="flex border-b-[1px] py-4"
          name="email"
          type="text"
          readOnly={true}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          value={profileForm.email}
          onChange={handleChange}
        />
        <Forms.Input
          label={"Phone :"}
          labelClassName="flex border-b-[1px] py-4"
          name="phone"
          type="text"
          readOnly={InputState}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          value={profileForm.phone}
          onChange={handleChange}
        />
        <Forms.Input
          label={"Address :"}
          labelClassName="flex border-b-[1px] py-4"
          name="address"
          type="text"
          readOnly={InputState}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          value={profileForm.address}
          onChange={handleChange}
        />
      </Forms.Fieldset>

      <Forms.Fieldset className="profile__social-media">
        <Forms.Input
          label={"Instagram :"}
          labelClassName="flex items-center border-b-[1px] py-3"
          Element={FaInstagram}
          elementClassName="pr-2 text-2xl"
          name="socials.instagram"
          type="text"
          readOnly={InputState}
          className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
          value={profileForm.socials.instagram}
          onChange={handleChange}
        />
        <Forms.Input
          label={"Facebook :"}
          labelClassName="flex items-center border-b-[1px] py-3"
          Element={FaFacebookF}
          elementClassName="pr-2 text-xl"
          name="socials.facebook"
          type="text"
          readOnly={InputState}
          className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
          value={profileForm.socials.facebook}
          onChange={handleChange}
        />
        <Forms.Input
          label={"Twitter :"}
          labelClassName="flex items-center border-b-[1px] py-3"
          Element={FiTwitter}
          elementClassName="pr-2 text-2xl"
          name="socials.twitter"
          type="text"
          readOnly={InputState}
          className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
          value={profileForm.socials.twitter}
          onChange={handleChange}
        />
      </Forms.Fieldset>

      <Forms.Fieldset
        className="profile__settings gap-5"
        legend={"Pesonalize"}
        legendClassName={"flex items-center gap-2 p-2 text-xl"}
        Icon={FiEdit}
        iconClassName="text-lg"
      >
        <div className="flex justify-between items-center">
          <span className="h-[40px] w-[100px] text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-md p-2">
            Theme
          </span>
          <ThemeToggler />
        </div>
        <div className="flex justify-between items-center">
          <span className="h-[40px] w-[100px] text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-md px-2">
            Sound
          </span>
          <VolumeSlider />
        </div>
      </Forms.Fieldset>
    </Forms>
  );
}

export async function action({ request, params }) {
  try {
    console.log("Updating user")
    const fd = await request.formData();

    const profile = {
      username: fd.get("username"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address: fd.get("address"),
      bio: fd.get("bio"),
      socials: {
        instagram: fd.get("socials.instagram"),
        facebook: fd.get("socials.facebook"),
        twitter: fd.get("socials.twitter"),
      },
    };

    console.log("profile",profile);

    // const res = await fetch(
    //   `http://localhost:5000/api/edit-account/${fd.get("username")}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(profile),
    //   }
    // );

    // if (!res.ok) {
    //   throw new Error(`${res.status} : ${res.statusText}`);
    // }

    // const { message, user } = await res.json();

    // localStorage.setItem("user", user);

    // store.dispatch(
    //   notifyActions.openModel({
    //     head: "Update Successful",
    //     message,
    //     type: "success",
    //   })
    // );
  } 
  catch (error) {
    store.dispatch(
      notifyActions.openModel({
        head: "Update failed !",
        message: error.message || "Unable to update your profile",
        type: "error",
      })
    );

    console.log("Update profile error : ", error);
  }
}
