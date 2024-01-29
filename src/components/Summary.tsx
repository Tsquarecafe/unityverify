import { RootState } from "@/lib/redux/store";
import { FC } from "react";
import { useSelector } from "react-redux";

interface SummaryProps {}
const Summary: FC<SummaryProps> = ({}) => {
  const { selectedSubService, selectedSlipType } = useSelector(
    (store: RootState) => store.service
  );
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="space-y-6 ">
        <h3>Summary</h3>

        <div className="space-y-6 text-[13px]">
          <div className="grid grid-cols-2 justify-between items-center">
            <span className="font-thin text-slate-500">Verification Cost</span>
            <span className="font-semibold ">
              #{selectedSubService?.price || 0}
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
                : `#${selectedSlipType.price}`}
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
