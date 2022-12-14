import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";

const Setting = () => {
  const PageHeader = () => {
    return <Header title="환경설정" />;
  };
  return (
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <Sidebar />
        <Body>
          <PageHeader />
        </Body>
      </div>
    </div>
  );
};

export default Setting;
