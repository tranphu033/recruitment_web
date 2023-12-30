import { useEffect, useState } from "react";
import { BsCheckCircle, BsEye, BsSearch, BsXCircle } from "react-icons/bs";
import "./custom.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { MessagePopup } from "./popup";
import employerApi from "../../../api/employer";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import clsx from "clsx";

function CandidateList() {
  const {
    register,
    // formState: { errors },
    handleSubmit,
  } = useForm();
  const [candidates, setCandidates] = useState([]);
  const [curCandidate, setCurCandidate] = useState({});
  const [popupMsg, setPopupMsg] = useState("");
  const [status, setStatus] = useState("0");
  const [option, setOption] = useState("step1");

  const com_inf = useSelector((state) => state.employerAuth.current.employer);
  const isAuth = useSelector((state) => state.employerAuth.isAuth);

  const makeTabStyle = (tabName) => {
    return clsx(
      "fw-600 pb-1 me-5",
      option === tabName
        ? "border-2 border-bottom border-primary"
        : "text-secondary"
    );
  };

  const getCandidateList = async (inf) => {
    const data = { id: com_inf.id, status: status };
    let keyword = "";
    if (inf) {
      keyword = inf.keyword;
    }
    const res = await employerApi.getCandidateList(keyword, data);
    setCandidates(res);
  };

  const handleClickActionBtn = async (cand_inf, key) => {
    console.log("status:", cand_inf.status, "key:", key);
    if (key === 1 && cand_inf.status === 0) {
      const data = { ...cand_inf, request_type: key };
      console.log("data:", data);
      await employerApi
        .processApplying(data)
        .then((res) => {
          console.log(res);
        })
        .catch();
    }
    if (key !== 1) {
      setCurCandidate({ ...cand_inf, request_type: key });
      const prefix_msg =
        key === 2 ? "Chấp nhận ứng viên " : "Từ chối ứng viên ";
      setPopupMsg(
        <p>
          {prefix_msg}
          <strong>
            {cand_inf.lastname} {cand_inf.firstname}
          </strong>
          ?
        </p>
      );
    }
  };

  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
    // console.log(e.target.value);
  };

  useEffect(() => {
    if (isAuth) getCandidateList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isAuth]);

  return (
    <>
      <div
        className="bg-white"
        style={{
          height: "94%",
          margin: "15px 0px 0px 18px",
        }}
      >
        <Tab.Container onSelect={(k) => setOption(k)}>
          <Nav className="pb-1 justify-content-center bg-light shadow-sm">
            <Nav.Item>
              <Nav.Link eventKey="step1">
                <span className={makeTabStyle("step1")}>Duyệt hồ sơ</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="step2">
                <span className={makeTabStyle("step2")}>Duyệt phỏng vấn</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="step3">
                <span className={makeTabStyle("step3")}>Đã tiếp nhận</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Tab.Container>
        <div style={{ marginLeft: "35px" }}>
          <Form className="mt-3" onSubmit={handleSubmit(getCandidateList)}>
            <Form.Group className="input-group" style={{ width: "35%" }}>
              <Form.Control
                size="sm"
                type="text"
                className="border-end-0"
                placeholder="Nhập tên, email ứng viên, việc làm"
                {...register("keyword")}
              />
              <button type="submit" className="input-group-text bg-white">
                <BsSearch />
              </button>
            </Form.Group>
            <div className="d-flex align-items-center mt-3 ts-ssm">
              <div className="fw-500">Trạng thái: </div>&nbsp;
              <Form.Select
                size="sm"
                className="rounded"
                name="status"
                style={{ width: "13%" }}
                onChange={handleChangeStatus}
              >
                <option value="0">Chưa duyệt</option>
                <option value="2">Đã chấp nhận</option>
              </Form.Select>
            </div>
          </Form>

          <div className="mt-3" style={{ width: "90%" }}>
            <table className="table table-borderless border text-center">
              <thead className="table-danger ts-ssm">
                <tr>
                  <th style={{ width: "17%" }}>Họ tên</th>
                  <th style={{}}>Vị trí ứng tuyển</th>
                  <th style={{ width: "15%" }}>Thời gian</th>
                  <th style={{ width: "12%" }}>Số điện thoại</th>
                  <th style={{ width: "18%" }}>Email</th>
                  <th style={{ width: "13%" }}>Hành động</th>
                </tr>
              </thead>
              <tbody className="ts-sm">
                {candidates.length !== 0 &&
                  candidates.map((item) => (
                    <tr key={item.jname + item.phone}>
                      <td>{item.lastname + " " + item.firstname}</td>
                      <td>{item.jname}</td>
                      <td>{item.appliedTime}</td>
                      <td>{item.phone}</td>
                      <td>{item.email}</td>
                      <td style={{ fontSize: "17px" }}>
                        {status === "0" && (
                          <>
                            <button
                              className="border-0 bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#infModal"
                              onClick={() => handleClickActionBtn(item, 2)}
                            >
                              <BsCheckCircle className="text-success" />
                            </button>
                            <button
                              className="border-0 bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#infModal"
                              onClick={() => handleClickActionBtn(item, 3)}
                            >
                              <BsXCircle className="ms-2 text-danger" />
                            </button>
                          </>
                        )}
                        <a
                          className="ms-2"
                          style={{ textDecoration: "none" }}
                          href={item.cv_link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <BsEye
                            type="button"
                            className="text-primary"
                            onClick={() => handleClickActionBtn(item, 1)}
                          />
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {candidates.length === 0 && (
              <h5 className="">Không có bản ghi nào</h5>
            )}
            <MessagePopup message={popupMsg} cand_inf={curCandidate} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CandidateList;
