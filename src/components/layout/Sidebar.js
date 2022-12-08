import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const cnt = useSelector((state) => state.global.processTypeCount);

  useEffect(() => {
    console.log(cnt);
  }, [cnt]);
  return (
    <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
      <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 w-100">
        <a
          href="/"
          class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span class="fs-5 d-none d-sm-inline">Menu</span>
        </a>
        <ul
          class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-left align-items-sm-start w-auto"
          id="menu"
        >
          <li class="nav-item">
            <a href="#" class="nav-link align-middle px-0">
              <i class="fs-4 bi-house"></i>{" "}
              <span class="ms-1 d-none d-sm-inline">
                <Link to="/">Home</Link>
              </span>
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link align-middle px-0">
              <i class="fs-4 bi-house"></i>{" "}
              <span class="ms-1 d-none d-sm-inline d-grid">
                <button
                  type="button"
                  class="btn btn-light w-auto"
                  onClick={() => navigate(`/form/edit/-1`, { replace: true })}
                >
                  기안
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
              <span class="ms-1 d-none d-sm-inline">결재</span>
            </a>
            <ul
              class="collapse show nav flex-column"
              id="submenu1"
              data-bs-parent="#menu"
            >
              <li class="w-100">
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to="/ongoing">전체</Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to={`/ongoing/결재`}>
                      대기{" "}
                      {cnt && cnt["결재"] && (
                        <span class="badge bg-danger rounded-circle ">
                          {cnt["결재"]}
                        </span>
                      )}
                    </Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to={`/ongoing/진행`}>
                      진행
                      {cnt && cnt["진행"] && (
                        <span class="badge bg-danger rounded-circle ">
                          {cnt["진행"]}
                        </span>
                      )}
                    </Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to={`/ongoing/반려`}>
                      반려{" "}
                      {cnt && cnt["반려"] && (
                        <span class="badge bg-danger rounded-circle ">
                          {cnt["반려"]}
                        </span>
                      )}
                    </Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to={`/ongoing/완료`}>
                      완료{" "}
                      {cnt && cnt["완료"] && (
                        <span class="badge bg-danger rounded-circle ">
                          {cnt["완료"]}
                        </span>
                      )}
                    </Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to={`/ongoing/5`}>참조</Link>
                  </span>
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a
              href="#submenu2"
              data-bs-toggle="collapse"
              class="nav-link px-0 align-middle"
            >
              <i class="fs-4 bi-speedometer2"></i>
              <span class="ms-1 d-none d-sm-inline">보관함</span>
            </a>
            <ul
              class="collapse show nav flex-column"
              id="submenu2"
              data-bs-parent="#menu"
            >
              <li class="w-100">
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to={`/ongoing/기안`}>
                      기안
                      {cnt && cnt["기안"] && (
                        <span class="badge bg-danger rounded-circle ">
                          {cnt["기안"]}
                        </span>
                      )}
                    </Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to={`/ongoing/결재요청`}>
                      요청
                      {cnt && cnt["결재요청"] && (
                        <span class="badge bg-danger rounded-circle ">
                          {cnt["결재요청"]}
                        </span>
                      )}
                    </Link>
                  </span>
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a
              href="#submenu21"
              data-bs-toggle="collapse"
              class="nav-link px-0 align-middle"
            >
              <i class="fs-4 bi-speedometer2"></i>
              <span class="ms-1 d-none d-sm-inline">설정</span>
            </a>
            <ul
              class="collapse show nav flex-column"
              id="submenu21"
              data-bs-parent="#menu"
            >
              <li class="w-100">
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to="/about">조직</Link>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link px-0">
                  <span class="d-none d-sm-inline">
                    <Link to="/contact">환경</Link>
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
