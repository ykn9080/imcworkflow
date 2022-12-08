import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import { Table } from "antd";
import axios from "axios";
import { API2 } from "constants";
import { getData, makeButton, makeColumn } from "components/dataget/fetchData";

const WorkTable = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const dispatchData = useSelector((state) => state.global.dispatchData);
  const userid = useSelector((state) => state.global.userId);
  const cellClickHandler = (id) => {
    //  dispatch(globalVariable({ userId: id }));
    //  setSelected(id);
    console.log(id);
  };
  useEffect(() => {
    async function fetchData() {
      const url2 = `${API2}/tasklistbyuser/${userid}`;
      let rtn = await getData(url2, "get");
      const btncolumns = makeButton([
        { click: cellClickHandler, keyfield: "id" },
      ]);
      rtn.column.push(btncolumns);
      //  rtn.column.push({
      //    title: "Action",
      //    key: "action",
      //    render: (_, record) => (
      //      <Button
      //        type="primary"
      //        onClick={() => {
      //          cellClickHandler(record.id);
      //        }}
      //      >
      //        Select
      //      </Button>
      //    ),
      //  });
      setTbcolumn(rtn.column);
      setTbdata(rtn.data);
      dispatch(globalVariable({ dispatchData: rtn.data.object }));
    }
    if (dispatchData.length === 0) {
      fetchData();
    } else {
      const column = makeColumn(dispatchData);

      setTbcolumn(column);
      setTbdata(dispatchData);
    }
  }, []);
  // const getDispatch = async () => {
  //   if (dispatchData.length === 0) {
  //     setLoading(true);
  //     const url2 = `${API2}/tasklistbyuser/${userid}`;
  //     const res = await axios.get(url2, {
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     });
  //     dispatch(globalVariable({ dispatchData: res.data.object }));

  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);

  //     const column = makeColumn(res.data.object);

  //     setTbdata(res.data.object);
  //     setTbcolumn(column);
  //   } else {
  //     const column = makeColumn(dispatchData);

  //     setTbcolumn(column);
  //     setTbdata(dispatchData);
  //   }
  // };

  return <Table dataSource={tbdata} columns={tbcolumn} />;
};

export default WorkTable;
