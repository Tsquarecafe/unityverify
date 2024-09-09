"use client";

import Summary from "@/components/Summary";
import SelectSlip from "@/components/slips/SelectSlip";
import { Button, buttonVariants } from "@/components/ui/Button";
import { RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SlipProps {}
const Slip: FC<SlipProps> = ({}) => {
  const {
    slipUrl,
    response,
    selectedSlipType: { title },
  } = useSelector((store: RootState) => store.service);
  const [currentSlipUrl, setCurrentSlipUrl] = useState<string>();
  const router = useRouter();
  console.log(response,'res')
  // console.log(response?.photo,"photo" ,response?.address.addressLine)
  useEffect(() => {
    if (slipUrl) {
      setCurrentSlipUrl(slipUrl);
    }
  }, [slipUrl]);

  const openSlipInWindow = () => {
    if (typeof window !== "undefined" && currentSlipUrl)
      window.open(currentSlipUrl);
  };

  return (
    <div className="my-6 md:my-10 mx-4">
      <Button
        onClick={() => router.back()}
        className={cn("mb-4", buttonVariants({ variant: "ghost" }))}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className="flex items-center gap-6 flex-col md:flex-row">
        <div className="flex-1 space-y-4">
          <h2 className="text-4xl mb-6 font-semibold">
            Transaction Completed Successfully
          </h2>
          <p className="text-slate-400 text-sm leading-6">
            Thank you for choosing to verify with us at <b>UnityVerify</b>. Your
            <b> slips</b> or verification result are ready and can be accessed
            through the links below. Do not hesitate to reach out to us should
            you encounter any challenge. Have a great moment!
          </p>

          {currentSlipUrl && (
            <div className="flex gap-6 items-center">
              {response ? (
                <a
                  download={`${title}_for_${response.data?.firstName}_${response?.data.lastName}_from_UnityVerify  `}
                  href={currentSlipUrl}
                  className={`${buttonVariants()} text-xs flex items-center `}
                >
                  <Download />
                  Download Slip
                </a>
              ) : null}

              <Button
                onClick={openSlipInWindow}
                className="flex gap-2 items-center "
              >
                <Download />
                View Slip
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 w-full md:w-fit">
          <div className="bg-white flex justify-between items-center p-4 mb-4 rounded-lg">
            <div>
              <h3 className="font-semibold text-xl">N20</h3>
              <span className="text-xs font-light text-slate-400">
                Agent Bonus
              </span>
            </div>
            <div className="bg-emerald-100 p-2 rounded-full ">
              <div className="bg-emerald-300 p-3 rounded-full ">
                <Check size={30} className="text-emerald-800" />
              </div>
            </div>
          </div>

          <Summary />
        </div>
      </div>
    </div>
  );
};

export default Slip;
