import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import $ from "jquery";
import _ from "lodash";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API2 } from "constants";
import { getData, fetchFormById } from "../components/dataget/fetchData";
import { message, Tooltip, Popconfirm, Button } from "antd";
import CkEditor from "components/editor/ckEditor";
import { BootModal } from "components/modal/BootModal";
import ProcessEditor from "components/contents/ProcessEditor";
import { findTaskId } from "components/dataget/findId";
import Spinner from "utilities/spinner";
import moment from "moment";
import { link } from "./FormList";
import { DrawProcess } from "components/contents/ProcessEditor";
import FormContent from "components/contents/FormContent";
import FormListComponent from "components/contents/FormListComponent";
import { RxMagnifyingGlass } from "react-icons/rx";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import axios from "axios";

const FormEdit = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { formId } = useParams();

  const [formData, setFormData] = useState();
  const [formid, setFormid] = useState();
  const [loading, setLoading] = useState(false);
  const [linkobj, setLinkobj] = useState();
  const [modal, setModal] = useState();
  const [drawDiagram, setDrawDiagram] = useState();
  const userId = useSelector((state) => state.global.userId);
  const processArray = useSelector((state) => state.global.processArray);
  const editorText = useSelector((state) => state.global.editorText);
  console.log(searchParams.get("type")); // 'name'

  async function fetchForm(id, lk) {
    setLoading(true);
    const rtn = await fetchFormById(id, lk);
    setLoading(false);
    if (rtn) {
      console.log(rtn);
      setFormData(rtn);
      dispatch(globalVariable({ editorText: rtn.html }));
    }
  }
  useEffect(() => {
    const lk = link(searchParams.get("type"), userId);
    setLinkobj(lk);
    if (formId !== "new") {
      console.log(formId.toString());

      fetchForm(formId, lk);
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

    setFormid(formId);
  }, [formId]);
  useEffect(() => {
    const rtn = DrawProcess(processArray);
    console.log(rtn);
    setDrawDiagram(rtn);
  }, [processArray]);
  const showModal = (modal) => {
    setModal(modal);
    //$("#btnModal").click();
    setTimeout(() => {
      $("#btnModal").click();
    }, 0);
  };
  const submitHandler = async () => {
    const taskId = await saveWorkflowHandler();
    if (taskId) {
      // activity에 신규추가
      const rtn = initAction(taskId);
      // 전체리스트로 가기
      if (rtn) {
        console.log(rtn);
        message.info("상신되었습니다. ");
        navigate(`/ongoing`, { replace: true });
      } else {
        message.info("상신에 실패했습니다. ");
      }
    } else message.info("task등록에 실패했습니다. ");
  };
  const saveProcessHandler = () => {
    console.log("saveProcess");
  };
  const initAction = async (taskId) => {
    const url = `${API2}/activityStart/${taskId}`;

    const rtn = await getData(url, "get");
    return rtn;
  };
  const saveWorkflowHandler = async () => {
    let taskId = await findTaskId(formid, "form");
    console.log(formData);
    const curdate = new Date();
    // find taskId from processId;
    // processId===-1이면 신규, 아니면 수정
    const urltsk = `${API2}/task`;
    const urlprocess = `${API2}/process`;
    const urlform = `${API2}/form`;
    let datatsk = {
      name: formData.taskName,
      descript: formData.descript,
      dueDate: formData.dueDate,
    };
    let dataform = {
      formType: formData.formType,
      title: formData.formTitle,
      html: editorText,
    };

    if (!taskId) {
      //post new task
      datatsk.creatorId = userId;
      datatsk.createDate = curdate;
      datatsk.status = "notstarted";

      const rtntsk = await getData(urltsk, "post", datatsk);
      console.log(rtntsk);
      taskId = rtntsk.id;
      //poset new form
      dataform.taskId = taskId;
      dataform.created = curdate;
      const rtnform = await getData(urlform, "post", dataform);
      //post new process
      let newprocess = _.cloneDeep(processArray);
      newprocess.map((i, item) => {
        item.taskId = taskId;
        newprocess.splice(i, 1, item);
      });
      await getData(urlprocess, "post", newprocess);
    } else {
      console.log("else");
      // processId가 있으면 수정
      console.log(formid, taskId, urltsk);
      getData(`${urltsk}/${taskId}`, "put", datatsk);
      //formId가 있으면 수정
      getData(`${urlform}/${formid}`, "put", dataform);
    }
    return taskId;
  };
  const saveArchiveHandler = async () => {
    const curdate = new Date();
    let url = `${API2}/formarchive`;
    let method = "post";
    console.log(formData);
    let data = {
      formType: formData.formType,
      title: formData.formTitle,
      html: formData.html,
      created: curdate,
      descript: formData.formDescript,
      writerId: userId,
      isOpen: formData.isOpen,
    };
    if (formId !== "new") {
      url = `${url}/${formId}`;
      method = "put";
    }
    console.log(url, method, data, formId);
    //const rtnput = await getData(url, method, data);
    if (method === "put") {
      axios
        .put(url, data)
        .then((res) => {
          message.info("저장되었습니다. ");
          //navigate(`/form/list`, { replace: true });
        })
        .catch((err) => {
          console.log(err);
          message.warning("저장에 실패했습니다.");
        });
    } else {
      axios
        .post(url, data)
        .then((res) => {
          message.info("저장되었습니다. ");
          //navigate(`/form/list`, { replace: true });
        })
        .catch((err) => {
          console.log(err);
          message.warning("저장에 실패했습니다.");
        });
    }
  };
  const onFormChange = (e, label) => {
    let newform = { ...formData, [label]: e.target.value };
    if (label === "taskName" && formId === "new") {
      newform.formTitle = e.target.value;
    }
    console.log(newform);
    setFormData(newform);
  };
  const formInput = (
    <form class="text-start">
      {linkobj?.type !== "archive" && (
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
            <div class="col-sm-10 text-start d-flex justify-content-start">
              <input
                type="button"
                class="btn btn-dark btn-xs me-5"
                value="결재선 편집"
                id="process"
                onClick={() => {
                  const modal = {
                    id: "processBuilder",
                    title: "결재선 선택",
                    child: <ProcessEditor />,
                    evt: saveProcessHandler,
                    opt: { dialogClass: "modal-dialog modal-fullscreen" },
                  };
                  showModal(modal);
                }}
              />
              {drawDiagram}
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-12 d-flex justify-content-end">
              <input
                type="button"
                class="btn btn-dark btn-xs"
                value="문서양식리스트"
                id="process"
                onClick={() => {
                  const modal = {
                    id: "formArchive",
                    title: "양식 선택",
                    child: <FormListComponent lk={linkobj} />,
                    //evt: saveProcessHandler,
                    opt: { dialogClass: "modal-dialog modal-xl" },
                  };
                  showModal(modal);
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
              onFormChange(e, "formtitle");
            }}
          />
        </div>
      </div>
      {linkobj?.type === "archive" && (
        <div class="row mb-3">
          <label for="formdescript" class="col-sm-2 col-form-label">
            문서설명
          </label>
          <div class="col-sm-10">
            <textarea
              style={{ height: 100 }}
              class="form-control"
              id="formdescript"
              value={formData?.formDescript}
              onChange={(e) => {
                onFormChange(e, "formDescript");
              }}
            />
          </div>
        </div>
      )}
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
              title={
                formId === "new" ? linkobj?.titleeditnew : linkobj?.titleedit
              }
              right={
                <>
                  <button
                    class="btn btn-dark btn-sm"
                    onClick={() => navigate(-1)}
                  >
                    <MdOutlineKeyboardReturn />
                  </button>
                  {[("imsi", "ongoing")].indexOf(linkobj?.type) > -1 && (
                    <Popconfirm
                      title="결재를 상신하시겠습니까?"
                      placement="topLeft"
                      okText="네"
                      cancelText="아니오"
                      onConfirm={submitHandler}
                    >
                      <Button
                        style={{ backgroundColor: "black", color: "white" }}
                      >
                        상신
                      </Button>
                    </Popconfirm>
                  )}
                </>
              }
            />

            {loading && <Spinner />}
            {formInput}
            <CkEditor />

            <div class="d-flex justify-content-center mt-3">
              <Tooltip
                placement="top"
                title="회사 공용 문서로 저장"
                className="mt-2"
              >
                <div class="form-check">
                  <input
                    class="form-check-input me-1"
                    type="checkbox"
                    checked={formData?.isOpen}
                    onChange={(e) => {
                      setFormData({ ...formData, isOpen: e.target.checked });
                    }}
                    id="flexCheckDefault"
                  />
                  <label class="form-check-label  me-3" for="flexCheckDefault">
                    공유
                  </label>
                </div>
              </Tooltip>
              <button
                type="button"
                class="btn btn-outline-dark"
                onClick={() => {
                  const newFormData = { ...formData, html: editorText };
                  const modal = {
                    id: "preview",
                    title: "미리보기",
                    child: <FormContent lk={linkobj} formdt={newFormData} />,
                    //  evt: saveProcessHandler,
                    opt: { dialogClass: "modal-dialog modal-xl" },
                  };
                  showModal(modal);
                }}
                // () =>
                //   navigate(`/form/${formid}?type=${linkobj.type}`, {
                //     replace: true,
                //   })
                // }
              >
                <RxMagnifyingGlass /> 미리보기
              </button>
              <button
                type="button"
                class="btn btn-outline-dark ms-1"
                onClick={
                  linkobj?.type === "archive"
                    ? saveArchiveHandler
                    : saveWorkflowHandler
                }
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

export default FormEdit;
