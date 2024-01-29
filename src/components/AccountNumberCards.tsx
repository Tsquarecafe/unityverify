import { FC } from "react";
import AccountNumberCard from "./AccountNumberCard";

interface AccountNumberCardProps {}
const AccountNumberCards: FC<AccountNumberCardProps> = ({}) => {
  return (
    <div className="bg-white px-4 py-6 rounded-lg mt-2">
      <h4 className="text-lg font-semibold">Account Information</h4>
      <p className="text-slate-500 text-xs">
        You can make transfers to any of these banks and you wallet will be
        funded
      </p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <AccountNumberCard
          iconSrc="/assets/opay.svg"
          bankName="Opay Microfinance Bank Limited"
          accountNumber="909i2392323"
        />
        <AccountNumberCard
          iconSrc="/assets/moniepoint.svg"
          bankName="MoniePoint Microfinance Bank Limited"
          accountNumber="909i2392323"
        />
        <AccountNumberCard
          iconSrc="/assets/wema.svg"
          bankName="Wema Bank"
          accountNumber="909i2392323"
        />
      </div>
    </div>
  );
};

export default AccountNumberCards;
