import React, { useEffect } from "react";
import {
  useRouteLoaderData,
  useLoaderData,
  useActionData,
} from "react-router-dom";
import Forms from "../Components/UI/Forms/Forms";
import { store } from "../app/store";
import { notifyActions } from "../app/features/notificationSlice";
import { ImPushpin } from "react-icons/im";

export default function About() {
  const user = useRouteLoaderData("root");
  const { initMsg, content: initialContent } = useLoaderData() || {};
  const { uptMsg, content: updatedContent } = useActionData() || {};
  const isAdmin = user?.role === "admin";
  const Tag = isAdmin ? "textarea" : "span";
  useEffect(() => {}, [updatedContent]);
  return (
    <Forms method="post" className="about scrollbar-hide">
      <span className="text-4xl font-semibold mb-3">About Us</span>
      <Tag
        name="content"
        className="h-[100%] bg-transparent text-justify scrollbar-hide"
      >
        {updatedContent? updatedContent.content : initialContent.content}
      </Tag>
      {isAdmin && (
        <Forms.Button type="submit" className="about__save-btn">
          <ImPushpin className="about__save-icon" />
        </Forms.Button>
      )}
    </Forms>
  );
}

export async function loader({ request, params }) {
  try {
    const res = await fetch("http://localhost:5000/api/site-content/about");
    if (!res.ok) {
      throw new Error("Unable to fetch the site contents");
    }
    return res;
  } 
  catch (e) {
    console.log(e);
    store.dispatch(
      notifyActions.openModel({
        head: "Site Content !",
        message: e.message || "Failed to fetch the site content",
        type: "error",
      })
    );
    return new Response({
      message: e.message || "Unable to fetch the site Content",
    });
  }
}

export async function action({ request, params }) {
  try {
    const fd = await request.formData();
    const content = fd.get("content");
    const res = await fetch("http://localhost:5000/api/site-content/about", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, format: "text" }),
    });
    if (!res.ok) {
      throw new Error("Unable to post the site content");
    }
    store.dispatch(
      notifyActions.openModel({
        head: "Site Content !",
        message: "Updated site content",
        type: "success",
      })
    );
    return res;
  } 
  catch (e) {
    console.log(e);
    store.dispatch(
      notifyActions.openModel({
        head: "Site Content !",
        message: e.message || "Unable to post the site content",
        type: "error",
      })
    );
    return new Response({
      message: e.message || "Unable to post the site content",
    });
  }
}
