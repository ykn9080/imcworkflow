import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Body from "../components/layout/Body";
import { getDispatch } from "../utilities/fetchData";
import { Table, Space, Button } from "antd";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

export const HomePage = () => {
  //   const uselist=[{3	남사원	총무부	사원	김대리	1	0
  // 1	김대리	총무부	대리	신보영	4	1
  // 4	신보영	총무부	대표이사			1}]
  const dispatch = useDispatch();
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const [selected, setSelected] = useState();
  const userId = useSelector((state) => state.global.userId);
  const params = {
    query:
      "select a.id,a.name,d.dvname, b.name position, c.name bossname, a.boss_id, a.is_head  from user a join position b on a.position_id=b.id left outer join user c on a.boss_id=c.id left outer join division d on a.division_id=d.id",
    replacements: { id: 3 },
  };
  const cellClickHandler = (id) => {
    dispatch(globalVariable({ userId: id }));
    setSelected(id);
  };
  useEffect(() => {
    if (userId) setSelected(userId);
    async function fetchData() {
      let rtn = await getDispatch("getquery", "POST", params);
      rtn.column.push({
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Button
            type="primary"
            onClick={() => {
              cellClickHandler(record.id);
            }}
          >
            Select
          </Button>
        ),
      });
      setTbcolumn(rtn.column);
      setTbdata(rtn.data);
    }
    fetchData();
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
        </div>
      </div>
    </div>
  );
};
