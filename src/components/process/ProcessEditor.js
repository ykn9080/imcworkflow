import React from "react";
import Beautiful from "components/dnd/Beautiful";
const ProcessEditor = () => {
  return (
    <>
      <p>조직도로 부터 결재대상자를 선택합니다. </p>
      <p>결재 순서를 바꿀수 있습니다. </p>
      <p>drag & drop을 지원합니다. </p>
      <Beautiful />
    </>
  );
};

export default ProcessEditor;
