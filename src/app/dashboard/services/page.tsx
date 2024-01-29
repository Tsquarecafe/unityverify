"use client";

import ServiceCards from "@/components/ServiceCards";
import Stepper from "@/components/Stepper";
import { generalServices } from "@/lib/utils";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="py-2 ">
      <div className="m-4">
        <h2 className="text-slate-900 text-xl font-semibold ">Our Services </h2>
        <p className="text-slate-500 text-xs">Below are service we offer </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 w-full ">
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2  lg:col-span-3">
          <ServiceCards servicesData={generalServices} />
        </div>

        <div className="hidden lg:grid col-span-1">
          <Stepper />
        </div>
      </div>
    </div>
  );
};

export default page;
