import { RootState } from "@/lib/redux/store";
import { formatToNaira } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SummaryProps {}

const Summary: FC<SummaryProps> = ({}) => {
  const { selectedSubService, response, selectedSlipType } = useSelector(
    (store: RootState) => store.service
  );
  const router = useRouter();

  useEffect(() => {
    if (!response) router.replace("/dashboard/nin/");
  }, []);

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="space-y-6 ">
        <h3>Summary</h3>

        <div className="space-y-6 text-[13px]">
          <div className="grid grid-cols-2 justify-between items-center">
            <span className="font-thin text-slate-500">Verification Cost</span>
            <span className="font-semibold ">
              {formatToNaira.format(selectedSubService?.price || 0)}
            </span>
          </div>
          <div className="grid grid-cols-2 justify-between items-center">
            <span className="font-thin text-slate-500">Slip Type</span>
            <span className="font-semibold ">
              {selectedSlipType.title || "None Selected"}
            </span>
          </div>
          <div className="grid grid-cols-2 justify-between items-center">
            <span className="font-thin text-slate-500">Slip Cost</span>
            <span className="font-semibold ">
              {selectedSlipType.price === 0 &&
              selectedSlipType.title === "Basic NIN Slip"
                ? "FREE"
                : `${formatToNaira.format(selectedSlipType.price)}`}
            </span>
          </div>

          <hr />

          <div className="grid grid-cols-2 justify-between items-center text-lg">
            <span className="font-thin">Total</span>
            <span className="font-semibold ">
              #{selectedSlipType.price + (selectedSubService?.price || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
