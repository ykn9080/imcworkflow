import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import { useParams, useNavigate, Link } from "react-router-dom";
import _ from "lodash";
import $ from "jquery";
import {
  getData,
  makeButton,
  makeColumn,
  hideColumn,
  convertRows,
  countProcessType,
} from "../components/dataget/fetchData";
import { API2 } from "constants";
import { Table, message } from "antd";
import { findFormByTaskId } from "components/dataget/findId";
import Spinner from "utilities/spinner";

const Ongoing = (props) => {
  let navigate = useNavigate();
  const { processtype } = useParams();
  const dispatch = useDispatch();
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const [selected, setSelected] = useState();
  const [action, setAction] = useState();
  const [msg, setMsg] = useState();
  const [currentProcess, setCurrentProcess] = useState();
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state.global.userId);
  const onGoing = useSelector((state) => state.global.onGoing);
  const userList = useSelector((state) => state.global.userList);

  const modalHandler = (processId) => {
    setCurrentProcess(processId);
    $("#btnModal").click();
  };
  const applyAction = () => {
    console.log(currentProcess, action, msg);
    const url = `${API2}/activityInsert`;
    const data = {
      processId: currentProcess,
      comment: msg,
      action: action,
      userId: userId,
    };
    const rtn = getData(url, "post", data);
    if (rtn) {
      message.info("결재처리되었습니다.");
      fetchData();
    }
  };
  const formHandler = async (processId) => {
    navigate(`/form/${processId}`, { replace: true });
  };

  const filterProcessType = (type, dt) => {
    let data = _.cloneDeep(dt);
    if (type === "all") return data;
    else
      switch (type) {
        case "결재":
          return data.filter((x) => x.action === type && x.userId === userId);
        case "진행":
          return data.filter((x) => ["완료", "기안"].indexOf(x.action) === -1);
        case "기안":
          return data.filter((x) => x.creatorId === userId);
        case "반려":
        case "완료":
          return data.filter((x) => x.action === type);
        case "결재요청":
          return data.filter(
            (x) =>
              x.action !== "기안" &&
              x.userId !== userId &&
              x.creatorId === userId
          );
        default:
          return data;
      }
  };
  const appendButton = (cols, processtype) => {
    let btncolumns;
    switch (processtype) {
      case "결재":
        btncolumns = makeButton([
          {
            click: modalHandler,
            dataIndex: "processId",
            opt: { btnstyle: "primary", title: "처리", btntitle: "결재" },
          },
        ]);
        break;
      case "반려":
        btncolumns = makeButton([
          {
            click: formHandler,
            dataIndex: "processId",
            opt: { btnstyle: "primary", title: "처리", btntitle: "재기안" },
          },
        ]);
        break;
      default:
        break;
    }

    if (btncolumns) cols = cols.concat(btncolumns);
    return cols;
  };
  const colMaker = (data) => {
    let mcol = makeColumn(data, {
      fields: [
        { dataIndex: "taskName", title: "결재명" },
        { dataIndex: "action", title: "처리유형" },
        { dataIndex: "userName", title: "결재자" },
        { dataIndex: "creatorName", title: "기안자" },
        { dataIndex: "actionDate", title: "요청일" },
        { dataIndex: "dueDate", title: "마감일" },
      ],
    });
    mcol = hideColumn(mcol, [
      "taskId",
      "userId",
      "creatorId",
      "processId",
      "processMethod",
      "comment",
      "formId",
    ]);
    return mcol;
  };
  const rowMaker = (data) => {
    let dt = convertRows(data, [
      { dataIndex: "actionDate", type: "date", format: "YYYY-MM-DD h:mm a" },
      { dataIndex: "dueDate", type: "date", format: "YYYY-MM-DD h:mm a" },
    ]);
    return dt;
  };
  async function fetchData() {
    const url2 = `${API2}/onGoinglistbyuser/${userId}`;
    setLoading(true);
    let rtn = await getData(url2, "get");
    setLoading(false);
    makeDataSet(rtn.data);
  }

  const makeDataSet = async (data) => {
    let cols = colMaker(data);

    cols[0].render = (text, record) => {
      const path = `/form/${record.formId}?type=ongoing`;
      return <Link to={path}>{text}</Link>;
    };
    cols = appendButton(cols, processtype);
    setTbcolumn(cols);
    const filtered = filterProcessType(processtype, data);
    setTbdata(rowMaker(filtered));
    dispatch(globalVariable({ onGoing: data }));
    const cnt = countProcessType(data, userId);

    globalVariable({
      processTypeCount: cnt,
    });
  };
  useEffect(() => {
    if (userId) setSelected(userId);
    else {
      navigate("/", { replace: true });
      message.warning("직원을 선택하세요");
    }
    if (!onGoing) fetchData();
    else makeDataSet(onGoing);
  }, [processtype]);

  const PageHeader = () => {
    const findUserName = () => {
      const user = _.find(userList, (o) => {
        return o.id === userId;
      });
      if (user) return user.name;
    };
    const name = findUserName();
    const usr = `[${name ? name : "N/A"}]`;
    const Msg = () => {
      switch (processtype) {
        case "결재":
          return `${usr} 자신이 결재할 문서입니다.`;
        case "진행":
          return `${usr} 진행중인 건중 자신이 결재할 상태가 아닌 문서입니다.`;
        case "반려":
        case "완료":
        case "기안":
          return `${usr} ${processtype}된 문서입니다.`;
        case "결재요청":
          return `${usr} 문서중 결재가 진행중인 문서입니다.`;
        default:
          return `${usr}`;
      }
    };

    return (
      <Header title={processtype ? processtype : "전체"} right={<Msg />} />
    );
  };

  const inputForm = (
    <form>
      <div class=" text-start">
        <label for="exampleInputEmail1" class="mb-2 fw-bold">
          처리
        </label>
        <div class="d-flex flex-row mb-3 ">
          <div class="form-check me-5">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onChange={() => setAction("accept")}
            />
            <label class="form-check-label" for="flexRadioDefault1">
              승인
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              onChange={() => setAction("reject")}
            />
            <label class="form-check-label" for="flexRadioDefault2">
              반려
            </label>
          </div>
        </div>
      </div>
      <div class="mb-3 text-start">
        <label for="exampleFormControlTextarea1" class="form-label fw-bold">
          Comment
        </label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        ></textarea>
      </div>
    </form>
  );

  const newModal = (
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              결재처리
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">{inputForm}</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              닫기
            </button>
            <button
              type="button"
              data-bs-dismiss="modal"
              class="btn btn-primary"
              onClick={applyAction}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <PageHeader />
            {loading && <Spinner />}
            <Table
              dataSource={tbdata}
              columns={tbcolumn}
              rowClassName={(record) => (record.id === selected ? "ddd" : "")}
            />
          </Body>
        </div>
      </div>

      {/* <BootModal
        id={"formDefault"}
        title={"결재처리"}
        clickHandler={() => console.log("hhh")}
      >
        <InputForm />
      </BootModal> */}
      {newModal}
      <button
        id="btnModal"
        style={{ display: "none" }}
        data-bs-toggle="modal"
        data-bs-target={"#exampleModal"}
      >
        aa
      </button>
    </>
  );
};

export default Ongoing;
