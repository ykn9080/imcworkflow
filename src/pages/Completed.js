import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import WorkTable from "../components/Table";

const About = () => {
  return (
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <Sidebar />
        <Body>
          <WorkTable />
        </Body>
      </div>
    </div>
  );
};

export default About;
