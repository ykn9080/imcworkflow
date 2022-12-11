import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Body from "../components/layout/Body";
import Header from "../components/layout/Header";
import { Tabs } from "antd";
import AntTree from "components/tree/AntTree";

const Organization = () => {
  const PageHeader = () => {
    return <Header title="조직설정" />;
  };
  const onChange = (key) => {
    console.log(key);
  };
  const array = [
    { label: "부서", children: <AntTree /> },
    { label: "직급", children: <p>직급을 입력하는 테이블</p> },
    {
      label: "직원",
      children: (
        <p>
          직원리스트 보임. 기본 직원은 smart에서 입력함. 부서, 직급 등 부가적인
          내용을 등록함
        </p>
      ),
    },
  ];
  return (
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <Sidebar />
        <Body>
          <PageHeader />
          <Tabs
            onChange={onChange}
            type="card"
            items={array.map((k, i) => {
              const id = String(i + 1);
              return {
                label: k.label,
                key: id,
                children: k.children,
              };
            })}
          />
        </Body>
      </div>
    </div>
  );
};

export default Organization;
