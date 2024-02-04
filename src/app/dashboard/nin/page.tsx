"use client";

import InputModal from "@/components/InputModal";
import ServiceCards from "@/components/ServiceCards";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { openModal, setModalTitle } from "@/lib/redux/slices/modalSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { ninServices } from "@/lib/utils";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

interface pageProps {}
const NINService: FC<pageProps> = ({}) => {
  const { isOpen } = useSelector((store: RootState) => store.modal);
  const { selectedSubService } = useSelector(
    (store: RootState) => store.service
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleOpenModal = () => {
    if (!selectedSubService)
      return toast({
        title: "Bad Request",
        description: "Please Select a Sub Service",
        variant: "destructive",
      });

    dispatch(setModalTitle(`Verify by ${selectedSubService.title} `));
    dispatch(openModal());
  };

  return (
    <>
      <div className="py-2 ">
        <div className="m-4">
          <h2 className="text-slate-900 text-xl font-semibold ">
            NIN Services
          </h2>
          <p className="text-slate-500 text-xs">
            Below are the NIN services we offer
          </p>
        </div>
        <div className="grid lg:grid-cols-[1fr_280px] gap-2 w-full lg:px-4">
          <div className="border-[1px] border-slate-300 rounded-lg py-4 px-2 lg:p-4 ">
            <h3 className="mb-4">Select a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
              <ServiceCards isServiceItem subServiceData={ninServices} />
            </div>
          </div>

          <div className="hidden lg:grid">
            <Stepper />
          </div>

          <Button
            id="proceed-btn"
            size="lg"
            className="w-full mt-4 flex "
            onClick={handleOpenModal}
          >
            Proceed
          </Button>
        </div>
      </div>

      {isOpen ? <InputModal /> : null}
    </>
  );
};

export default NINService;
