import React from "react";

const Header = ({ title, right }) => {
  return (
    <div class="mb-5 mt-4 text-dark border-bottom border-dark">
      <div class="d-flex justify-content-between align-items-baseline">
        <p class="fw-bold fs-2" style={{ marginBottom: 3 }}>
          {title}
        </p>
        <p class="flex-shrink-1 " style={{ marginBottom: 3 }}>
          {right}
        </p>
      </div>
    </div>
  );
};

export default Header;
