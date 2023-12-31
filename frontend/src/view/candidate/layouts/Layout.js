import "bootstrap/dist/js/bootstrap.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsBell, BsFillCircleFill } from "react-icons/bs";
import "./layout.css";
import { useDispatch, useSelector } from "react-redux";
import authApi from "../../../api/auth";
import candMsgApi from "../../../api/candidateMessage";
import { candAuthActions } from "../../../redux/slices/candAuthSlice";
import Login from "../auth/Login";
import Pusher from "pusher-js";
import BellDialog from "./BellDialog";

const user_icon = process.env.PUBLIC_URL + "/image/user_icon.png";

function Layout(props) {
  const nav = useNavigate();
  const [bellMsgs, setBellMsgs] = useState([]);
  const [msgStyles, setMsgStyles] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [showBellDialog, setShowBellDialog] = useState(false);
  const [curNotification, setCurNotification] = useState({});

  const dispatch = useDispatch();
  const candidate = useSelector((state) => state.candAuth.current);
  const isAuth = useSelector((state) => state.candAuth.isAuth);

  const handleLogout = async () => {
    await authApi.logout(1);
    dispatch(candAuthActions.logout());
    localStorage.removeItem("candidate_jwt");
    nav("/");
  };

  const getAllMessages = async () => {
    const res = await candMsgApi.getMsgs(candidate.id);
    console.log("bell msgs:", res);
    setBellMsgs(res);
  };
  const handleReadMsg = async (inf) => {
    setShowBellDialog(true);
    setCurNotification(inf);
    // update read status
    if (inf.isRead === 0) {
      await candMsgApi.markAsRead(inf.id);
      let temp = [...bellMsgs];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].id === inf.id) {
          temp[i].isRead = 1;
        }
      }
      setBellMsgs(temp);
    }
    // nav(`/jobs/${inf.job_id}`);
  };
  useEffect(() => {
    let msg_styles = [];
    for (let i = 0; i < bellMsgs.length; i++) {
      if (bellMsgs[i].isRead === 0) {
        setHasNew(true);
        break;
      }
      if (i === bellMsgs.length - 1) setHasNew(false);
    }
    for (let i = 0; i < bellMsgs.length; i++) {
      if (bellMsgs[i].isRead === 0) {
        msg_styles[i] = " text-primary";
      } else msg_styles[i] = " text-secondary";
    }
    setMsgStyles(msg_styles);
  }, [bellMsgs]);

  const getMe = async () => {
    const res = await authApi.getMe(1);
    dispatch(candAuthActions.setCurrentCandidate(res));
  };
  useEffect(() => {
    if (localStorage.getItem("candidate_jwt")) {
      getMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuth) {
      getAllMessages();
      let pusher = new Pusher("5b0ac1136aca9c77eadb", {
        cluster: "ap1",
        encrypted: true,
      });
      let channelName = `candidate-channel_${candidate.id}`;
      let channel = pusher.subscribe(channelName);
      channel.bind("notification-event", (data) => {
        // alert("bell message::", JSON.stringify(data));
        getAllMessages();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <>
      <BellDialog
        show={showBellDialog}
        setShow={setShowBellDialog}
        current={curNotification}
      />
      <header>
        <nav className="navbar navbar-expand-sm bg-light border-bottom py-3 fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand ms-1" to="/">
              Recruitment
            </Link>
            <ul className="navbar-nav me-auto fw-bold">
              <li className="nav-item">
                <Link className="nav-link" to="/companies">
                  Công ty
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/jobs">
                  Việc làm
                </Link>
              </li>
            </ul>
            {!isAuth ? (
              <div className="d-flex">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#login-box"
                  >
                    Đăng nhập
                  </button>
                  <Link to="/sign-up" className="btn btn-outline-primary">
                    Đăng ký
                  </Link>
                </div>
                <div className="ms-2">
                  <a
                    href="/employer/login"
                    className="btn"
                    style={{ backgroundColor: "#c1d7d7" }}
                  >
                    Đăng tuyển, tìm ứng viên
                  </a>
                </div>
              </div>
            ) : (
              <div className="d-flex sidebar-right">
                <div className="me-3 dropdown bell-part">
                  <div
                    className="bell fs-3 dropdown-toggle text-light"
                    data-bs-toggle="dropdown"
                  >
                    <BsBell className="text-dark" />
                  </div>
                  {hasNew && (
                    <div className="bell-new">
                      <BsFillCircleFill />
                    </div>
                  )}
                  <ul className="dropdown-menu shadow">
                    {bellMsgs.length > 0 ? (
                      bellMsgs.map((item, index) => (
                        <div
                          key={"bell_msg" + index}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleReadMsg(item)}
                        >
                          <li
                            className={
                              "dropdown-item text-wrap mb-2 msg-item" +
                              msgStyles[index]
                            }
                          >
                            {item.name}
                          </li>
                        </div>
                      ))
                    ) : (
                      <span className="ms-3">Không có thông báo nào</span>
                    )}
                  </ul>
                </div>
                <div className="dropdown pt-1">
                  <img
                    src={user_icon}
                    alt="user_icon"
                    style={{ width: "35px" }}
                    className="rounded-pill border border-2"
                  />
                  &nbsp;
                  <span
                    style={{ fontSize: "16px", cursor: "pointer" }}
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {candidate.name && candidate.name.firstname}
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/candidate">
                        Tài khoản
                      </a>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main
        className="page-body"
        style={{ minHeight: "78vh", marginTop: "73px" }}
      >
        {!isAuth && <Login />}
        {props.children}
      </main>
      <footer className="bg-light border-top" style={{ paddingTop: "35px" }}>
        <div className="container">
          <div className="row">
            <div
              className="col-md-4"
              style={{ fontSize: "15.6px", paddingLeft: "27px" }}
            >
              <h5>Thông tin liên hệ</h5>
              <p>Email: info@tuyendung.com</p>
              <p>Điện thoại: 0333-555-789</p>
              <p>
                Địa chỉ: 05 Đường Trâu Quỳ, Thị trấn Trâu Quỳ, <br />
                Huyện Gia Lâm, TP.Hà Nội
              </p>
            </div>
            <div className="col-md-4" style={{ paddingLeft: "125px" }}>
              <h5>Chuyên mục</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to={"#"} className="text-secondary no-underline">
                    Việc làm IT
                  </Link>
                </li>
                <li>
                  <Link to={"#"} className="text-secondary no-underline">
                    Việc làm Kế toán
                  </Link>
                </li>
                <li>
                  <Link to={"#"} className="text-secondary no-underline">
                    Việc làm Kinh doanh
                  </Link>
                </li>
                <li>
                  <Link to={"#"} className="text-secondary no-underline">
                    Việc làm Marketing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4" style={{ paddingLeft: "120px" }}>
              <h5>Liên kết</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to={"/"} className="text-secondary no-underline">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to={"/jobs"} className="text-secondary no-underline">
                    Danh sách việc làm
                  </Link>
                </li>
                <li>
                  <Link to={"#"} className="text-secondary no-underline">
                    Hướng dẫn ứng tuyển
                  </Link>
                </li>
                <li>
                  <Link to={"#"} className="text-secondary no-underline">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <p className="text-center">© 2023 Tuyển dụng. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Layout;
