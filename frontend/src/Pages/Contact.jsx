import React from "react";

export default function Contacts() {
  return (
    <div className="contact">
      <div className="contact__content">
        <span className="inline-block text-4xl font-semibold my-3">Contacts Us</span>
        <p>
          Got a question? we would like to hear from you.Send us a message and
          we will reply as soon as possible
        </p>
      </div>
      <form className="contact__form">
        <label>Name : </label>
        <input type="text" className="contact__form-input" />
        <label>Email : </label>
        <input type="mail" className="contact__form-input" />
        <label>Enter your message : </label>
        <textarea className="contact__form-input" />
        <button className="contact__form-input">Send Message</button>
      </form>
    </div>
  );
}
