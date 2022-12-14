import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import axios from "axios";
import { API2 } from "constants";
import moment from "moment";
import _ from "lodash";
import { Link } from "react-router-dom";

export const getData = async (url, method, params) => {
  // console.log(API2);
  // const url2 = `${API2}/${url}`;
  let config = {
    method: method,
    url: url,
  };
  let options = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if ((method.toLowerCase() === "post") | (method.toLowerCase() === "put"))
    config.data = params;

  const res = await axios(config, options);
  let rtn = res.data.object;
  if (method.toLowerCase() === "get") {
    rtn = { data: res.data.object, column: makeColumn(res.data.object) };
  }
  return rtn;
};
/**
 *
 * @param {*} data1
 * @param {*} opt
 * @returns
 */
export const makeColumn = (data1, opt) => {
  if (!data1) return;
  const data = _.cloneDeep(data1);

  let fields;
  if (!data[0]) return;
  return Object.keys(data[0]).map((k, i) => {
    fields = null;

    if (opt && opt.fields) {
      fields = _.find(opt.fields, (o) => {
        return o.dataIndex === k;
      });
    }
    let rtn = {
      title: fields ? fields.title : k,
      dataIndex: k,
      width: 100,
    };
    // if(fields.render)
    // rtn.render = (_, record) => (

    //     onClick={() => {
    //       cellClick(record[fields.dataIndex]));
    //     }

    // );

    if (opt && opt.click) {
      fields = _.find(opt.fields, (o) => {
        return o.dataIndex === k;
      });
      rtn.onCell = (record, rowIndex) => {
        if (opt && opt.click) {
          return {
            onClick: (ev) => {
              opt.click("row", k, record, rowIndex);
            },
          };
        } else return null;
      };
    }

    return rtn;
  });
};

export const hideColumn = (Cols, hideArr) => {
  if (!Cols | !hideArr) return;
  return Cols.filter((col) => {
    return hideArr.indexOf(col.dataIndex) === -1;
  });
};
export const convertRows = (Rows, convertArr) => {
  if (!Rows) {
    return;
  }
  return Rows.map((row) => {
    let rtn = row;
    convertArr.map((k, i) => {
      switch (k.type) {
        case "date":
          rtn[k.dataIndex] = moment(rtn[k.dataIndex]).format(k.format);
          break;
        case "boolean":
          rtn[k.dataIndex] = k.format[rtn[k.dataIndex]];
          break;
        default:
          break;
      }
    });

    return rtn;
  });
};
/**'
 * ????????? ???????????? ??????, array??? ?????????
 * array: [{
 *  click: clickHandler,
 *  dataIndex:"id",
 *  opt:{
 *    title:"Act",
 *    btntitle:"Edit",
 *    btnstyle:"primary",
 *    icon:<EditOutlined />
 *  }
 * }]
 */
export const makeButton = (array) => {
  return array.map((k, i) => {
    let tit = "",
      btntitle = "",
      btntype = "",
      btnwidth = "100px";
    if (k.opt) {
      tit = k.opt.title ? k.opt.title : tit;
      btntitle = k.opt.btntitle ? k.opt.btntitle : btntitle;
      btntype = k.opt.btnstyle ? k.opt.btnstyle : btntype;
      btnwidth = k.opt.btnwidth ? k.opt.btnwidth : btnwidth;
    }
    return {
      title: tit,
      dataIndex: "",
      width: btnwidth,
      key: "action",
      render: (text, record) => (
        <Button
          type={btntype}
          icon={k.opt?.icon}
          onClick={() => {
            k.click(record);
          }}
        >
          {btntitle}
        </Button>
      ),
    };
  });
};
const makeButtonRow = (array) => {
  console.log(array);
  let tit = "",
    btntitle = "",
    btntype = "",
    btnwidth = "100px",
    btnconfirm = false;
  if (array[0].opt) {
    const k = array[0];
    tit = k.opt.title ? k.opt.title : tit;
    btntitle = k.opt.btntitle ? k.opt.btntitle : btntitle;
    btntype = k.opt.btnstyle ? k.opt.btnstyle : btntype;
    btnwidth = k.opt.btnwidth ? k.opt.btnwidth : btnwidth;
    btnconfirm = k.opt.confirm === true ? k.opt.confirm : btnconfirm;
  }
  console.log(btnconfirm);
  return {
    title: tit,
    dataIndex: "",
    width: btnwidth,
    key: "action",
    render: (text, record) => {
      return (
        <>
          {array.map((k, i) => {
            const popbtn = (
              <Popconfirm
                title="????????? ?????????????????????????"
                placement="topLeft"
                okText="???"
                cancelText="?????????"
                onConfirm={() => console.log("sss")}
              >
                <Button style={{ backgroundColor: "black", color: "white" }}>
                  ??????
                </Button>
              </Popconfirm>
            );
            const btn = (
              <Button
                type={btntype}
                icon={k.opt?.icon}
                onClick={() => {
                  k.click(record);
                }}
              >
                {btntitle}
              </Button>
            );
            let btnselect = popbtn;
            //if (btnconfirm) btnselect = popbtn;

            return btnselect;
          })}
        </>
      );
    },
  };
};
export const makeCheckbox = (array) => {
  return array.map((k, i) => {
    let tit = "",
      btnwidth = "100px";
    if (k.opt) {
      tit = k.opt.title ? k.opt.title : tit;
      btnwidth = k.opt.btnwidth ? k.opt.btnwidth : btnwidth;
    }
    return {
      title: tit,
      dataIndex: "",
      width: btnwidth,
      key: "action",
      render: (_, record) => (
        <input
          class="form-check-input"
          type="radio"
          name="radioNoLabel"
          id={k.dataIndex}
          value=""
          onClick={() => {
            k.click(record[k.dataIndex]);
          }}
          aria-label="..."
        />
      ),
    };
  });
};
/**
 *
 * @param {*} cols ?????? ???????????? column
 * @param {*} array ????????? ???????????? ???????????? array, makeButton, makeCheckbox ??????
 * @returns
 */
export const appendButton = (cols, array, type) => {
  let btncolumns = makeButtonRow(array);
  if (type === "checkbox") btncolumns = makeCheckbox(array);
  if (btncolumns) cols = cols.concat(btncolumns);
  return cols;
};
/**
 * ???????????? ??????????????? ?????? ?????????
 * @param {*} data onGoingListbyuser data
 * @returns process type??? ??????
 */
export const countProcessType = (data, userId) => {
  let obj = {},
    rtn;

  if (data) {
    ["??????", "??????", "????????????", "??????", "??????", "??????"].map((type) => {
      switch (type) {
        case "??????":
          rtn = _.countBy(data, (x) => {
            return x.action === "??????" && x.userId === userId;
          });
          break;
        // case "??????":
        //   rtn = _.countBy(data, (x) => {
        //     return ["??????", "??????"].indexOf(x.action) === -1;
        //   });
        //   break;
        case "??????":
        case "??????":
          rtn = _.countBy(data, (x) => {
            return x.action === type && x.userId === userId;
          });
          break;
        // case "??????":
        //   rtn = _.countBy(data, (x) => {
        //     return x.creatorId === userId;
        //   });
        //   break;
        // case "????????????":
        //   rtn = _.countBy(data, (x) => {
        //     return (
        //       x.action !== "??????" &&
        //       x.userId !== userId &&
        //       x.creatorId === userId
        //     );
        //   });
        //   break;
        default:
          return null;
      }
      if (rtn.true) {
        obj[type] = rtn.true;
      }
    });
    return obj;
    //dispatch(globalVariable({ processTypeCount: obj }));
  }
};

export async function fetchFormById(id, lk) {
  let url2 = `${API2}/formwithtask/${id}`;
  if (lk.type === "archive") url2 = `${API2}/formarchive/${id}`;
  let rtn = await getData(url2, "get");

  if (rtn && rtn.data) {
    let rtndt = rtn.data;
    if (lk.type !== "archive") rtndt = rtn.data[0];
    else {
      rtndt.formTitle = rtndt.title;
      delete rtndt.title;
    }
    return rtndt;
  }
}
