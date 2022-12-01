import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";

const Contact = () => {
  return (
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <Sidebar />
        <Body>
          <h1>Contact</h1>
        </Body>
      </div>
    </div>
  );
};

export default Contact;
