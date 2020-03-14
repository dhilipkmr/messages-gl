import React from "react";
import { IoIosMenu } from "react-icons/io";
import Messages from "./containers/Messages";
import "./app.css";
import "./generic.css";
import { MESSAGE_APP_HEADING } from "./constants";

export default function App() {
  return (
    <div>
      <section className="msgHeader">
        <div className="msgHeaderItems">
          <IoIosMenu className="menu" strokeWidth="4" aria-label="Open menu" aria-expanded={false}/>
          <h1 className="msgTxt">{MESSAGE_APP_HEADING}</h1>
        </div>
      </section>
      <section className="messagesThreadWrapper">
        <Messages />
      </section>
    </div>
  );
}
