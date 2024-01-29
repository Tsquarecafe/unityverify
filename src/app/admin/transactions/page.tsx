import AllTransactions from "@/components/AllTransactions";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="my-2">
      <div className="bg-white rounded-lg col-span-3 p-6">
        <h4 className="text-xl font-semibold mb-2">All Transaction</h4>
        <p className="text-sm text-slate-600">
          Here is a list of all transactions performed on your account
        </p>

        <div>
          <AllTransactions />
        </div>
      </div>
    </div>
  );
};

export default page;
