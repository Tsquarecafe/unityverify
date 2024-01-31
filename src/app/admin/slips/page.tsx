import AdminSlipList from "@/components/AdminSlipList";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="bg-white p-4 my-4 rounded-lg">
      <div className="mb-4">
        <h2 className="font-semibold text-xl leading-10 text-slate-900">
          All Slips
        </h2>
        <p className="text-slate-600 text-sm ">
          You can Edit the prices from each slip by clicking on the bo and
          updating the price field
        </p>
      </div>

      <hr className="mb-6" />

      <div className="my-6">
        <AdminSlipList />
      </div>
    </div>
  );
};

export default page;
