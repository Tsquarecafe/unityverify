"use client";

import { RootState } from "@/lib/redux/store";
import { MoveRight } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface StepperProps {}
const Stepper: FC<StepperProps> = ({}) => {
  const { selectedService, selectedSubService, selectedSlipType } = useSelector(
    (store: RootState) => store.service
  );
  return (
    <div className="bg-white text-xs rounded-lg">
      <ol className=" flex flex-col p-4 relative  text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="flex gap-6 items-center  ">
          <span
            className={`flex items-center justify-center w-8 h-8 ${
              selectedService.title ? "bg-green-200 " : "bg-slate-200 "
            }rounded-full ring-4 ring-white`}
          >
            <MoveRight size={14} />
          </span>
          <div className="flex flex-col g">
            <h3 className="font-medium leading-tight">Select Service Type</h3>
            <p className="">
              {selectedService.title || "Nothing Selected yet"}
            </p>
          </div>
        </li>
        <div className="h-16 w-[1px] my-1 bg-slate-300 transform translate-x-4" />

        <li className="flex gap-6 items-center  ">
          <span
            className={`flex items-center justify-center w-8 h-8 ${
              selectedSubService?.title ? "bg-green-200 " : "bg-slate-200 "
            }rounded-full ring-4 ring-white`}
          >
            <MoveRight size={14} />
          </span>
          <div className="flex flex-col g">
            <h3 className="font-medium leading-tight">
              Select Service Sub Type
            </h3>
            <p className="">
              {selectedSubService?.title || "Nothing Selected yet"}
            </p>
          </div>
        </li>
        <div className="h-16 w-[1px] my-1 bg-slate-300 transform translate-x-4" />
        <li className="flex gap-6 items-center ">
          <span
            className={`flex items-center justify-center w-8 h-8 ${
              selectedSlipType.title ? "bg-green-200 " : "bg-slate-200 "
            }rounded-full ring-4 ring-white`}
          >
            <MoveRight size={14} />
          </span>
          <div className="flex flex-col g">
            <h3 className="font-medium leading-tight">Select The Slip Type</h3>
            <p className="">
              {selectedSlipType.title || "No slip Selected yet"}
            </p>
          </div>
        </li>

        <div className="h-16 w-[1px] my-1 bg-slate-300 transform translate-x-4" />
        <li className="flex gap-6 items-center ">
          <span className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full ring-4 ring-white">
            <MoveRight size={14} />
          </span>
          <div className="flex flex-col g">
            <h3 className="font-medium leading-tight">Input User Details</h3>
            <p className="">Step details here</p>
          </div>
        </li>

        <div className="h-16 w-[1px] my-1 bg-slate-300 transform translate-x-4" />
        <li className="flex gap-6 items-center ">
          <span className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full ring-4 ring-white">
            <MoveRight size={14} />
          </span>
          <div className="flex flex-col g">
            <h3 className="font-medium leading-tight">Download Slips</h3>
            <p className="">Step details here</p>
          </div>
        </li>
      </ol>
    </div>
  );
};

export default Stepper;
