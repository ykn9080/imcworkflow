import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <h1>Homepage</h1>
          </Body>
        </div>
      </div>
    </div>
  );
};
