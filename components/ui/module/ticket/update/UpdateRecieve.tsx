import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppDispatch } from "@/lib/store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  NEXT_PUBLIC_LIST_STATUS_API,
  NEXT_PUBLIC_UPDATE_TICKET_API,
} from "@/config/api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { useToast } from "@/components/ui/use-toast";

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};

type Option = {
  value: string;
  label: string;
};

type formValues = {
  status: Option;
  note: string;
  images: Image[];
};

type UpdateTicketProps = {
  showUpdate: boolean;
  setShowUpdate: Dispatch<SetStateAction<boolean>>;
  ticketId: string;
  statusId: number;
  onRefreshData: () => void;
};
export default function UpdateRecieve({
  ticketId,
  setShowUpdate,
  showUpdate,
  statusId,
  onRefreshData,
}: UpdateTicketProps) {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  console.log(loading);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<formValues>();

  useEffect(() => {
    //get list status
    axiosWithHeaders("get", NEXT_PUBLIC_LIST_STATUS_API, null)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              const newResult = [result[1], result[5]];
              setStatus(newResult);
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    reset({ note: "", status: {}, images: [] });
  }, [reset, showUpdate]);

  const handleUpdateTicket: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    setLoading(true);
    const dataCreate = {
      note: data.note,
      status: Number(data.status.value),
      id: ticketId,
    };
    axiosWithHeaders("post", NEXT_PUBLIC_UPDATE_TICKET_API, dataCreate)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          onRefreshData();
          toast({
            title: "Thông báo",
            description: "Cập nhật trạng thái thành công",
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    setShowUpdate(false);
  };

  return (
    <div>
      <Dialog
        open={showUpdate}
        onOpenChange={() => {
          setShowUpdate(false);
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="p-6 relative z-10 overflow-x-hidden max-h-[90vh]">
            <DialogHeader className="relative z-10 mb-6">
              <DialogTitle>Cập nhật trạng thái</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(handleUpdateTicket)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <label
                    htmlFor="province"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Trạng thái
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Không được để trống dòng này",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        name="status"
                        options={status.map((item: any) => {
                          return {
                            value: String(item.id),
                            label: item.statusName,
                          };
                        })}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isSearchable={true}
                        placeholder={"Chọn trạng thái"}
                      />
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ghi chú
                    </label>
                    <textarea
                      {...register("note")}
                      className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="mx-auto my-8 w-40"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>{" "}
                    <span>Đang gửi ...</span>
                  </div>
                ) : (
                  "Gửi"
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
