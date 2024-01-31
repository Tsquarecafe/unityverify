import AdminInfoCards from "@/components/AdminInfoCards";
import Anouncement from "@/components/Anouncement";
import RecentTransactions from "@/components/RecentTransactions";
import ReportCard from "@/components/ReportCard";
import MyLineChart from "@/components/charts/AreaGraph";

import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="mt-2 grid lg:grid-cols-[1fr_280px] gap-2 ">
      <div className="space-y-6">
        <AdminInfoCards />
        <div className="p-4 bg-white rounded-lg">
          <MyLineChart />
        </div>
      </div>

      <div className="space-y-3 grid" >
        <ReportCard />
        <Anouncement />
      </div>

      <div className=" grid grid-cols-3 gap-2 w-full lg:col-span-2">
        <RecentTransactions />
      </div>
    </div>
  );
};

export default page;
