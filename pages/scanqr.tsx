import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SaleCreate from "@/components/ui/module/deploy/SaleCreate";
import Create from "@/components/ui/module/deploy/create";
import CreateDeployNoQr from "@/components/ui/module/deploy/createNoQr";
import Layout from "@/components/ui/module/layout";
import { CheckLocation } from "@/components/ui/module/location";
import SaleCheck from "@/components/ui/module/location/SaleCheck";
import Scanner from "@/components/ui/module/qrcode/scanner";
import CreateTicket from "@/components/ui/module/ticket/create";
import CreateTicketNoQr from "@/components/ui/module/ticket/createNoQr";
import { useAppSelector } from "@/lib/store";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};

export type QrInfo = {
  uuid: string;
  areaId: number;
  campaignId: number;
  brandId: number;
  channelId: number;
  posmId: number;
  channelName: string;
  areaName: string;
  campaignName: string;
  datecreate: string;
  timecreate: string;
  brandName: string;
  note: string;
  images: Image[];
  deployId?: number;
  nameusercreate?: string;
  locationName?: string;
};

type TypeCreate =
  | "deploy"
  | "ticket"
  | "check"
  | "ticket-no-qr"
  | "deploy-no-qr";

const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

export default function Report() {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [showQrInfo, setShowQrInfo] = useState<boolean>(false);
  const [qrInfo, setQrInfo] = useState<QrInfo | null>(null);
  const [typeCreate, setTypeCreate] = useState<TypeCreate>();
  const [roleId, setRoleId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const { access_token } = useAppSelector((state: any) => state.auth);
  const [alert, setAlert] = useState<boolean>(false);
  const [saleCheck, setSaleCheck] = useState<boolean>(false);
  console.log(roleId);

  useEffect(() => {
    const token = localStorage.getItem(token_storage)
      ? localStorage.getItem(token_storage)
      : access_token;
    if (token) {
      const decoded: any = jwtDecode(token);
      const info: any = decoded.data;

      const roleId = info.roleId;
      const userId = info.userId;

      setRoleId(roleId);
      setUserId(userId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  return (
    <Layout
      pageInfo={{
        title: "QUÉT MÃ QR",
        description: "Quét mã QR lắp đặt, báo cáo sự cố , kiểm tra thông tin",
      }}
    >
      {roleId === 5 ? (
        <div className="flex justify-center items-center flex-col gap-3 mt-32">
          <Button
            className="w-52"
            onClick={() => {
              setShowScanner(true);
              setTypeCreate("deploy");
            }}
          >
            Lắp đặt
          </Button>
          <Button
            className="w-52"
            onClick={() => {
              setShowScanner(true);
              setTypeCreate("check");
              setSaleCheck(true);
            }}
          >
            Kiểm tra thông tin
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-3 mt-32">
          <Button
            className="w-52"
            onClick={() => {
              setShowScanner(true);
              setTypeCreate("deploy");
            }}
          >
            Lắp đặt
          </Button>
          <Button
            className="w-52"
            onClick={() => {
              setShowScanner(true);
              setTypeCreate("ticket");
            }}
          >
            Báo cáo sự cố
          </Button>
          <Button
            className="w-52"
            onClick={() => {
              setShowScanner(true);
              setTypeCreate("check");
            }}
          >
            Kiểm tra thông tin
          </Button>
          <Button
            className="w-52"
            onClick={() => {
              setShowQrInfo(true);
              setTypeCreate("deploy-no-qr");
            }}
          >
            Lắp đặt (không QR)
          </Button>
          <Button
            className="w-52"
            onClick={() => {
              setTypeCreate("ticket-no-qr");
              setShowQrInfo(true);
            }}
          >
            Báo cáo sự cố (không QR)
          </Button>
        </div>
      )}

      {showScanner && (
        <Scanner
          setShowScanner={setShowScanner}
          setShowQrInfo={setShowQrInfo}
          setQrInfo={setQrInfo}
          setAlert={setAlert}
          saleCheck={saleCheck}
          setSaleCheck={setSaleCheck}
          showScanner={showScanner}
        />
      )}
      {typeCreate === "deploy" && roleId !== 5 && (
        <Create
          qrInfo={qrInfo}
          showQrInfo={showQrInfo}
          setShowQrInfo={setShowQrInfo}
        />
      )}
      {typeCreate === "ticket" && roleId !== 5 && (
        <CreateTicket
          qrInfo={qrInfo}
          showQrInfo={showQrInfo}
          setShowQrInfo={setShowQrInfo}
        />
      )}
      {typeCreate === "check" && roleId !== 5 && (
        <CheckLocation
          qrInfo={qrInfo}
          showQrInfo={showQrInfo}
          setShowQrInfo={setShowQrInfo}
        />
      )}
      {typeCreate === "ticket-no-qr" && roleId !== 5 && (
        <CreateTicketNoQr
          qrInfo={qrInfo}
          showQrInfo={showQrInfo}
          setShowQrInfo={setShowQrInfo}
          setQrInfo={setQrInfo}
        />
      )}
      {typeCreate === "deploy-no-qr" && roleId !== 5 && (
        <CreateDeployNoQr
          qrInfo={qrInfo}
          showQrInfo={showQrInfo}
          setShowQrInfo={setShowQrInfo}
          setQrInfo={setQrInfo}
        />
      )}
      {typeCreate === "deploy" && roleId === 5 && (
        <SaleCreate
          qrInfo={qrInfo}
          showQrInfo={showQrInfo}
          setShowQrInfo={setShowQrInfo}
          alert={alert}
          setAlert={setAlert}
        />
      )}
      {typeCreate === "check" && roleId === 5 && (
        <SaleCheck
          qrInfo={qrInfo}
          showQrInfo={showQrInfo}
          setShowQrInfo={setShowQrInfo}
          setSaleCheck={setSaleCheck}
        />
      )}
    </Layout>
  );
}
