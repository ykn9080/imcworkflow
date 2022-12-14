import React, { useEffect, useState } from "react";

const FormContent = ({ lk, formdt }) => {
  const [linkobj, setLinkobj] = useState({});
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setLinkobj(lk);
    setFormData(formdt);
  }, [formdt]);
  return (
    <div>
      <h4>{formData?.formTitle}</h4>
      <div
        class="text-start"
        dangerouslySetInnerHTML={{ __html: formData?.html }}
      />
    </div>
  );
};

export default FormContent;
