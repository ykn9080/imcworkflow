import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import { Table } from "antd";
import axios from "axios";
import { API2 } from "constants";
import { makeColumn } from "utilities/table";

const WorkTable = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const dispatchData = useSelector((state) => state.global.dispatchData);
  const userid = useSelector((state) => state.global.userId);
  useEffect(() => {
    getDispatch();
  }, []);
  const getDispatch = async () => {
    if (dispatchData.length === 0) {
      setLoading(true);
      const url2 = `${API2}/tasklistbyuser/${userid}`;
      const res = await axios.get(url2, {
        headers: {
          "Content-type": "application/json",
        },
      });
      dispatch(globalVariable({ dispatchData: res.data.object }));

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      const column = makeColumn(res.data.object);

      setTbdata(res.data.object);
      setTbcolumn(column);
    } else {
      const column = makeColumn(dispatchData);

      setTbcolumn(column);
      setTbdata(dispatchData);
    }
  };

  return <Table dataSource={tbdata} columns={tbcolumn} />;
};

export default WorkTable;
