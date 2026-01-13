// React hooks
import React, { useState, useEffect } from "react";
import {
  redirect,
  useNavigate,
  useNavigation,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";

// Icons
import { FiEdit, FiLogOut, FiTwitter } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaRegSave } from "react-icons/fa";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

// Components
import Forms from "../Components/UI/Forms/Forms";
import VolumeSlider from "../Components/UI/Forms/VolumeSlider";
import ThemeToggler from "../Components/UI/Forms/ThemeToggler";

// Redux-toolkit
import { store } from "../app/store";
import { notifyActions } from "../app/features/notificationSlice";
import { useSelector } from "react-redux";

// utils
import convertTobase64 from "../utils/base64";

export default function Profile() {
  const user = useRouteLoaderData("profile");
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const notifications = useSelector((state) => state.notify.notifications);

  const isSaving = navigation.state === "submitting";
  const [isEditing, setIsEditing] = useState(false);

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  async function logout(event) {
    event.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/edit-account/${user.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notifications }),
        }
      );
      if (!res.ok) {
        console.log(res);
        throw new Error("Unable to logout user");
      }
    } catch (e) {
      console.log("error setting notification : ", e);
      store.dispatch(
        notifyActions.openModel({
          head: "LogOut Failed",
          message: e.message || "Unable to logout user",
          type: "error",
        })
      );
      return;
    }
    localStorage.removeItem("user");
    store.dispatch(
      notifyActions.openModel({
        head: "Logged Out",
        message: "User logged out successfully",
        type: "success",
      })
    );
    store.dispatch(notifyActions.clearNotification());
    navigate("/auth", { replace: true });
  }

  return (
    <Forms
      method={"post"}
      encType="multipart/form-data"
      className="profile scrollbar-hide"
    >
      <Forms.Fieldset className="profile__photo">
        <div className="h-[40%] w-[50%] bg-[#354069] m-3 rounded-full hover:opacity-80 cursor-pointer overflow-hidden self-center">
          <img
            src={avatarPreviewUrl || user?.avatar || `/Images/ProfileIcon.jpg`}
            alt="avatar"
            className="h-[100%] w-[100%] p-2"
          />

          <Forms.Input
            label
            labelClassName="w-[100%] h-[100%] flex justify-center items-center z-10 text-white relative bottom-[100%] opacity-5 hover:opacity-100 rounded-full"
            Element={MdOutlinePhotoCamera}
            elementClassName={`text-4xl ${isEditing?"":"hidden"}`}
            name="avatar"
            type="file"
            accept=".jpeg, .jpg, .png"
            className="hidden"
            disabled={!isEditing}
            multiple={false}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setAvatarPreviewUrl((prev) => prev? prev : user?.avatar);
                return;
              }
              setAvatarPreviewUrl(URL.createObjectURL(file));
            }}
          />
        </div>

        <textarea
          name="bio"
          placeholder="Few words who you are ?"
          className="text-center rounded-md outline-none p-2 text-black"
          defaultValue={user.bio}
          readOnly={!isEditing}
        />

        <Forms.Fieldset className="w-[100%] gap-1 flex justify-around">
          <Forms.Button
            className="h-[40px] w-[100px] flex gap-1 justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            type="button"
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);
                return;
              }
              submit(document.querySelector("form.profile"), {
                method: "post",
              });
              setIsEditing(false);
            }}
          >
            {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
            {isEditing ? <FaRegSave /> : <FiEdit />}
          </Forms.Button>

          <Forms.Button
            className="h-[40px] w-[100px] flex gap-1 justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            type={"button"}
            onClick={logout}
          >
            LogOut
            <FiLogOut />
          </Forms.Button>

          <Forms.Button
            className="h-[40px] w-[100px] flex gap-1 justify-center items-center text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 hover:brightness-90 rounded-md p-2"
            type={"submit"}
            formAction="/profile"
          >
            Remove
            <RiDeleteBin6Line />
          </Forms.Button>
        </Forms.Fieldset>
      </Forms.Fieldset>

      <Forms.Fieldset className="profile__contact">
        <Forms.Input
          label={"Full Name :"}
          labelClassName={"flex border-b-[1px] py-4"}
          name="username"
          type="text"
          readOnly={!isEditing}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          defaultValue={user.username}
        />
        <Forms.Input
          label={"Email :"}
          labelClassName="flex border-b-[1px] py-4"
          name="email"
          type="text"
          readOnly={true}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          defaultValue={user.email}
        />
        <Forms.Input
          label={"Phone :"}
          labelClassName="flex border-b-[1px] py-4"
          name="phone"
          type="text"
          readOnly={!isEditing}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          defaultValue={user.phone}
        />
        <Forms.Input
          label={"Address :"}
          labelClassName="flex border-b-[1px] py-4"
          name="address"
          type="text"
          readOnly={!isEditing}
          className=" w-[50%] h-[30px] rounded-md outline-none ml-auto text-black px-2"
          defaultValue={user.address}
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
          readOnly={!isEditing}
          className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
          defaultValue={user.socials?.instagram}
        />
        <Forms.Input
          label={"Facebook :"}
          labelClassName="flex items-center border-b-[1px] py-3"
          Element={FaFacebookF}
          elementClassName="pr-2 text-xl"
          name="socials.facebook"
          type="text"
          readOnly={!isEditing}
          className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
          defaultValue={user.socials?.facebook}
        />
        <Forms.Input
          label={"Twitter :"}
          labelClassName="flex items-center border-b-[1px] py-3"
          Element={FiTwitter}
          elementClassName="pr-2 text-2xl"
          name="socials.twitter"
          type="text"
          readOnly={!isEditing}
          className="h-[30px] rounded-md  outline-none ml-auto w-[50%] text-black px-2"
          defaultValue={user.socials?.twitter}
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
    // console.log("Updating user");
    const fd = await request.formData();

    const avatar = await convertTobase64(fd.get("avatar"));
    // console.log(avatar)

    const profile = {
      username: fd.get("username"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address: fd.get("address"),
      avatar,
      bio: fd.get("bio"),
      socials: {
        instagram: fd.get("socials.instagram"),
        facebook: fd.get("socials.facebook"),
        twitter: fd.get("socials.twitter"),
      },
    };

    const res = await fetch(
      `http://localhost:5000/api/edit-account/${fd.get("username")}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      }
    );

    if (!res.ok) {
      throw new Error(`${res.status} : ${res.statusText}`);
    }

    const { message, user } = await res.json();

    localStorage.setItem("user", JSON.stringify(user));

    store.dispatch(
      notifyActions.openModel({
        head: "Update Successful",
        message,
        type: "success",
      })
    );
  } catch (error) {
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

export async function removeAccountAction({ request, params }) {
  try {
    const fd = await request.formData();
    const username = fd.get("username");

    const res = await fetch(
      `http://localhost:5000/api/remove-account/${username}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`${res.status} : ${res.statusText}`);
    }

    localStorage.removeItem("user");
    const { message } = await res.json();

    store.dispatch(
      notifyActions.openModel({
        head: "Account removed :(",
        message,
        type: "success",
      })
    );

    redirect("/auth");
  } catch (error) {
    store.dispatch(
      notifyActions.openModel({
        head: "Account not deleted !",
        message: error.message,
        type: "error",
      })
    );

    console.log("Account removal error : ", error);
  }
}
