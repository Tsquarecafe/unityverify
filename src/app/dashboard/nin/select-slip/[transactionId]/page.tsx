"use client";

import SlipType from "@/components/SlipType";
import Summary from "@/components/Summary";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import {
  getAllSlips,
  updateFailedTransaction,
} from "@/lib/redux/slices/service/serviceThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import SelectSlip from "@/components/slips/SelectSlip";
import { setSlipBlob } from "@/lib/redux/slices/service/serviceSlice";

interface SlipPageProps {}
const SlipPage: FC<SlipPageProps> = ({}) => {
  const { allSlips, response, selectedSlipType } = useSelector(
    (store: RootState) => store.service
  );

  const dispatch = useDispatch<AppDispatch>();

  const params = useParams<{ transactionId: string }>();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSlipTypes = async () => {
      try {
        if (!allSlips) return await dispatch(getAllSlips());
      } catch (error) {
        return toast({
          title: "Error Getting NIN Slips",
          description:
            "Unable to retrieve NIN slip types . Plese try again later",
          variant: "destructive",
        });
      }
    };

    getSlipTypes();
  }, []);

  const handleGenerateSlip = async () => {
    setIsLoading(true);
    if (!selectedSlipType)
      return toast({
        title: "Invalid Request",
        description: "Please Select a Slip Type",
        variant: "destructive",
      });

    try {
      const res = await axios.patch("/api/transactions/add-slip", {
        slipId: selectedSlipType.id,
        transactionId: params.transactionId,
        status: "SUCCESS",
      });
      if (res.status === 200) {
        if (response)
          dispatch(
            setSlipBlob(
              await SelectSlip({ slipTitle: selectedSlipType.title, response })
            )
          );

        router.push("/dashboard/nin/success");
      } else {
        setIsLoading(false);
        return toast({
          title: "Something Went Wrong",
          description: "Unable to Perfrom slip Update",
          variant: "destructive",
        });
      }
    } catch (error) {
      await updateFailedTransaction(params.transactionId);
      setIsLoading(false);
      return toast({
        title: "Something Went Wrong",
        description: "Unable to Perfrom slip Update",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-2 scroll-smooth">
      <div className="m-4">
        <h2 className="text-slate-900 text-xl font-semibold ">
          Select an NIN Slip Types
        </h2>
        <p className="text-slate-500 text-xs">
          Below are the NIN slip types we Offer
        </p>
      </div>

      <div className="grid gap-2 my-4 lg:grid-cols-[1fr_280px] ">
        <div className=" border-[1px] bg-white border-slate-300 rounded-lg p-4">
          <div className="p-2 mb-4 flex items-center gap-4 bg-rose-100 font-semibold text-sm">
            <AlertCircle size={16} className="text-rose-500" />
            Please do not refresh this page. Else you will loose the transaction
            Progress
          </div>

          {allSlips ? (
            <>
              <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2  ">
                {allSlips.map((item, index) => (
                  <div key={index}>
                    <SlipType {...item} transactionId={params.transactionId} />
                  </div>
                ))}
              </div>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                id="proceed-btn"
                size="lg"
                className="w-full mt-4 hidden lg:flex"
                onClick={handleGenerateSlip}
              >
                Proceed
              </Button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TailSpin width={30} height={30} />
            </div>
          )}
        </div>

        <div className="grid">
          <Summary />
        </div>

        <Button
          disabled={isLoading}
          isLoading={isLoading}
          id="proceed-btn"
          size="lg"
          className="w-full mt-4 flex lg:hidden"
          onClick={handleGenerateSlip}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default SlipPage;
