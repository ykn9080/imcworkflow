import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalVariable from "actions";
import { Link } from "react-router-dom";
import "assets/css/sidebars.css";

const Sidebar1 = () => {
  const menu1 = [
    { title: "전체", url: "/ongoing" },
    { title: "대기", url: "/ongoing/결재" },
    { title: "진행", url: "/ongoing/진행" },
    { title: "반려", url: "/ongoing/반려" },
    { title: "완료", url: "/ongoing/완료" },
    { title: "참조", url: "/ongoing/참조" },
  ];
  const menu2 = [
    { title: "기안", url: "/ongoing/기안" },
    { title: "결재요청", url: "/ongoing/결재요청" },
  ];
  const menu3 = [
    { title: "환경", url: "/ongoing/기안" },
    { title: "결재요청", url: "/ongoing/결재요청" },
  ];
  return (
    <main>
      <div class="flex-shrink-0 p-3 bg-white" style={{ width: 120 }}>
        <a
          href="/"
          class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom"
        >
          <span class="fs-5 fw-semibold">전자결재</span>
        </a>
        <ul class="list-unstyled ps-0">
          <li>
            <a href="#" class="link-dark rounded">
              <span class=" rounded fw-bold" style={{ width: 70 }}>
                <Link style={{ color: "black", textDecoration: "none" }} to="/">
                  HOME
                </Link>
              </span>
            </a>
          </li>

          <li class="border-top my-3"></li>
          <li class="mb-1">
            <button
              class="btn btn-toggle align-items-center rounded collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#home-collapse"
              aria-expanded="true"
              style={{ width: 100 }}
            >
              결재
            </button>
            <div class="collapse show" id="home-collapse">
              <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                {menu1.map((item) => (
                  <li>
                    <a href="#" class="link-dark rounded">
                      <span style={{ width: 70 }}>
                        <Link to={item.url}>{item.title}</Link>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li class="mb-1">
            <button
              class="btn btn-toggle align-items-center rounded collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#dashboard-collapse"
              aria-expanded="false"
            >
              문서함
            </button>
            <div class="collapse" id="dashboard-collapse">
              <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                {menu2.map((item) => (
                  <li>
                    <a href="#" class="link-dark rounded">
                      <span style={{ width: 70 }}>
                        <Link to={item.url}>{item.title}</Link>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li class="mb-1">
            <button
              class="btn btn-toggle align-items-center rounded collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#orders-collapse"
              aria-expanded="false"
            >
              Setting
            </button>
            <div class="collapse" id="orders-collapse">
              <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                {menu3.map((item) => (
                  <li>
                    <a href="#" class="link-dark rounded">
                      <span style={{ width: 70 }}>
                        <Link to={item.url}>{item.title}</Link>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default Sidebar1;
