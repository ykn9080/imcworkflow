import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import { useNavigate, Link } from "react-router-dom";
import {
  getData,
  makeColumn,
  hideColumn,
  convertRows,
  appendButton,
  fetchFormById,
} from "components/dataget/fetchData";
import $ from "jquery";
import { BootModal } from "components/modal/BootModal";
import { Table } from "antd";
import Spinner from "utilities/spinner";
import FormContent from "components/contents/FormContent";
import { RiPencilFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";

const FormListComponent = ({ lk }) => {
  const navigate = useNavigate();
  //location.pathname;
  const dispatch = useDispatch();
  const [tbdata, setTbdata] = useState([]);
  const [tbcolumn, setTbcolumn] = useState(false);
  const [modal, setModal] = useState();
  //   const [linkobj, setLinkobj] = useState();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.global.userId);

  useEffect(() => {
    //setLinkobj(lk);
    fetchData(lk);
  }, [lk]);

  const fetchData = async (lk) => {
    setLoading(true);
    let rtn = await getData(lk.url2, "get");
    setLoading(false);
    makeDataSet(rtn.data, lk);
  };
  const clickModal = async (record) => {
    //const path = `/form/${record.id}?type=${lk?.type}`;
    setLoading(true);
    const rtn = await fetchFormById(record.id, lk);
    setLoading(false);
    const modal = {
      id: "preview",
      title: "미리보기",
      child: <FormContent lk={lk} formdt={rtn} />,
      opt: { dialogClass: "modal-dialog modal-xl" },
    };
    setModal(modal);
    setTimeout(() => {
      $("#btnModal").click();
    }, 0);
  };
  const colMaker = (data, lk) => {
    let mcol = makeColumn(data, {
      fields: lk?.fields,
    });
    mcol = hideColumn(mcol, lk?.hidecol);
    return mcol;
  };
  async function fetchForm(id, lk) {
    setLoading(true);
    const rtn = await fetchFormById(id, lk);
    setLoading(false);
    return rtn;
  }
  const makeDataSet = (data, lk) => {
    let cols = colMaker(data, lk);
    if (!cols) return;
    cols[lk?.colindex].render = (text, record) => {
      const path = `/form/${record.id}?type=${lk?.type}`;
      return (
        <a class="text-decoration-none" onClick={() => clickModal(record)}>
          {text}
        </a>
      );
      //return <Link to={path}>{text}</Link>;
    };
    const cellClick = async (record) => {
      navigate(`/form/edit/${record.id}?type=${lk?.type}`);
    };
    const deleteClick = async (record) => {
      //navigate(`/form/edit/${record.id}?type=${lk?.type}`);
      console.log("ssss");
    };
    const btnarr = [
      {
        click: cellClick,
        dataIndex: "id",
        opt: {
          btnstyle: "text",
          title: "",
          //btntitle: "edit",
          icon: <RiPencilFill size="lg" />,
        },
      },
      {
        click: deleteClick,
        dataIndex: "id",
        opt: {
          btnstyle: "text",
          title: "",
          //btntitle: "edit",
          confirm: true,
          icon: <BsFillTrashFill size="lg" />,
        },
      },
    ];
    cols = appendButton(cols, btnarr);

    setTbcolumn(cols);
    data = convertRows(data, lk?.rows);
    setTbdata(data);
    dispatch(globalVariable({ imsiForm: data }));
  };
  const showModal = (modal) => {
    setModal(modal);
    //$("#btnModal").click();
    setTimeout(() => {
      $("#btnModal").click();
    }, 0);
  };
  return (
    <div>
      {loading && <Spinner />}
      <Table dataSource={tbdata} columns={tbcolumn} />
      <BootModal
        id={modal?.id}
        title={modal?.title}
        clickHandler={modal?.evt}
        opt={modal?.opt}
      >
        {modal?.child}
      </BootModal>
      <button
        id="btnModal"
        style={{ display: "none" }}
        data-bs-toggle="modal"
        data-bs-target={`#${modal?.id}`}
      >
        aa
      </button>
    </div>
  );
};

export default FormListComponent;
