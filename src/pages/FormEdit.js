import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import $ from "jquery";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API2 } from "constants";
import { getData } from "../components/dataget/fetchData";
import { message } from "antd";
import CkEditor from "components/editor/ckEditor";
import { BootModal } from "components/modal/BootModal";
import ProcessEditor from "components/process/ProcessEditor";
import { findTaskId } from "components/dataget/findId";
import Spinner from "utilities/spinner";
import moment from "moment";
import { link } from "./FormList";

const Form = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { formId } = useParams();

  const [formData, setFormData] = useState();
  const [formid, setFormid] = useState();
  const [loading, setLoading] = useState(false);
  const [linkobj, setLinkobj] = useState();
  const [modal, setModal] = useState();
  const userId = useSelector((state) => state.global.userId);
  //const editorText = useSelector((state) => state.global.editorText);
  console.log(searchParams.get("type")); // 'name'
  async function fetchForm(id) {
    setLoading(true);
    const url2 = `${API2}/formwithtask/${id}`;
    let rtn = await getData(url2, "get");
    setLoading(false);
    console.log(id, rtn);
    if (rtn && rtn.data && rtn.data[0]) {
      setFormData(rtn.data[0]);
      dispatch(globalVariable({ editorText: rtn.data[0].html }));
    }
  }
  useEffect(() => {
    if (formId !== "new") {
      console.log(formId.toString());
      fetchForm(formId);
    } else {
      setFormData({
        taskName: "",
        descript: "",
        dueDate: "",
        formType: "",
        formTitle: "",
        html: "",
      });
      dispatch(globalVariable({ editorText: "" }));
      console.log("nodata");
    }

    const modal = {
      id: "processBuilder",
      title: "결재선 선택",
      child: <ProcessEditor />,
      evt: saveProcessHandler,
      opt: { dialogClass: "modal-dialog modal-fullscreen" },
    };
    setFormid(formId);
    setModal(modal);
    const lk = link(searchParams.get("type"), userId);
    setLinkobj(lk);
  }, [formId]);

  const submitHandler = () => {
    // form에 수정사항 저장
    const data = {};
    //getData(`${API2}/form`, "post", data);
    // activity에 신규추가
    applyAction();
    // 전체리스트로 가기
    navigate(`/ongoing`, { replace: true });
  };
  const saveProcessHandler = () => {
    console.log("saveProcess");
  };
  const applyAction = async () => {
    const taskId = await findTaskId(formid, "form");
    const url = `${API2}/activityStart/${taskId}`;

    const rtn = getData(url, "get");
    if (rtn) {
      console.log(rtn);
      message.info("상신되었습니다. ");
      navigate(`/ongoing`, { replace: true });
    }
  };
  const saveDocumentHandler = async () => {
    const taskId = await findTaskId(formid, "form");
    console.log(formData);
    const curdate = new Date();
    // find taskId from processId;
    // processId===-1이면 신규, 아니면 수정
    const urltsk = `${API2}/task`;
    const urlform = `${API2}/form`;
    let datatsk = {
      name: formData.taskName,
      descript: formData.descript,
      dueDate: formData.dueDate,
    };
    let dataform = {
      formType: formData.formType,
      title: formData.formTitle,
      html: formData.html,
    };

    if (!taskId) {
      //post new task
      datatsk.creatorId = userId;
      datatsk.createDate = curdate;
      datatsk.status = "notstarted";

      const rtntsk = await getData(urltsk, "post", datatsk);
      console.log(rtntsk);
      //poset new form
      dataform.taskId = rtntsk.id;
      dataform.created = curdate;
      const rtnform = await getData(urlform, "post", dataform);
    } else {
      console.log("else");
      // processId가 있으면 수정
      const taskId = await findTaskId(formid, "form");
      console.log(formid, taskId, urltsk);
      getData(`${urltsk}/${taskId}`, "put", datatsk);
      //formId가 있으면 수정
      getData(`${urlform}/${formid}`, "put", dataform);
    }
  };
  const saveArchiveHandler = async () => {
    const curdate = new Date();
    let url = `${API2}/formarchive`;
    let method = "post";
    let data = {
      formType: formData.formType,
      title: formData.formTitle,
      html: formData.html,
      created: curdate,
      writerId: userId,
      isOpen: formData.isOpen,
      descript: formData.descript,
    };
    if (formId !== "new") {
      url = `url/${formId}`;
      method = "put";
    }
    const rtnformarchive = await getData(url, method, data);
  };
  const onFormChange = (e, label) => {
    const newform = { ...formData, [label]: e.target.value };
    console.log(newform);
    setFormData(newform);
  };
  const formInput = (
    <form class="text-start">
      {linkobj?.type === "imsi" && (
        <>
          <div class="row mb-3">
            <label for="title" class="col-sm-2 col-form-label">
              기안명
            </label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="title"
                value={formData?.taskName}
                onChange={(e) => {
                  onFormChange(e, "taskName");
                }}
              />
            </div>
          </div>
          <div class="row mb-3">
            <label for="descript" class="col-sm-2 col-form-label">
              설명
            </label>
            <div class="col-sm-10">
              <textarea
                style={{ height: 100 }}
                class="form-control"
                id="descript"
                value={formData?.descript}
                onChange={(e) => {
                  onFormChange(e, "descript");
                }}
              />
            </div>
          </div>
          <div class="row mb-3">
            <label for="duedate" class="col-sm-2 col-form-label">
              완료일
            </label>
            <div class="col-sm-10">
              <input
                type="date"
                class="form-control"
                id="duedate"
                value={formData?.dueDate}
                onChange={(e) => {
                  onFormChange(e, "dueDate");
                }}
              />
            </div>
          </div>
          <div class="row mb-3">
            <label for="process" class="col-sm-2 col-form-label">
              결재선
            </label>
            <div class="col-sm-10 text-start">
              <input
                type="button"
                class="btn btn-dark btn-sm"
                value="결재선 편집"
                id="process"
                onClick={() => {
                  $("#btnModal").click();
                }}
              />
            </div>
          </div>
        </>
      )}
      <div class="row mb-3">
        <label for="formtype" class="col-sm-2 col-form-label">
          문서유형
        </label>
        <div class="col-sm-10 text-start">
          <input
            type="text"
            class="form-control"
            value={formData?.formType}
            id="formtype"
            onChange={(e) => {
              onFormChange(e, "formType");
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label for="formtitle" class="col-sm-2 col-form-label">
          문서제목
        </label>
        <div class="col-sm-10 text-start">
          <input
            type="text"
            class="form-control"
            id="formtitle"
            value={formData?.formTitle}
            onChange={(e) => {
              onFormChange(e, "formTitle");
            }}
          />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">본문</label>
      </div>
    </form>
  );
  return (
    <>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <Header
              title={linkobj?.titleedit}
              right={
                linkobj?.type === "imsi" && (
                  <button
                    type="button"
                    class="btn btn-primary ms-1 "
                    onClick={submitHandler}
                  >
                    상신
                  </button>
                )
              }
            />

            {loading && <Spinner />}
            {formInput}
            <CkEditor />

            <div class="d-flex justify-content-center mt-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  onChange={(e) => {
                    onFormChange(e, "isOpen");
                  }}
                  id="flexCheckDefault"
                />
                <label class="form-check-label" for="flexCheckDefault">
                  공유문서
                </label>
              </div>
              <button
                type="button"
                class="btn btn-light"
                onClick={() => navigate(`/form/${formid}`, { replace: true })}
              >
                미리보기
              </button>
              <button
                type="button"
                class="btn btn-light   ms-1 "
                onClick={saveDocumentHandler}
              >
                {linkobj === "imsi" ? "임시저장" : "저장"}
              </button>
            </div>
          </Body>
        </div>
      </div>
      <BootModal
        id={modal?.id}
        title={modal?.title}
        clickHandler={modal?.evt}
        opt={modal?.opt}
      >
        {modal?.child}
      </BootModal>
      <button
        id="btnModal"
        style={{ display: "none" }}
        data-bs-toggle="modal"
        data-bs-target={`#${modal?.id}`}
      >
        aa
      </button>
    </>
  );
};

export default Form;
