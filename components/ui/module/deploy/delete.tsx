import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DELETE_DEPLOY_API } from "@/config/api";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppDispatch } from "@/lib/store";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "../../use-toast";

type formValues = {
  note: string;
};

type UpdateDeployProps = {
  showDelete: boolean;
  setShowDelete: Dispatch<SetStateAction<boolean>>;
  query: {
    campaignId?: string;
    deployId?: string;
  };
  onRefreshData: () => void;
};
export default function DeleteDeploy({
  query,
  setShowDelete,
  showDelete,
  onRefreshData,
}: UpdateDeployProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formValues>();

  useEffect(() => {
    reset({ note: "" });
  }, [reset, showDelete]);

  const handleUpdateDeploy: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    setLoading(true);
    const dataDelete = {
      id: Number(query.deployId),
      note: data.note,
    };
    axiosWithHeaders("post", DELETE_DEPLOY_API, dataDelete)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            toast({
              title: "Thông báo",
              description: "Xóa lắp đặt thành công",
            });
            onRefreshData();
            if (query.campaignId) {
              router.push(`/campaign/${query.campaignId}/deploy`);
            } else {
              router.push("/deploy");
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    setLoading(false);
    setShowDelete(false);
  };
  return (
    <div>
      <Dialog
        open={showDelete}
        onOpenChange={() => {
          setShowDelete(false);
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="p-6 relative z-10 overflow-x-hidden max-h-[90vh]">
            <DialogHeader className="relative z-10 mb-6">
              <DialogTitle>Xóa lắp đặt</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(handleUpdateDeploy)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ghi chú
                  </label>
                  <textarea
                    {...register("note", {
                      required: {
                        value: true,
                        message: "Vui lòng không để trống.",
                      },
                    })}
                    className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {errors.note?.type === "required" && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.note.message}
                  </p>
                )}
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
