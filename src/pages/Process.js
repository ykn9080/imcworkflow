import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProcessEditor from "components/contents/ProcessEditor";
import Sidebar from "components/layout/Sidebar";
import Body from "components/layout/Body";
import Header from "components/layout/Header";

const Process = () => {
  const { processId } = useParams();
  useEffect(() => {
    console.log(processId);
  }, [processId]);
  return (
    <div>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <Header title="결재선 편집" />

            <ProcessEditor />
          </Body>
        </div>
      </div>{" "}
    </div>
  );
};

export default Process;
