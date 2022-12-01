import _ from "lodash";

export const makeColumn = (data1, cellClickHandler) => {
  const data = _.cloneDeep(data1);

  return Object.keys(data[0]).map((k, i) => {
    return {
      title: k,
      dataIndex: k,
      width: 100,
      //   onCell: (record, rowIndex) => {
      //     return {
      //       onClick: (ev) => {
      //         cellClickHandler("row", k, record, rowIndex);
      //       },
      //     };
      //   },
    };
  });
};
