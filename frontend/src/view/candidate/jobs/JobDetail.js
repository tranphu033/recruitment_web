import "./job.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  BsCalendar2Check,
  BsCalendarEvent,
  BsFillBriefcaseFill,
  BsFillGeoAltFill,
  BsFillPeopleFill,
  BsFillPersonFill,
  BsPersonWorkspace,
} from "react-icons/bs";
import { FaIndustry } from "react-icons/fa";
import { useSelector } from "react-redux";
import jobApi from "../../../api/job";
import candidateApi from "../../../api/candidate";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import dayjs from "dayjs";
import Button from "react-bootstrap/Button";
import AppyingDialog from "./ApplyingDialog";
import { toast } from "react-toastify";

function Job() {
  const { id } = useParams();
  const nav = useNavigate();
  const [job, setJob] = useState({
    employer: {},
    jtype: {},
    jlevel: {},
    industries: {},
  });
  const user = useSelector((state) => state.candAuth.current);
  const isAuth = useSelector((state) => state.candAuth.isAuth);

  const [showDialog, setShowDialog] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [industries, setIndustries] = useState([]);

  const getJobInf = async () => {
    const res = await jobApi.getById(id);
    setJob(res);
    setIndustries(res.industries);
  };

  const checkApplying = async () => {
    const res = await jobApi.checkApplying(id);
    setIsApplied(res.value);
    console.log("is applying?", res.value);
  };

  const checkLoggedIn = () => {
    if (!isAuth) {
      toast.error("Vui lòng đăng nhập!");
    } else {
      setShowDialog(true);
    }
  };
  const checkJobSaved = async () => {
    const res = await candidateApi.checkJobSaved(id);
    setIsSaved(res.value);
    console.log("save job?:", res.value);
  };
  const handleClickSaveBtn = async (status) => {
    const data = { status: status };
    const res = await candidateApi.processJobSaving(id, data);
    console.log('res::', res);
    setIsSaved(!isSaved);
  };

  useEffect(() => {
    getJobInf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (isAuth) {
      checkApplying();
      checkJobSaved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <div style={{ margin: "0 10%" }}>
      <div className="container image-container d-flex justify-content-center">
        <img
          src={job.employer.image}
          className="mx-auto d-block mt-3"
          style={{ maxWidth: "93%", maxHeight: "400px" }}
          alt={"com-img-" + job.employer.id}
        />
      </div>
      <div className="d-flex mt-3">
        <div className="left-part">
          <div className="bg-white shadow-sm pb-4">
            <div className="d-flex border-bottom ps-4 pe-4">
              <div
                className="d-flex align-items-center ms-2 mt-4 mb-3"
                style={{ minWidth: "130px" }}
              >
                <img
                  src={job.employer.logo}
                  width="100%"
                  alt={job.employer.name}
                />
              </div>
              <div className="container pt-2" style={{ marginLeft: "25px" }}>
                <div>
                  <div className="">
                    <h4 className="mt-3">{job.jname}</h4>
                  </div>
                  <div className="clearfix mt-3 mb-2">
                    <button
                      className="btn btn-primary ts-sm"
                      disabled={isApplied === true}
                      onClick={checkLoggedIn}
                    >
                      {isApplied === true ? "Đã ứng tuyển" : "Ứng tuyển"}
                    </button>
                    <button
                      className="btn border-danger text-danger ms-5 ts-sm"
                      onClick={() => handleClickSaveBtn(!isSaved)}
                    >
                      {!isSaved ? (
                        <div>
                          <AiOutlineHeart className="fs-5" /> Lưu việc làm
                        </div>
                      ) : (
                        <div>
                          <AiFillHeart className="fs-5" /> Hủy lưu việc làm
                        </div>
                      )}
                    </button>
                    {isAuth && (
                      <AppyingDialog
                        show={showDialog}
                        setShow={setShowDialog}
                        job={job}
                        user={user}
                        jobId={id}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-cols-2 row-cols-lg-3 p-3 ps-5 ts-smd">
              <div className="d-flex mb-2 border-bottom pb-1">
                <div>
                  <FaIndustry className="text-main me-2 mb-1" />
                </div>
                <div>
                  <div className="text-main">Ngành nghề</div>
                  <div className="ts-sm fw-500">
                    {industries.map((item, index) => (
                      <span key={"industry" + item.id}>
                        {item.name}
                        {index !== industries.length - 1 ? ", " : null}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="d-flex mb-2 border-bottom pb-1">
                <div>
                  <MdOutlineAttachMoney className="fs-5 text-main mb-1" />
                </div>
                <div>
                  <div className="text-main">Lương</div>
                  <div className="fw-500">
                    {job.min_salary ? (
                      <span>
                        {job.min_salary} - {job.max_salary} triệu VND
                      </span>
                    ) : (
                      <span>Thỏa thuận</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex mb-2 border-bottom pb-1">
                <div>
                  <BsFillBriefcaseFill className="ts-md text-main me-2 mb-1" />
                </div>
                <div>
                  <div className="text-main">Kinh nghiệm</div>
                  <div className="fw-500">
                    {job.yoe ? (
                      <span>{job.yoe} năm</span>
                    ) : (
                      <span>Không yêu cầu</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex mb-2 border-bottom pb-1">
                <div>
                  <BsFillPeopleFill className="text-main me-1 mb-1" />
                </div>
                <div>
                  <div className="text-main">Số lượng</div>
                  <span className="fw-500">{job.amount} người</span>
                </div>
              </div>
              <div className="d-flex mb-2 border-bottom pb-1">
                <div>
                  <BsPersonWorkspace className="text-main me-2 mb-1" />
                </div>
                <div>
                  <div className="text-main">Hình thức</div>
                  <span className="fw-500">{job.jtype.name}</span>
                </div>
              </div>
              <div className="d-flex mb-2 border-bottom pb-1">
                <div>
                  <BsFillPersonFill className="text-main me-2 mb-1" />
                </div>
                <div>
                  <div className="text-main">Cấp bậc</div>
                  <span className="fw-500">{job.jlevel.name}</span>
                </div>
              </div>
              <div className="d-flex border-bottom pb-1">
                <div>
                  <BsCalendarEvent className="text-main me-2 mb-1" />
                </div>
                <div>
                  <div className="text-main">Ngày đăng</div>
                  <span className="fw-500">
                    {dayjs(job.created_at).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
              <div className="d-flex border-bottom pb-1">
                <div>
                  <BsCalendar2Check className="text-main me-2 mb-1" />
                </div>
                <div>
                  <div className="text-main"> Hạn nộp</div>
                  <span className="fw-500">
                    {dayjs(job.expire_at).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white mt-4 mb-5 shadow-sm">
            <h5 className="bg-main text-white p-3">Chi tiết về job</h5>
            <div className="p-3">
              {job.description ? (
                <div className="whitespace-preline">{job.description}</div>
              ) : (
                "Chưa cập nhật thông tin"
              )}
            </div>
          </div>
        </div>
        <div className="right-part ps-3">
          <div className="bg-white pb-2 shadow-sm">
            <div className="d-flex align-items-center ms-2">
              <div
                className="d-flex align-items-center"
                style={{ width: "90px", height: "90px" }}
              >
                <img
                  src={job.employer.logo}
                  width="100%"
                  alt={job.employer.name}
                />
              </div>
              <div className="fw-bold ms-2">{job.employer.name}</div>
            </div>
            <div className="mx-2 ts-smd">
              <div className="d-flex">
                <div
                  className="d-flex align-items-center text-secondary"
                  style={{ minWidth: "90px" }}
                >
                  <IoMdPeople className="fs-5 me-1" />
                  Quy mô:
                </div>
                <div>
                  {job.employer.min_employees ? (
                    <>
                      {job.employer.min_employees}
                      {job.employer.max_employees !== 0
                        ? " - " + job.employer.max_employees
                        : "+ "}{" "}
                      nhân viên
                    </>
                  ) : (
                    "Chưa cập nhật"
                  )}
                </div>
              </div>
              <div className="d-flex">
                <div className="text-secondary" style={{ minWidth: "90px" }}>
                  <BsFillGeoAltFill className="me-1 mb-1" />
                  Địa điểm:
                </div>
                <div
                  className="whitespace-preline"
                  style={{ fontSize: "14.5px" }}
                >
                  {job.address}
                </div>
              </div>
              <Button
                size="sm"
                className="container-fluid mt-1 bg-main"
                onClick={() => nav(`/companies/${job.employer.id}`)}
              >
                Xem trang công ty
              </Button>
            </div>
          </div>
          {/* <div className="bg-white mt-3 p-2">
            kkk
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Job;
