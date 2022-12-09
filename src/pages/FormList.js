import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";

import { useHistory, useNavigate, useParams } from "react-router-dom";
import { API2 } from "constants";
import {
  getData,
  makeButton,
  makeColumn,
  hideColumn,
  convertRows,
} from "../components/dataget/fetchData";
import { Table, message } from "antd";

const FormList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const userId = useSelector((state) => state.global.userId);
  const imsiForm = useSelector((state) => state.global.imsiForm);
  const makeDataSet = (data) => {
    let cols = colMaker(data);
    const btncolumns = makeButton([
      {
        click: () => {
          navigate(`/form/edit/${data.id}`);
        },
        kfield: "id",
        opt: { btnstyle: "primary", title: "처리", btntitle: "edit" },
      },
    ]);
    cols = cols.concat(btncolumns);
    //cols = appendButton(cols, processtype);
    setTbcolumn(cols);
    //const filtered = filterProcessType(processtype, data);
    //setTbdata(rowMaker(filtered));
    setTbdata(data);
    dispatch(globalVariable({ imsiForm: data }));
  };
  const colMaker = (data) => {
    let mcol = makeColumn(data, {
      fields: [
        { dataIndex: "formType", title: "유형" },
        { dataIndex: "title", title: "제목" },
        { dataIndex: "created", title: "생성일" },
        // { dataIndex: "creatorName", title: "기안자" },
        // { dataIndex: "actionDate", title: "요청일" },
        // { dataIndex: "dueDate", title: "마감일" },
      ],
    });
    mcol = hideColumn(mcol, [
      "html",
      "taskId",
      //   //   "creatorId",
      //   //   "processId",
      //   //   "processMethod",
      //   //   "comment",
    ]);
    return mcol;
  };
  const rowMaker = (data) => {
    let dt = convertRows(data, [
      { dataIndex: "actionDate", type: "date", format: "YYYY-mm-DD hh:mm" },
      { dataIndex: "dueDate", type: "date", format: "YYYY-mm-DD hh:mm" },
    ]);
    return dt;
  };
  async function fetchData() {
    const url2 = `${API2}/tempFormListByUser/${userId}`;

    let rtn = await getData(url2, "get");
    console.log(rtn, userId);
    makeDataSet(rtn.data);
  }
  useEffect(() => {
    if (!userId) {
      message.warning("직원을 선택하세요");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
    // if (!imsiForm) fetchData();
    // else makeDataSet(imsiForm);
    fetchData();
  }, []);
  return (
    <div>
      {" "}
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <Table
              dataSource={tbdata}
              columns={tbcolumn}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    //navigate to
                    console.log(event);
                    navigate(`/form/${record.id}`);
                  }, // click row
                };
              }}
              //   rowClassName={(record) => (record.id === selected ? "ddd" : "")}
            />
          </Body>
        </div>
      </div>
    </div>
  );
};

export default FormList;
