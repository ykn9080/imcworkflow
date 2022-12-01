import React, { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";
import { API2 } from "constants";
import { makeColumn } from "utilities/table";

const WorkTable = ({ url, method, params }) => {
  const [loading, setLoading] = useState(false);
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  useEffect(() => {
    getDispatch(url, method, params);
  }, []);
  const getDispatch = async (url, method, params) => {
    setLoading(true);
    const userId = 3;
    console.log(API2);
    const url2 = `${API2}/${url}`;
    let config = {
      method: method,
      url: url2,
    };
    let options = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if ((method === "post") | (method === "put")) config.data = params;

    const res = await axios(config, options);

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    const column = makeColumn(res.data.object);
    setTbdata(res.data.object);
    setTbcolumn(column);
    return { data: res.data.object, column: column };
  };

  return <Table dataSource={tbdata} columns={tbcolumn} />;
};
export const getDispatch = async (url, method, params) => {
  console.log(API2);
  const url2 = `${API2}/${url}`;
  let config = {
    method: method,
    url: url2,
  };
  let options = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if ((method.toLowerCase() === "post") | (method.toLowerCase() === "put"))
    config.data = params;

  const res = await axios(config, options);

  const column = makeColumn(res.data.object);

  return { data: res.data.object, column: column };
};
export default WorkTable;
