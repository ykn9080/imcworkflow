import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import globalVariable from "actions";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cnt = useSelector((state) => state.global.processTypeCount);

  const ListItem = ({ count, item }) => {
    return (
      <li>
        <a href="#" class="nav-link px-0">
          <span class="d-none d-sm-inline">
            <Link to={item.path}>{item.title}</Link>
            {item.badge === 1 && (
              <span
                class="badge bg-danger rounded-circle ms-1"
                style={{ fontSize: ".55rem" }}
              >
                {count}
              </span>
            )}
          </span>
        </a>
      </li>
    );
  };

  return (
    <div class="col-auto col-md-2 col-xl-2 px-sm-2 px-0 bg-dark">
      <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 w-100">
        <a
          href="/"
          class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span class="fs-5 d-none d-sm-inline">Menu</span>
        </a>
        <ul class="nav  text-start" style={{ width: "100px" }} id="menu">
          <li class="nav-item">
            <a href="#" class="nav-link px-0">
              <i class="fs-4 bi-house"></i>
              <span class="ms-1 d-none d-sm-inline">
                <Link to="/">Home</Link>
              </span>
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link align-middle px-0">
              <i class="fs-4 bi-house"></i>
              <span class="ms-1 d-none d-sm-inline d-grid">
                <button
                  type="button"
                  class="btn btn-light w-auto"
                  onClick={() => {
                    dispatch(globalVariable({ processArray: null }));
                    navigate(`/form/edit/new?type=ongoing`, { replace: true });
                  }}
                >
                  ?????? ??????
                </button>
              </span>
            </a>
          </li>

          <li>
            <a
              href="#submenu1"
              data-bs-toggle="collapse"
              class="nav-link px-0 "
            >
              <i class="fs-4 bi-speedometer2"></i>
              <span class=" d-none d-sm-inline">??????</span>
            </a>
            <ul
              class="collapse show nav flex-column ms-4"
              id="submenu1"
              data-bs-parent="#menu"
            >
              {menuList1.map((item, index) => {
                const count = cnt?.[item.title];
                if (!(cnt && cnt[item.title])) item.badge = 0;
                return <ListItem item={item} count={count} />;
              })}
            </ul>
          </li>

          <li>
            <a
              href="#submenu2"
              data-bs-toggle="collapse"
              class="nav-link px-0 align-middle"
            >
              <i class="fs-4 bi-speedometer2"></i>
              <span class="d-none d-sm-inline">?????????</span>
            </a>
            <ul
              class="collapse show nav flex-column ms-4"
              id="submenu2"
              data-bs-parent="#menu"
            >
              {menuList2.map((item, index) => {
                const count = cnt?.[item.title];
                if (!(cnt && cnt[item.title])) item.badge = 0;
                return <ListItem item={item} count={count} />;
              })}
            </ul>
          </li>

          <li>
            <a
              href="#submenu21"
              data-bs-toggle="collapse"
              class="nav-link px-0 align-middle"
            >
              <i class="fs-4 bi-speedometer2"></i>
              <span class="d-none d-sm-inline">??????</span>
            </a>
            <ul
              class="collapse show nav flex-column ms-4"
              id="submenu21"
              data-bs-parent="#menu"
            >
              <li class="w-100">
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to="/organization">??????</Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to="/process/list">?????????</Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to="/setting">??????</Link>
                  </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <hr />
        <div class="dropdown pb-4">
          <a
            href="#"
            class="d-flex align-items-left text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/mdo.png"
              alt="hugenerd"
              width="30"
              height="30"
              class="rounded-circle"
            />
            <span class="d-none d-sm-inline mx-1">loser</span>
          </a>
          <ul
            class="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            <li>
              <a class="dropdown-item" href="#">
                New project...
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                Settings
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                Profile
              </a>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <a class="dropdown-item" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

const menuList1 = [
  { title: "??????", name: "??????", path: "/ongoing", badge: 0 },
  { title: "??????", name: "??????", path: "/ongoing/??????", badge: 1 },
  { title: "??????", name: "??????", path: "/ongoing/??????", badge: 0 },
  { title: "??????", name: "??????", path: "/ongoing/??????", badge: 1 },
  { title: "??????", name: "??????", path: "/ongoing/??????", badge: 1 },
  { title: "??????", name: "??????", path: "/ongoing/??????", badge: 0 },
];
const menuList2 = [
  { title: "????????????", name: "??????", path: "/ongoing/??????", badge: 0 },
  {
    title: "????????????",
    name: "archive",
    path: "/form/list?type=archive",
    badge: 0,
  },
  {
    title: "????????????",
    name: "??????",
    path: "/form/list?type=imsi",
    badge: 0,
  },
];
