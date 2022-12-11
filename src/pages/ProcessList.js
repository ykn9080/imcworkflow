import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";

const ProcessList = () => {
  const PageHeader = () => {
    return <Header title="결재선리스트" />;
  };
  return (
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <Sidebar />
        <Body>
          <PageHeader />
          {/* <Table
            dataSource={tbdata}
            columns={tbcolumn}
            rowClassName={(record) => (record.id === selected ? "ddd" : "")}
          /> */}
        </Body>
      </div>
    </div>
  );
};

export default ProcessList;
