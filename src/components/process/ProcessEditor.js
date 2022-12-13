import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import globalVariable from "actions";
import Beautiful from "components/dnd/Beautiful";
import moment from "moment";
import { Drawer } from "antd";

const ProcessEditor = () => {
  const dispatch = useDispatch();
  const [drawDiagram, setDrawDiagram] = useState();
  const userId = useSelector((state) => state.global.userId);
  const processArray = useSelector((state) => state.global.processArray);
  const drawprocess = (arr) => {
    console.log(arr);
    const rtn = DrawProcess(arr);
    setDrawDiagram(rtn);
  };
  return (
    <>
      <p>조직도로 부터 결재대상자를 선택합니다. </p>
      <p>결재 순서를 바꿀수 있습니다. </p>
      <p>drag & drop을 지원합니다. </p>
      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">1 Step</h5>
              <p class="card-text">{"상신->결재->완료"}</p>
              <a
                href="#"
                class="btn btn-primary"
                onClick={() => {
                  drawprocess(array1(userId));
                  dispatch(globalVariable({ processArray: array1(userId) }));
                }}
              >
                apply
              </a>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">2 Step</h5>
              <p class="card-text">{"상신->결재->결재->완료"}</p>
              <a
                href="#"
                class="btn btn-primary"
                onClick={() => {
                  drawprocess(array2(userId));
                  dispatch(globalVariable({ processArray: array2(userId) }));
                }}
              >
                apply
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-center bd-highlight mt-5">
        {drawDiagram}
      </div>
      {/* <Beautiful /> */}
    </>
  );
};

export default ProcessEditor;

export const DrawProcess = (array) => {
  if (!array) return;
  return (
    <>
      {array.map((item, i) => {
        const arrow = i === array.length - 1 ? "" : "→";
        return <p>{`${item.seq}.${item.processMethod}${arrow}`}</p>;
      })}
    </>
  );
};
//(seq, process_method, user_id, due_date, task_id)
const curdate = moment(new Date());
const array1 = (userid) => {
  return [
    { seq: 0, processMethod: "상신", userId: userid, dueDate: curdate },
    {
      seq: 1,
      processMethod: "결재",
      userId: 2,
      dueDate: curdate.add(2, "days"),
    },
    {
      seq: 2,
      processMethod: "완료",
      userId: userid,
      dueDate: curdate.add(2, "days"),
    },
  ];
};
const array2 = (userid, taskId) => {
  return [
    {
      seq: 0,
      processMethod: "상신",
      userId: userid,
      dueDate: curdate,
    },
    {
      seq: 1,
      processMethod: "결재",
      userId: 2,
      dueDate: curdate.add(2, "days"),
    },
    {
      seq: 2,
      processMethod: "결재",
      userId: 3,
      dueDate: curdate.add(4, "days"),
    },
    {
      seq: 3,
      processMethod: "완료",
      userId: userid,
      dueDate: curdate.add(4, "days"),
    },
  ];
};
