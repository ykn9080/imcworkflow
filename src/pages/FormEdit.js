import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import $ from "jquery";
import { useHistory, useNavigate, useParams } from "react-router-dom";
import { API2 } from "constants";
import { getData } from "../components/dataget/fetchData";
import { message } from "antd";
import CkEditor from "components/editor/ckEditor";
import { BootModal } from "components/modal/BootModal";
import ProcessEditor from "components/process/ProcessEditor";
import { findTaskId } from "components/dataget/findTaskId";

const Form = () => {
  const navigate = useNavigate();
  const { processId } = useParams();
  const [formData, setFormData] = useState();
  const [formId, setFormId] = useState();
  const [modal, setModal] = useState();
  const userId = useSelector((state) => state.global.userId);
  const editorText = useSelector((state) => state.global.editorText);

  const data = "lorem <b>ipsum</b>";
  async function fetchForm() {
    const url2 = `${API2}/findFormbyProcessId/${processId}`;
    let rtn = await getData(url2, "get");
    console.log(processId, rtn);
    if (rtn && rtn.data && rtn.data[0]) {
      setFormData(rtn.data[0]);
      setFormId(rtn.data[0].id);
    }
  }
  useEffect(() => {
    if (processId && processId !== "-1") {
      console.log(processId.toString());
      fetchForm();
    }
    const modal = {
      id: "processBuilder",
      title: "결재선 선택",
      child: <ProcessEditor />,
      evt: saveProcessHandler,
      opt: { dialogClass: "modal-dialog modal-fullscreen" },
    };
    setModal(modal);
  }, []);
  useEffect(() => {
    const newform = { ...formData, html: editorText };
    setFormData(newform);
  }, [editorText]);
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
  const saveDocumentHandler = async () => {
    console.log(processId);
    console.log(formData);
    const curdate = new Date();
    // find taskId from processId;
    // processId===-1이면 신규, 아니면 수정
    const urltsk = `${API2}/task`;
    const urlform = `${API2}/form`;
    let datatsk = {
      name: formData.title,
      descript: formData.descript,
      dueDate: formData.duedate,
    };
    let dataform = {
      formType: formData.formtype,
      title: formData.formtitle,
      html: formData.html,
    };

    if (!formId) {
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
      console.log(urlform);
      setFormId(rtnform.id);
    } else {
      console.log("else");
      // processId가 있으면 수정
      const taskId = await findTaskId(formId, "form");
      console.log(formId, taskId, urltsk);
      getData(`${urltsk}/${taskId}`, "put", datatsk);
      //formId가 있으면 수정
      getData(`${urlform}/${formId}`, "put", dataform);
    }
  };
  const onFormChange = (e, label) => {
    const newform = { ...formData, [label]: e.target.value };
    console.log(newform);
    setFormData(newform);
  };
  const formInput = (
    <form class="text-start">
      <div class="row mb-3">
        <label for="title" class="col-sm-2 col-form-label">
          기안명
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            class="form-control"
            id="title"
            onChange={(e) => {
              onFormChange(e, "title");
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
            onChange={(e) => {
              onFormChange(e, "duedate");
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
      <div class="row mb-3">
        <label for="formtype" class="col-sm-2 col-form-label">
          문서유형
        </label>
        <div class="col-sm-10 text-start">
          <input
            type="text"
            class="form-control"
            id="formtype"
            onChange={(e) => {
              onFormChange(e, "formtype");
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
            onChange={(e) => {
              onFormChange(e, "formtitle");
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
              title="기안작성"
              right={
                <button
                  type="button"
                  class="btn btn-primary ms-1 "
                  onClick={submitHandler}
                >
                  상신
                </button>
              }
            />
            {formInput}
            <CkEditor />

            <div
              class="text-start"
              dangerouslySetInnerHTML={{ __html: editorText }}
            />
            <div class="d-flex justify-content-center mt-3">
              <button
                type="button"
                class="btn btn-light"
                onClick={() =>
                  navigate(`/form/${processId}`, { replace: true })
                }
              >
                미리보기
              </button>
              <button
                type="button"
                class="btn btn-light   ms-1 "
                onClick={saveDocumentHandler}
              >
                임시저장
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
