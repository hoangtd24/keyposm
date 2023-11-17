import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { useToast } from "../../use-toast";
import { Dialog, DialogContent } from "../../dialog";

type MyWebcamProps = {
  showWebcam: boolean;
  setShowWebcam: React.Dispatch<React.SetStateAction<boolean>>;
  setImgSrc: React.Dispatch<React.SetStateAction<string[]>>;
  setCheckImage: Dispatch<
    SetStateAction<{
      rule: string;
      message: string;
    }>
  >;
};
const MyWebcam = ({
  setImgSrc,
  setShowWebcam,
  setCheckImage,
  showWebcam,
}: MyWebcamProps) => {
  const { toast } = useToast();
  const [error, setError] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    if (!error) {
      return;
    }
    if (error === "OverconstrainedError") {
      toast({
        title: "Thông báo",
        description: "Thiết bị không hỗ trợ",
      });
    }

    if (error === "NotAllowedError: Permission denied") {
      toast({
        title: "Thông báo",
        description: "Bạn cần bật máy ảnh",
      });
    }
  }, [error, toast]);
  const webcamRef = useRef<any>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImgSrc((prev) => {
      if (prev.length === 0) {
        setCheckImage({
          rule: "",
          message: "",
        });
      }
      if (prev.length === 5) {
        setCheckImage({
          rule: "max",
          message: "Vui lòng chọn ít hơn 6 ảnh",
        });
      }
      return [imageSrc, ...prev];
    });
    setShowWebcam(false);
  }, [setCheckImage, setImgSrc, setShowWebcam]);
  return (
    <Dialog
      open={showWebcam}
      onOpenChange={() => {
        setShowWebcam(!showWebcam);
      }}
    >
      <DialogContent className="sm:max-w-[500px] h-[90vh] sm:h-auto p-0">
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: { exact: "environment" } }}
            onUserMediaError={(err) => setError(err.toString())}
            onUserMedia={(stream) => {
              setActive(stream.active);
            }}
            className="w-full"
          />
          {active && (
            <button
              onClick={capture}
              className="absolute left-[50%] bottom-8 translate-x-[-50%] border-4 border-[#fff] rounded-full"
            >
              <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-800"></div>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyWebcam;
