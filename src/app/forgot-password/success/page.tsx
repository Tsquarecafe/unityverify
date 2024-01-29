import { CheckSquare } from "lucide-react";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <h2>Email Sent Success</h2>
      <span>
        <CheckSquare />
      </span>

      <p className="text-center text-gray-500">
        A Reset password link has been successfully sent to you email
      </p>
    </div>
  );
};

export default page;
