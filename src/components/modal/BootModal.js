import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import globalVariable from "actions";

import styled from "styled-components";
import { FaAngleDown } from "react-icons/fa";
import $ from "jquery";

export const BootModal = ({ id, title, children, clickHandler, opt }) => {
  let dialogClass = "modal-dialog";
  if (opt?.dialogClass) dialogClass = opt.dialogClass;
  return (
    <div
      class="modal fade"
      id={id}
      tabindex="-1"
      aria-labelledby="formgetLabel"
      aria-hidden="true"
    >
      <div class={dialogClass}>
        <div class="modal-content">
          <div class="modal-header bg-dark text-white pb-1">
            <p class="fs-5 text-light" id="formgetLabel">
              {title}
            </p>
            <button
              type="button"
              class="btn-close btn-close-white mb-2 me-1"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">{children}</div>
          <ModalFooter class="modal-footer">
            {(() => {
              switch (id) {
                case "formEditTime":
                  return <FormEditTimeFooter clickHandler={clickHandler} />;
                case "formget":
                  return <FormGetFooter clickHandler={clickHandler} />;
                case "formsave":
                  return <FormSaveFooter clickHandler={clickHandler} />;
                case "formEditDriver":
                  return <FormEditDriverFooter clickHandler={clickHandler} />;
                case "formEditBus":
                  return <FormEditBusFooter clickHandler={clickHandler} />;
                case "formCreate":
                  return <FormCreateFooter clickHandler={clickHandler} />;
                default:
                  return <FormDefaultFooter clickHandler={clickHandler} />;
              }
            })()}
          </ModalFooter>
        </div>
      </div>
    </div>
  );
};
const FormDefaultFooter = ({ clickHandler }) => {
  return (
    <ButtonBox>
      <ModalButton
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        닫기
      </ModalButton>
      {clickHandler && (
        <ModalButton
          type="button"
          class="btn btn-primary"
          data-bs-dismiss="modal"
          onClick={clickHandler}
          backcolor="#19289A"
          color="#ffffff"
        >
          적용
        </ModalButton>
      )}
    </ButtonBox>
  );
};
const FormGetFooter = ({ clickHandler }) => {
  return (
    <ButtonBox>
      <ModalButton
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        취소
      </ModalButton>
      <ModalButton
        type="button"
        class="btn btn-primary"
        data-bs-dismiss="modal"
        onClick={clickHandler}
        backcolor="#19289A"
        color="#ffffff"
      >
        확인
      </ModalButton>
    </ButtonBox>
  );
};
const FormSaveFooter = ({ clickHandler }) => {
  let navigate = useNavigate();
  return (
    <ButtonBox>
      <ModalButton
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        onClick={() => {
          navigate("/dispatch/edit");
        }}
      >
        배차일보조회
      </ModalButton>
      <ModalButton
        type="button"
        class="btn btn-primary"
        data-bs-dismiss="modal"
        onClick={() => clickHandler("next")}
      >
        다음날짜 저장
      </ModalButton>
    </ButtonBox>
  );
};

const FormCreateFooter = ({ clickHandler }) => {
  let navigate = useNavigate();
  return (
    <ButtonBox>
      <ModalButton
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        취소
      </ModalButton>
      <ModalButton
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        onClick={() => {
          navigate("/dispatch/create");
        }}
      >
        신규생성
      </ModalButton>
    </ButtonBox>
  );
};
const FormEditTimeFooter = ({ clickHandler }) => {
  const cellUpdate = useSelector((state) => state.global.cellUpdate);
  return (
    <ButtonBox>
      <ModalButton
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        onClick={() => clickHandler("delete", cellUpdate)}
      >
        삭제
      </ModalButton>
      <ModalButton
        type="button"
        class="btn btn-primary"
        data-bs-dismiss="modal"
        onClick={() => clickHandler("update", cellUpdate)}
      >
        수정
      </ModalButton>
    </ButtonBox>
  );
};

const FormEditDriverFooter = ({ clickHandler }) => {
  const cellUpdate = useSelector((state) => state.global.cellUpdate);
  return (
    <ButtonBox>
      <ModalButton type="button" class="btn btn-light" data-bs-dismiss="modal">
        취소
      </ModalButton>
      <ModalButton
        type="button"
        class="btn btn-primary"
        data-bs-dismiss="modal"
        onClick={() => clickHandler(cellUpdate)}
      >
        변경1
      </ModalButton>
    </ButtonBox>
  );
};

const FormEditBusFooter = ({ clickHandler }) => {
  const cellUpdate = useSelector((state) => state.global.cellUpdate);
  return (
    <ButtonBox>
      <ModalButton
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        취소
      </ModalButton>
      <ModalButton
        type="button"
        class="btn btn-primary"
        data-bs-dismiss="modal"
        onClick={() => clickHandler(cellUpdate)}
      >
        변경
      </ModalButton>
    </ButtonBox>
  );
};
export const FormGet = () => {
  const [name, setName] = useState("");
  const [num, setNumber] = useState();
  const dispatch = useDispatch();
  const dayType = useSelector((state) => state.global.dayType);
  const runNumber = useSelector((state) => state.global.runNumber);
  const [viewRunNumber, setViewRunNumber] = useState(runNumber);
  const ymBuff = useSelector((state) => state.global.ymBuff);

  useEffect(() => {
    dayType !== "weekday" ? setViewRunNumber(2) : setViewRunNumber(3);
  }, [dayType]);

  useEffect(() => {
    dispatch(globalVariable({ runNumber: parseInt(viewRunNumber) }));
  }, [viewRunNumber]);

  return (
    <ModalContent>
      <div class="fs-5 fw-bolder mt-2  mb-3 text-center lh-base v-center">
        {ymBuff}
      </div>
      <h4>불러올 양식을 선택해 주세요</h4>
      <div
        class="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btnradio1"
          autocomplete="off"
          onClick={() => {
            setNumber(3);
            dispatch(globalVariable({ dayType: "weekday" }));
          }}
        />
        <label class="btn btn-outline-primary" for="btnradio1">
          평일
        </label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btnradio2"
          autocomplete="off"
          onClick={() => {
            setNumber(2);
            dispatch(globalVariable({ dayType: "saturday" }));
          }}
        />
        <label class="btn btn-outline-primary" for="btnradio2">
          토
        </label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btnradio3"
          autocomplete="off"
          onClick={() => {
            setNumber(2);
            dispatch(globalVariable({ dayType: "holiday" }));
          }}
        />
        <label class="btn btn-outline-primary" for="btnradio3">
          일/공휴
        </label>
      </div>
      <h4>가동대수</h4>
      {/*<CountInput
        class="form-control form-control-lg"
        type="number"
        aria-label=".form-control-lg example"
        value={viewRunNumber}
        onChange={(e) => {
          setViewRunNumber(e.target.value);
        }}
      ></CountInput>*/}
      <h4>{viewRunNumber}</h4>
    </ModalContent>
  );
};
export const FormSave = () => {
  return (
    <div>
      <div class="d-flex justify-content-center mb-3 ">
        <div class="fs-6 fw-bolder  mb-3 text-center lh-base v-center">
          10월 31일 배차일보를 저장하였습니다.
        </div>
      </div>
    </div>
  );
};
export const FormCreate = () => {
  return (
    <div>
      <div class="d-flex justify-content-center mb-3 ">
        <div class="fs-6 fw-bolder  mb-3 text-center lh-base v-center">
          배차내역이 없습니다. 신규로 생성하시겠습니까?
        </div>
      </div>
    </div>
  );
};
export const FormEditTime = () => {
  const [hr, setHr] = useState("");
  const [min, setMin] = useState("");
  const dispatch = useDispatch();
  const cellUpdate = useSelector((state) => state.global.cellUpdate);

  useEffect(() => {
    setHr(cellUpdate?.hr);
    setMin(cellUpdate?.min);
  }, [cellUpdate]);
  const checkTimeMin = (val, type) => {
    switch (type) {
      case "min":
        if (val > 59) {
          alert("분은 59분까지 입력 가능합니다.");

          return false;
        }
        break;
      case "hr":
        if (val > 23) {
          alert("시간은 23시까지 입력 가능합니다.");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };
  return (
    <>
      <div class="d-flex justify-content-center">
        <p class="fs-3">{cellUpdate?.hrmin}</p>
      </div>
      <div class="d-flex justify-content-center my-2">
        <FaAngleDown className="fs-1" />
      </div>
      <div class="d-flex justify-content-sm-center mb-3 row">
        <div class="col-xs-3 col-sm-3 col-md-3">
          <input
            class="form-control form-control-lg"
            type="number"
            value={hr}
            aria-label=".form-control-lg example"
            onChange={(e) => {
              if (checkTimeMin(e.target.value, "hr")) {
                setHr(e.target.value);
                dispatch(
                  globalVariable({
                    cellUpdate: { ...cellUpdate, hr: e.target.value },
                  })
                );
              }
            }}
          />
        </div>
        <div class="col-xs-3 col-sm-3 col-md-3">
          <input
            class="form-control form-control-lg"
            type="number"
            value={min}
            aria-label=".form-control-lg example"
            onChange={(e) => {
              if (checkTimeMin(e.target.value, "min")) {
                setMin(parseInt(e.target.value));
                dispatch(
                  globalVariable({
                    cellUpdate: { ...cellUpdate, min: e.target.value },
                  })
                );
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export const FormEditDriver = () => {
  const [newDriver, setNewDriver] = useState("");
  const [round, setRound] = useState("");
  const dispatch = useDispatch();
  const cellUpdate = useSelector((state) => state.global.cellUpdate);

  function timeNow() {
    var d = new Date(),
      h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
      m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return h + ":" + m;
  }
  return (
    <>
      <div class="d-flex justify-content-center">
        <p class="fs-4 fw-bold">{cellUpdate?.성명}</p>
      </div>
      <div class="d-flex justify-content-center my-2">
        <FaAngleDown className="fs-1" />
      </div>

      <div class="d-flex justify-content-center my-2">
        <div class="col-xs-3 col-sm-3 col-md-3">
          <input
            class="form-control form-control-lg"
            type="text"
            value={cellUpdate.newDriver}
            aria-label=".form-control-lg"
            onChange={(e) => {
              setNewDriver(e.target.value);
              dispatch(
                globalVariable({
                  cellUpdate: { ...cellUpdate, newDriver: e.target.value },
                })
              );
            }}
          />
        </div>
      </div>
      <div class="d-flex justify-content-center my-2">
        <p class="fs-6 fw-bold">현재 시각 {timeNow()}</p>
      </div>
      <div class="d-flex justify-content-center mt-4 mb-1">
        <p class="fs-6 fw-bold">적용회차</p>
      </div>
      <div class="d-flex justify-content-sm-center mb-3 row">
        <div class="col-xs-3 col-sm-3 col-md-3">
          <input
            class="form-control form-control-lg"
            type="number"
            value={cellUpdate.round}
            aria-label=".form-control-lg"
            onChange={(e) => {
              setRound(e.target.value);
              dispatch(
                globalVariable({
                  cellUpdate: { ...cellUpdate, round: e.target.value },
                })
              );
            }}
          />
        </div>
        <div class="d-flex justify-content-center my-2">
          <p>전체적으로 적용할 시, 0을 입력해주세요</p>
        </div>
      </div>
    </>
  );
};
export const FormEditBus = () => {
  const [newBus, setNewBus] = useState("");
  const [round, setRound] = useState("");
  const dispatch = useDispatch();
  const cellUpdate = useSelector((state) => state.global.cellUpdate);

  function timeNow() {
    var d = new Date(),
      h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
      m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return h + ":" + m;
  }
  useEffect(() => {
    $("input").val("");
  }, []);
  return (
    <>
      <div class="d-flex justify-content-center">
        <p class="fs-4 fw-bold">{cellUpdate?.bus.busname}</p>
      </div>
      <div class="d-flex justify-content-center my-2">
        <FaAngleDown className="fs-1" />
      </div>

      <div class="d-flex justify-content-center my-2">
        <div class="col-xs-3 col-sm-3 col-md-3">
          <input
            class="form-control form-control-lg"
            type="text"
            value={cellUpdate.newBus}
            aria-label=".form-control-lg"
            onChange={(e) => {
              setNewBus(e.target.value);
              dispatch(
                globalVariable({
                  cellUpdate: { ...cellUpdate, newBus: e.target.value },
                })
              );
            }}
          />
        </div>
      </div>
      <div class="d-flex justify-content-center my-2">
        <p class="fs-6 fw-bold">현재 시각 {timeNow()}</p>
      </div>
      <div class="d-flex justify-content-center mt-4 mb-1">
        <p class="fs-6 fw-bold">적용회차</p>
      </div>
      <div class="d-flex justify-content-sm-center mb-3 row">
        <div class="col-xs-3 col-sm-3 col-md-3">
          <input
            class="form-control form-control-lg"
            type="number"
            aria-label=".form-control-lg"
            value={cellUpdate.round}
            onChange={(e) => {
              setRound(e.target.value);
              dispatch(
                globalVariable({
                  cellUpdate: { ...cellUpdate, round: e.target.value },
                })
              );
            }}
          />
        </div>
        <div class="d-flex justify-content-center my-2">
          <p>전체적으로 적용할 시, 0을 입력해주세요</p>
        </div>
      </div>
    </>
  );
};

export const ProcessBuilder = () => {
  return (
    <div id="exampleModalToggle" class="modal">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">결재선 선택</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>조직도로 부터 결재대상자를 선택합니다. </p>
            <p>결재 순서를 바꿀수 있습니다. </p>
            <p>drag & drop을 지원합니다. </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              닫기
            </button>
            <button type="button" class="btn btn-primary">
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const ModalContainer = styled.div`
  position: fixed;
  top: 30%;
  left: 49%;
  width: 20rem;
  height: 25rem;
`;
const ModalHeader = styled.div`
  /* z-index:100; */
  height: 2rem;
  background-color: #19289a;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  padding: 0.2rem;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h4 {
    margin: 1rem 0;
    text-align: center;
    font-weight: 700;
  }
`;

const CountInput = styled.input`
  width: 5rem;
  height: 3rem;
  border-radius: 10px;
  border: 1px solid black;
  text-align: center;
  font-size: 1.5rem;
`;
const ButtonBox = styled.div`
  text-align: center;
  button {
    width: 5rem;
    height: 2rem;
    margin: 1rem;
    font-weight: 500;
    border: 1px solid black;
    border-radius: 24px;
  }
`;
const ModalButton = styled.button`
  background-color: ${(props) => props.backcolor || "#ffffff"};
  color: ${(props) => props.color || null};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;
