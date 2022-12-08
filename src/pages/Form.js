import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import { useHistory, useNavigate, useParams } from "react-router-dom";
import { API2 } from "constants";
import { getData } from "../components/dataget/fetchData";
import { message } from "antd";

const Form = () => {
  const navigate = useNavigate();
  const { processId } = useParams();
  const [formData, setFormData] = useState();
  const userId = useSelector((state) => state.global.userId);
  const data = "lorem <b>ipsum</b>";
  async function fetchData() {
    const url2 = `${API2}/findFormbyProcessId/${processId}`;
    let rtn = await getData(url2, "get");
    console.log(processId, rtn);
    if (rtn && rtn.data) setFormData(rtn.data[0]);
  }
  useEffect(() => {
    fetchData();
  }, []);
  const submitHandler = () => {
    // form에 수정사항 저장
    const data = {};
    //getData(`${API2}/form`, "post", data);
    // activity에 신규추가
    applyAction();
    // 전체리스트로 가기
    navigate(`/ongoing`, { replace: true });
  };
  const applyAction = () => {
    console.log(processId, "재기안", "");
    const url = `${API2}/activityInsert`;
    const data = {
      processId: processId,
      comment: "",
      action: "재기안",
      userId: userId,
    };
    const rtn = getData(url, "post", data);
    if (rtn) {
      console.log(rtn);
      message.info("상신되었습니다. ");
      dispatchEvent(globalVariable({ onGoing: null }));
      navigate(`/ongoing`, { replace: true });
    }
  };
  return (
    <>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <div class="d-flex justify-content-between">
              <p class="g-col-6 fw-bold">View</p>
              <button
                type="button"
                class="btn btn-primary"
                onClick={() =>
                  navigate(`/form/edit/${processId}`, { replace: true })
                }
              >
                Edit
              </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: formData?.html }} />
            {formData?.html}
          </Body>
        </div>
      </div>
    </>
  );
};

export default Form;
