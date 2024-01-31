import AccountInfocard from "@/components/AccountInfocard";
import Anouncement from "@/components/Anouncement";
import PaymentHistory from "@/components/PaymentHistory";
import RecentTransactions from "@/components/RecentTransactions";
import ReportCard from "@/components/ReportCard";
import ServiceCards from "@/components/ServiceCards";
import UserProfileCard from "@/components/UserProfileCard";
import { generalServices } from "@/lib/utils";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="mt-2 grid lg:grid-cols-[1fr_280px] gap-2 scroll-smooth">
      <div className="flex flex-col gap-2">
        <div className=" lg:hidden">
          <Anouncement />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 w-full">
          <div className="col-span-1 hidden lg:block">
            <UserProfileCard />
          </div>
          <div className="col-span-2">
            <AccountInfocard />
          </div>
        </div>
        <div className=" lg:hidden">
          <ReportCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
          <ServiceCards doSlice={5} servicesData={generalServices} />
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          <RecentTransactions />
        </div>
      </div>

      <div className="space-y-2 grid">
        <div className="hidden lg:block">
          <ReportCard />
        </div>
        <div className="hidden lg:block">
          <Anouncement />
        </div>
        <PaymentHistory />
      </div>
    </div>
  );
};

export default page;
