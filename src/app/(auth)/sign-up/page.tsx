import SignUp from "@/components/SignUp";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <SignUp />
    </div>
  );
};

export default page;
