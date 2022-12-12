import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import axios from "axios";
import _ from "lodash";
import {
  useHistory,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { API2 } from "constants";
import { getData } from "../components/dataget/fetchData";
import { message } from "antd";
import { IoMdReturnLeft } from "react-icons/io";
import { BsPencil } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";
import { link } from "./FormList";

const Form = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { formId } = useParams();
  const [formData, setFormData] = useState();
  const [linkobj, setLinkobj] = useState();
  const userId = useSelector((state) => state.global.userId);
  const userList = useSelector((state) => state.global.userList);

  useEffect(() => {
    const lk = link(searchParams.get("type"), userId);
    setLinkobj(lk);
    fetchData(lk);
  }, [formId]);
  async function fetchData(lk) {
    const url2 = `${API2}/form/${formId}?type=lk.type`;
    let rtn = await getData(url2, "get");
    // getData(`${API2}/docx1`, "get");
    if (rtn?.data) {
      console.log(formId, rtn.data, rtn.data[0]);
      setFormData(rtn.data);
    }
  }
  function getFileToDownload() {
    const link = document.createElement("a");
    link.href = `${API2}/docx1`;
    link.setAttribute("download", "dummy.docx");
    link.click();
  }

  const submitHandler = () => {
    // form에 수정사항 저장
    const data = {};
    //getData(`${API2}/form`, "post", data);
    // activity에 신규추가
    //applyAction();
    // 전체리스트로 가기
    navigate(`/ongoing`, { replace: true });
  };
  // const applyAction = () => {
  //   console.log(processId, "재기안", "");
  //   const url = `${API2}/activityInsert`;
  //   const data = {
  //     processId: processId,
  //     comment: "",
  //     action: "재기안",
  //     userId: userId,
  //   };
  //   const rtn = getData(url, "post", data);
  //   if (rtn) {
  //     console.log(rtn);
  //     message.info("상신되었습니다. ");
  //     dispatchEvent(globalVariable({ onGoing: null }));
  //     navigate(`/ongoing`, { replace: true });
  //   }
  // };
  const PageHeader = () => {
    const findUserName = () => {
      const user = _.find(userList, (o) => {
        return o.id === userId;
      });
      if (user) return user.name;
    };
    const name = findUserName();
    const usr = `[${name ? name : "N/A"}]`;

    return (
      <Header
        title={<>문서보기</>}
        right={
          <>
            <button
              type="button"
              class="btn btn-dark me-1"
              onClick={() => navigate(-1)}
            >
              <IoMdReturnLeft />
            </button>
            <button
              type="button"
              class="btn btn-dark me-1"
              onClick={() =>
                navigate(`/form/edit/${formId}`, { replace: true })
              }
            >
              <BsPencil />
            </button>
            <button
              type="button"
              class="btn btn-dark"
              onClick={getFileToDownload}
            >
              <FaFileDownload />
            </button>
          </>
        }
      />
    );
  };
  const download = async () => {
    const url2 = `${API2}/docx1`;
    const data = {
      html: formData.html,
    };
    await getData(url2, "get");
  };
  console.log(formData);
  return (
    <>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            {/* <div class="d-flex justify-content-between">
              <p class="g-col-6 fw-bold">View</p>
              <button
                type="button"
                class="btn btn-primary"
                onClick={() =>
                  navigate(`/form/edit/${formId}`, { replace: true })
                }
              >
                Edit
              </button>
            </div> */}
            <PageHeader />
            <div dangerouslySetInnerHTML={{ __html: formData?.html }} />
          </Body>
        </div>
      </div>
    </>
  );
};

export default Form;
