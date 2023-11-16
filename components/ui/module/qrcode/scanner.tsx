import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import QrScanner from "qr-scanner";
import { QrInfo } from "@/pages/scanqr";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { CHECK_INFO_QRCODE_API, DETAIL_QRCODE_API } from "@/config/api";
import * as enums from "@/lib/enums";
import { useToast } from "../../use-toast";
import { Dialog, DialogContent } from "../../dialog";

interface ScannerProps {
  setShowScanner: Dispatch<SetStateAction<boolean>>;
  setShowQrInfo: Dispatch<SetStateAction<boolean>>;
  setQrInfo: Dispatch<SetStateAction<QrInfo | null>>;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  saleCheck?: boolean;
  showScanner: boolean;
  setSaleCheck: Dispatch<SetStateAction<boolean>>;
}

const Scanner = ({
  setQrInfo,
  setShowQrInfo,
  setShowScanner,
  setAlert,
  saleCheck,
  showScanner,
  setSaleCheck,
}: ScannerProps) => {
  const { toast } = useToast();
  const video = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((mediaStream) => {
        const tracks = mediaStream.getTracks();
        setActive(tracks[0].enabled);
      });
  }, [active]);
  function handleScan(result: QrScanner.ScanResult) {
    //Logic with scanned qr code
    if (!result.data) {
      return;
    }
    qrScanner?.stop();
    const uuid = result.data?.split("/")[3];
    if (saleCheck) {
      axiosWithHeaders("post", CHECK_INFO_QRCODE_API, {
        uuid: uuid,
      })
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const { status, result, message } = response.data;
            if (status === enums.STATUS_RESPONSE_OK) {
              if (result) {
                setQrInfo(result);
                setShowQrInfo(true);
                setShowScanner(false);
              }
            } else {
              toast({
                title: "Thông báo",
                description: message,
              });
              setShowScanner(false);
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
          setShowScanner(false);
        });
    } else {
      axiosWithHeaders("post", DETAIL_QRCODE_API, {
        uuid: uuid,
      })
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const { status, result, message } = response.data;
            if (status === enums.STATUS_RESPONSE_OK) {
              if (result) {
                setQrInfo(result);
                setShowQrInfo(true);
                setShowScanner(false);
              }
            } else if (status === enums.STATUS_HAVE_DEPLOYED) {
              setAlert(true);
              setShowScanner(false);
              setQrInfo(result);
            } else {
              toast({
                title: "Thông báo",
                description: message,
              });
              setShowScanner(false);
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
          setShowScanner(false);
        });
    }
  }

  useEffect(() => {
    if (video.current) {
      const qrScanner = new QrScanner(
        video.current,
        (result) => {
          handleScan(result);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      qrScanner;
      qrScanner.start();
      setQrScanner(qrScanner);
    }
    // Dependency array missing handleScan, since it should not set Scanner on handleScan change
    // eslint-disable-next-line
  }, [video.current, active]);

  return active ? (
    <Dialog
      open={showScanner}
      onOpenChange={async () => {
        setShowScanner(!showScanner);
        setSaleCheck(false);
        qrScanner?.pause();
        qrScanner?.stop();
        qrScanner?.destroy();
        setQrScanner(null);
      }}
    >
      <DialogContent className="sm:max-w-[500px] p-0 shadow-none">
        <div className="relative z-10 overflow-x-hidden sm:h-fit h-[90vh] max-h-[90vh]">
          <video ref={video} id="video" className="w-full h-full"></video>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <video ref={video} id="video" className="w-0 h-0"></video>
  );
};

export default Scanner;
