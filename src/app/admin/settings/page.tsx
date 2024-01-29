import UpdatePassword from "@/components/UpdatePassword";
import UpdateProfile from "@/components/UpdateProfile";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="my-2">
      <div className="grid lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2 bg-white rounded-lg p-4">
          <UpdateProfile />
        </div>
        <div className="lg:col-span-1  bg-white rounded-lg p-4">
          <UpdatePassword />
        </div>
      </div>
    </div>
  );
};

export default page;
