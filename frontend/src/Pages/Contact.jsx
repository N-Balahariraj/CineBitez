import React, { useRef, useEffect } from "react";
import Forms from "../Components/UI/Forms/Forms";
import { useRouteLoaderData, useNavigation, useSearchParams } from "react-router-dom";
import { store } from "../app/store";
import { notifyActions } from "../app/features/notificationSlice";

export default function Contact() {
  const user = useRouteLoaderData("root");
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const isAdmin = user.role === "admin";
  const contactFormRef = useRef(null)
  const [searchParams] = useSearchParams();
  const senderName = searchParams.get("name") || "";
  const senderEmail = searchParams.get("email") || "";
  useEffect(()=>{
    if(!isSubmitting){
      contactFormRef.current?.reset();
    }
  },[isSubmitting])
  return (
    <Forms method="post" className="contact scrollbar-hide" ref={contactFormRef}>
      <div className="contact__content">
        <span className="inline-block text-4xl font-semibold my-3">
          Contacts Us
        </span>
        <p>
          Got a question? we would like to hear from you.Send us a message and
          we will reply as soon as possible
        </p>
      </div>
      <Forms.Fieldset className="contact__form">
        <Forms.Input
          label={isAdmin?"Name : ":"Your Name :"}
          name="name"
          type="text"
          className="contact__form-input"
          defaultValue={isAdmin? senderName : user?.username}
          readOnly={!isAdmin}
        />
        <Forms.Input
          label={isAdmin?"Email : ":"Your Email :"}
          name="email"
          type="mail"
          className="contact__form-input"
          defaultValue={isAdmin? senderEmail : user?.email}
          readOnly={!isAdmin}
        />
        <Forms.Input
          label={isAdmin? "Reply to the feedback : " : "Enter your message :"}
          name="feedback"
          className="contact__form-input"
          required
        />
        <Forms.Button
          name="intent"
          value={user?.role === "admin" ? "reply" : "feedback"}
          type="submit"
          className="contact__form-input disabled:opacity-75 "
          disabled={isSubmitting}
        >
          {isAdmin? "Reply" : "Send Message"}
        </Forms.Button>
      </Forms.Fieldset>
    </Forms>
  );
}

export async function action({ request, params }) {
  try {
    const fd = await request.formData();
    const intent = fd.get("intent");
    const feedback = fd.get("feedback").trim();
    if(feedback === ""){
      throw new Error("Feedback cannot be empty field");
    }
    let payload;
    let url = `http://localhost:5000/api/notify/`;
    if (intent === "reply") {
      url += fd.get("name");
      payload = {
        head: "Reply",
        message: `Message from admin : ${feedback}`,
        type: "feedback",
      };
    } 
    else {
      url += `balahariraj`;
      payload = {
        head: "Feedback",
        message: `${fd.get("name")} : ${fd.get("email" )} \n ${fd.get("feedback")}`,
        type: "feedback",
      };
    }
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notifications: [payload] }),
    });
    if (!res.ok) {
      console.log(res);
      throw new Error("Error sending feedback");
    }
    store.dispatch(
      notifyActions.openModel({
        head: "Feedback sent",
        message: "Feedback Sent to the Admin Successfully",
        type: "success"
      })
    )
    return res;
  } 
  catch (e) {
    console.log(e);
    store.dispatch(
      notifyActions.openModel({
        head: "Unable to notify",
        message: e.message || "Feedback not reached the admin!",
        type: "success"
      })
    )
  }
}
