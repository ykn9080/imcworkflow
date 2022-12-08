import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { API2 } from "constants";
import moment from "moment";
import _ from "lodash";

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
  const data = _.cloneDeep(data1);

  let fields;
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
    if (opt && opt.click) {
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
        default:
          break;
      }
    });

    return rtn;
  });
};
/**'
 * 버튼이 여러개일 경우, array에 추가함
 * array: [{
 *  click: clickHandler,
 *  kfield:"id",
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
      render: (_, record) => (
        <Button
          type={btntype}
          icon={k.opt?.icon}
          onClick={() => {
            console.log(k.kfield, record[k.kfield]);
            k.click(record[k.kfield]);
          }}
        >
          {btntitle}
        </Button>
      ),
    };
  });
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
          id={k.kfield}
          value=""
          onClick={() => {
            k.click(record[k.kfield]);
          }}
          aria-label="..."
        />
      ),
    };
  });
};
/**
 * 결재진행 프로세스별 갯수 카운트
 * @param {*} data onGoingListbyuser data
 * @returns process type별 갯수
 */
export const countProcessType = (data, userId) => {
  let obj = {},
    rtn;

  if (data) {
    ["결재", "진행", "결재요청", "반려", "완료", "기안"].map((type) => {
      switch (type) {
        case "결재":
          rtn = _.countBy(data, (x) => {
            return x.action === "결재" && x.userId === userId;
          });
          break;
        // case "진행":
        //   rtn = _.countBy(data, (x) => {
        //     return ["완료", "기안"].indexOf(x.action) === -1;
        //   });
        //   break;
        case "반려":
        case "완료":
          rtn = _.countBy(data, (x) => {
            return x.action === type && x.userId === userId;
          });
          break;
        // case "기안":
        //   rtn = _.countBy(data, (x) => {
        //     return x.creatorId === userId;
        //   });
        //   break;
        // case "결재요청":
        //   rtn = _.countBy(data, (x) => {
        //     return (
        //       x.action !== "기안" &&
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
