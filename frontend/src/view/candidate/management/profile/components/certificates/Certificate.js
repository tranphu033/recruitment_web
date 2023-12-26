import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FrameLayout from "../frameLayout";
import CertificateFormDialog from "./CertificateFormDialog";
import certificateApi from "../../../../../../api/certificate";
import dayjs from "dayjs";

export default function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const [actType, setActType] = useState("VIEW");
  const [current, setCurrent] = useState({});

  const isAuth = useSelector((state) => state.candAuth.isAuth);
  const getAll = async () => {
    const res = await certificateApi.getByCurrentCandidate();
    setCertificates(res);
  };
  const handleDelete = async (id) => {
    let choice = window.confirm("Bạn có chắc muốn xóa Chứng chỉ này?");
    if (choice) {
      await certificateApi.destroy(id);
      let temp = certificates.filter((item) => {
        return item.id !== id;
      });
      setCertificates(temp);
    }
  };
  const handleEdit = (item) => {
    setActType("EDIT");
    setCurrent(item);
  };

  useEffect(() => {
    if (isAuth) {
      getAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <FrameLayout
      title="Chứng chỉ"
      hasaddbtn={true}
      className="mt-4"
      setActType={setActType}
    >
      {certificates?.map((item, index) => (
        <div key={index}>
          <hr />
          <div className="border-0 border-success border-start ps-3 d-inline-block">
            <div className="fw-bold">{item.name}</div>
            <div>
              <span className="text-secondary ts-xs">
                {dayjs(item.receive_date).format("DD/MM/YYYY")}
                {item.expire_date &&
                  " - " + dayjs(item.expire_date).format("DD/MM/YYYY")}
              </span>
            </div>
            {item.image && (
              <a
                className="nav-link text-primary"
                href={item.image}
                target="_blank"
                rel="noreferrer"
              >
                <span className="ts-ssm">Ảnh</span>
              </a>
            )}
          </div>
          <div className="mt-2 float-md-end">
            <Stack direction="horizontal" gap={2}>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => handleEdit(item)}
              >
                Sửa
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleDelete(item.id)}
              >
                Xóa
              </Button>
            </Stack>
          </div>
        </div>
      ))}
      {actType !== "VIEW" && (
        <CertificateFormDialog
          actType={actType}
          setActType={setActType}
          current={current}
          getAll={getAll}
        />
      )}
    </FrameLayout>
  );
}