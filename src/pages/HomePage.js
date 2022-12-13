import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Body from "../components/layout/Body";
import {
  getData,
  makeCheckbox,
  makeColumn,
  hideColumn,
  countProcessType,
} from "../components/dataget/fetchData";
import { API2 } from "constants";
import { Table, Space, Button } from "antd";
import Spinner from "utilities/spinner";
import _ from "lodash";
import { TfiCheck } from "react-icons/tfi";

export const HomePage = () => {
  const dispatch = useDispatch();
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.global.userId);
  const userList = useSelector((state) => state.global.userList);

  const cellClickHandler = async (id) => {
    dispatch(globalVariable({ userId: id }));
    const url2 = `${API2}/onGoinglistbyuser/${id}`;
    let rtn = await getData(url2, "get");
    dispatch(globalVariable({ onGoing: rtn.data }));
    const cnt = countProcessType(rtn.data, id);
    console.log(cnt);
    dispatch(
      globalVariable({
        processTypeCount: cnt,
      })
    );
    setSelected(id);
  };
  const colMaker = (data) => {
    let mcol = makeColumn(data, {
      fields: [
        { title: "성명", dataIndex: "name" },
        { title: "부서명", dataIndex: "dvname" },
        { title: "직급", dataIndex: "position" },
        { title: "상사명", dataIndex: "bossname" },
        { title: "부서장", dataIndex: "isHead" },
      ],
    });
    mcol = hideColumn(mcol, ["bossId", "id"]);
    return mcol;
  };
  const makeDataSet = (rtn) => {
    let cols = colMaker(rtn);
    const btncolumns = makeCheckbox([
      {
        click: cellClickHandler,
        dataIndex: "id",
        opt: { title: "선택", dataIndex: "select" },
      },
    ]);
    //row에 버튼추가
    let mcol = cols.concat(btncolumns);
    setTbcolumn(mcol);
    setTbdata(rtn);
  };
  async function fetchData() {
    const params = {
      query:
        "select a.id,a.name,d.dvname, b.name position, c.name bossname, a.boss_id, a.is_head  from user a join position b on a.position_id=b.id left outer join user c on a.boss_id=c.id left outer join division d on a.division_id=d.id",
      replacements: { id: 3 },
    };
    const url = `${API2}/getquery`;
    setLoading(true);
    let rtn = await getData(url, "POST", params);
    setLoading(false);
    console.log(rtn);
    makeDataSet(rtn);

    // const opt = {
    //   fields: [
    //     { title: "성명", dataIndex: "name" },
    //     { title: "부서명", dataIndex: "dvname" },
    //     { title: "직급", dataIndex: "position" },
    //     { title: "상사명", dataIndex: "bossname" },
    //     { title: "부서장", dataIndex: "isHead" },
    //   ],
    // };
    // let col = makeColumn(rtn, opt);

    // col = hideColumn(col, ["bossId", "id"]);
    // //row별 추가버튼생성
    // const btncolumns = makeCheckbox([
    //   {
    //     click: cellClickHandler,
    //     dataIndex: "id",
    //     opt: { title: "선택", dataIndex: "select" },
    //   },
    // ]);
    // //row에 버튼추가
    // let mcol = col.concat(btncolumns);

    // // mcol.splice(0, 1);

    // setTbcolumn(mcol);
    // setTbdata(rtn);
    dispatch(globalVariable({ userList: rtn }));
  }
  useEffect(() => {
    if (userId) setSelected(userId);

    fetchData();
  }, []);
  useEffect(() => {
    if (userList) {
      makeDataSet(userList);
      // let cols = colMaker(userList);
      //  const btncolumns = makeCheckbox([
      //    {
      //      click: cellClickHandler,
      //      dataIndex: "id",
      //      opt: { title: "선택", dataIndex: "select" },
      //    },
      //  ]);
      //  //row에 버튼추가
      //  let mcol = cols.concat(btncolumns);
      // setTbcolumn(mcol);

      // setTbdata(userList);
    } else fetchData();
  }, []);
  return (
    <div>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <Sidebar />
          <Body>
            <h3>임직원리스트</h3>
            <Table
              dataSource={tbdata}
              columns={tbcolumn}
              rowClassName={(record) => (record.id === selected ? "ddd" : "")}
            />
          </Body>
          {loading && <Spinner />}
        </div>
      </div>
    </div>
  );
};
