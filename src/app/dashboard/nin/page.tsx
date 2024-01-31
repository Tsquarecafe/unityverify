"use client";

import InputModal from "@/components/InputModal";
import ServiceCards from "@/components/ServiceCards";
import SlipType from "@/components/SlipType";
import Stepper from "@/components/Stepper";
import Summary from "@/components/Summary";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { openModal } from "@/lib/redux/slices/modalSlice";
import { getAllSlips } from "@/lib/redux/slices/service/serviceThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { ninServices } from "@/lib/utils";
import { FC, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

interface pageProps {}
const NINService: FC<pageProps> = ({}) => {
  const { isOpen } = useSelector((store: RootState) => store.modal);
  const { allSlips, selectedSubService, selectedSlipType } = useSelector(
    (store: RootState) => store.service
  );

  const dispatch = useDispatch<AppDispatch>();

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

  const handleOpenModal = () => {
    if (selectedSubService?.title && selectedSlipType.title) {
      dispatch(openModal());
    } else {
      return toast({
        title: "Incomplete Selection",
        description: "Select a Service type and Slip type",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="py-2 scroll-smooth">
        <div className="m-4">
          <h2 className="text-slate-900 text-xl font-semibold ">
            NIN Services
          </h2>
          <p className="text-slate-500 text-xs">
            Below are the NIN services we offer
          </p>
        </div>
        <div
          className={`grid  lg:grid-cols-[1fr_280px] ${
            selectedSubService && "lg:grid-rows-[1fr_520px]"
          } gap-2 w-full lg:px-4`}
        >
          <div className="border-[1px] border-slate-300 rounded-lg py-4 px-2 lg:p-4 ">
            <h3 className="mb-4">Select a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
              <ServiceCards isServiceItem subServiceData={ninServices} />
            </div>
          </div>

          <div className="hidden lg:grid">
            <Stepper />
          </div>

          {selectedSubService ? (
            <>
              <div
                id="slip-types"
                className=" border-[1px]  bg-white border-slate-300 rounded-lg p-4"
              >
                <h3 className="mb-4">Select a Type</h3>

                {allSlips ? (
                  <>
                    <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-2  ">
                      {allSlips.map((item, index) => (
                        <div key={index}>
                          <SlipType {...item} />
                        </div>
                      ))}
                    </div>
                    <Button
                      size="lg"
                      className="w-full mt-4 hidden lg:flex"
                      onClick={handleOpenModal}
                    >
                      Proceed
                    </Button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TailSpin />
                  </div>
                )}
              </div>
              <div className="grid">
                <Summary />
              </div>

              <Button
                id="proceed-btn"
                size="lg"
                className="w-full mt-4 flex lg:hidden"
                onClick={handleOpenModal}
              >
                Proceed
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {isOpen ? <InputModal /> : null}
    </div>
  );
};

export default NINService;
