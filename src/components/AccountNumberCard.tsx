import { FC } from "react";
import Image from "next/image";

interface AccountNumberCardProps {
  iconSrc: string;
  bankName: string;
  accountNumber: string;
}
const AccountNumberCard: FC<AccountNumberCardProps> = ({
  iconSrc,
  bankName,
  accountNumber,
}) => {
  return (
    <div className="bg-slate-200 p-4 flex flex-col gap-2 rounded-lg">
      <div>
        <Image alt="Bank Logo" src={iconSrc} height={50} width={50} />
      </div>

      <div>
        <span className="text-xs ">Bank Name:</span>
        <h5 className="font-semibold">{bankName}</h5>
      </div>
      <div>
        <span className="text-xs">Account Number:</span>
        <h5 className="font-semibold">{accountNumber}</h5>
      </div>
    </div>
  );
};

export default AccountNumberCard;
