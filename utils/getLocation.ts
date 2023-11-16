import { Dispatch } from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
type Toast = Omit<ToasterToast, "id">;
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type LocationProps = {
  setLocation: Dispatch<any>;
  toast: ({ ...props }: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
};
export const position = async ({
  setLocation,
}: Pick<LocationProps, "setLocation">) => {
  navigator.geolocation.getCurrentPosition(
    (position) =>
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
    (err) => console.log(err)
  );
};
export function getLocation({ setLocation, toast }: LocationProps) {
  if (navigator.geolocation) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          toast({
            title: "Lỗi !",
            description: "Vui lòng bật vị trí và tải lại trang",
          });
        } else {
          position({ setLocation });
        }
      });
  } else {
    toast({
      title: "Lỗi !",
      description: "Geolocation is not supported in your browser",
    });
  }
}
