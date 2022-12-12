import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import {
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
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
import { TfiSharethis } from "react-icons/tfi";
import { BsFillPersonFill } from "react-icons/bs";

const FormList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  //location.pathname;
  const dispatch = useDispatch();
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const [linkobj, setLinkobj] = useState();
  const userId = useSelector((state) => state.global.userId);
  const imsiForm = useSelector((state) => state.global.imsiForm);
  const userList = useSelector((state) => state.global.userList);

  useEffect(() => {
    if (!userId) {
      message.warning("직원을 선택하세요");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
    // if (!imsiForm) fetchData();
    // else makeDataSet(imsiForm);

    const lk = link(searchParams.get("type"), userId);
    setLinkobj(lk);
    fetchData(lk);
  }, [searchParams.get("type")]);

  const fetchData = async (lk) => {
    let rtn = await getData(lk.url2, "get");
    console.log(rtn, userId);
    makeDataSet(rtn.data);
  };
  const colMaker = (data) => {
    let mcol = makeColumn(data, {
      fields: linkobj?.fields,
    });
    mcol = hideColumn(mcol, linkobj?.hidecol);
    return mcol;
  };

  const makeDataSet = (data) => {
    let cols = colMaker(data);
    console.log(cols);
    cols[linkobj?.colindex].render = (text, record) => {
      const path = `/form/${record.id}`;
      return <Link to={path}>{text}</Link>;
    };
    const cellClick = (record) => {
      navigate(`/form/edit/${record.id}?type=${linkobj?.type}`);
      //navigate(linkobj?.cellclick);
    };
    const btnarr = [
      {
        click: cellClick,
        dataIndex: "id",
        opt: { btnstyle: "primary", title: "", btntitle: "edit" },
      },
    ];
    cols = appendButton(cols, btnarr);

    setTbcolumn(cols);
    data = convertRows(data, linkobj?.rows);
    setTbdata(data);
    dispatch(globalVariable({ imsiForm: data }));
  };

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
          onClick={() => navigate(linkobj?.navlink)}
        >
          New
        </button>
      </>
    );
    return <Header title={linkobj?.title} right={btn} />;
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
              //   rowClassName={(record) => (record.id === selected ? "ddd" : "")}
            />
          </Body>
        </div>
      </div>
    </div>
  );
};

export default FormList;

export const link = (type, userId) => {
  //const type = location.pathname.split("/")[2];
  //const type = searchParams.get("type");
  let title,
    titleedit,
    navlink,
    url2,
    hidecol,
    fields = [
      { dataIndex: "formType", title: "유형" },
      {
        dataIndex: "title",
        title: "제목",
      },
      { dataIndex: "created", title: "생성일" },
    ],
    rows = [{ dataIndex: "created", type: "date", format: "YYYY-MM-DD" }],
    colindex = 1;
  switch (type) {
    case "imsi":
      title = "임시문서 리스트";
      titleedit = "임시문서수정";
      navlink = `/form/imsi/new`;
      url2 = `${API2}/formImsiByUser/${userId}`;
      hidecol = ["id", "html", "taskId"];
      break;
    case "archive":
      title = "문서 Archive";
      titleedit = "문서수정";
      navlink = "/form/archive/new";
      url2 = `${API2}/formArchiveByUser/${userId}`;
      hidecol = ["id", "html", "writerId"];
      colindex = 1;
      fields = fields.concat([
        { dataIndex: "isOpen", title: "공유" },
        { dataIndex: "descript", title: "설명" },
        {
          dataIndex: "writerName",
          title: "작성자",
        },
      ]);
      rows = rows.concat([
        {
          dataIndex: "isOpen",
          type: "boolean",
          format: {
            1: <TfiSharethis size={"1.5em"} title="공유문서" />,
            0: <BsFillPersonFill size={"1.5em"} title="내문서" />,
          },
        },
      ]);
      break;
    default:
      break;
  }
  return {
    type,
    title,
    titleedit,
    navlink,
    url2,
    hidecol,
    fields,
    rows,
    colindex,
  };
};
