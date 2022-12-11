import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import { useNavigate, Link } from "react-router-dom";
import { API2 } from "constants";
import _ from "lodash";
import {
  getData,
  makeButton,
  makeColumn,
  hideColumn,
  convertRows,
  appendButton,
} from "../components/dataget/fetchData";
import { Table, message } from "antd";

const FormList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const userId = useSelector((state) => state.global.userId);
  const imsiForm = useSelector((state) => state.global.imsiForm);
  const userList = useSelector((state) => state.global.userList);

  const colMaker = (data) => {
    let mcol = makeColumn(data, {
      fields: [
        { dataIndex: "formType", title: "유형" },
        {
          dataIndex: "title",
          title: "제목",
        },
        { dataIndex: "created", title: "생성일" },
      ],
    });
    mcol = hideColumn(mcol, ["html", "taskId"]);
    return mcol;
  };

  const makeDataSet = (data) => {
    let cols = colMaker(data);

    cols[2].render = (text, record) => {
      const path = `/form/${record.id}`;
      return <Link to={path}>{text}</Link>;
    };
    const cellClick = (record) => {
      navigate(`/form/edit/${record.id}`);
    };
    const btnarr = [
      {
        click: cellClick,
        dataIndex: "id",
        opt: { btnstyle: "primary", title: "처리", btntitle: "edit" },
      },
    ];
    cols = appendButton(cols, btnarr);

    setTbcolumn(cols);
    data = convertRows(data, [
      { dataIndex: "created", type: "date", format: "YYYY-MM-DD" },
    ]);
    setTbdata(data);
    dispatch(globalVariable({ imsiForm: data }));
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
  const PageHeader = () => {
    const findUserName = () => {
      const user = _.find(userList, (o) => {
        return o.id === userId;
      });
      if (user) return user.name;
    };
    const name = findUserName();
    const usr = `[${name ? name : "N/A"}]`;
    const btn = (
      <>
        {usr}
        <button
          class="btn btn-dark btn-sm ms-2"
          onClick={() => navigate("/form/edit/-1")}
        >
          New
        </button>
      </>
    );

    return <Header title="문서작성" right={btn} />;
  };
  return (
    <div>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <PageHeader />
            <Table
              dataSource={tbdata}
              columns={tbcolumn}
              //   onRow={(record, rowIndex) => {
              //     return {
              //       onClick: (event) => {
              //         //navigate to
              //         console.log(event);
              //         navigate(`/form/${record.id}`);
              //       }, // click row
              //     };
              //   }}
              //   rowClassName={(record) => (record.id === selected ? "ddd" : "")}
            />
          </Body>
        </div>
      </div>
    </div>
  );
};

export default FormList;
