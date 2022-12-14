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
import { getData, fetchFormById } from "../components/dataget/fetchData";
import { message } from "antd";
import { IoMdReturnLeft } from "react-icons/io";
import { BsPencil } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";
import { link } from "./FormList";
import Spinner from "utilities/spinner";
import FormContent from "components/contents/FormContent";

const Form = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { formId } = useParams();
  const [formData, setFormData] = useState();
  const [linkobj, setLinkobj] = useState();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.global.userId);
  const userList = useSelector((state) => state.global.userList);

  useEffect(() => {
    const lk = link(searchParams.get("type"), userId);
    setLinkobj(lk);
    //fetchData(lk);
    fetchForm(formId, lk);
  }, [formId]);

  async function fetchForm(id, lk) {
    setLoading(true);
    const rtn = await fetchFormById(id, lk);
    setLoading(false);
    if (rtn) {
      setFormData(rtn);
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

  const PageHeader = ({ linkobj }) => {
    const findUserName = () => {
      const user = _.find(userList, (o) => {
        return o.id === userId;
      });
      if (user) return user.name;
    };
    const name = findUserName();
    const usr = `[${name ? name : "N/A"}]`;
    console.log(linkobj);
    return (
      <Header
        title={linkobj?.titleview}
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
                navigate(`/form/edit/${formId}?type=${linkobj.type}`, {
                  replace: true,
                })
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
            {loading && <Spinner />}
            <PageHeader linkobj={linkobj} />
            <FormContent lk={linkobj} formdt={formData} />
          </Body>
        </div>
      </div>
    </>
  );
};

export default Form;
