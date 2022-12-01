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
          <div style={{ width: 500, height: 100 }}>
            <WorkTable />
          </div>
        </Body>
      </div>
    </div>
  );
};

export default About;
