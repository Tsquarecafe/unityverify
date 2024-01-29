import { FC } from "react";
import { View } from "lucide-react";
import { User } from "@prisma/client";
import Image from "next/image";
import { formatToNaira } from "@/lib/utils";

interface UserRecordProps extends User {
  numberOfTransactions: number;
  numberPayment: number;
}

const UserRecord: FC<UserRecordProps> = ({
  name,
  email,
  image,
  accountBalance,
  agentBonus,
  numberOfTransactions,
  numberPayment,
}) => {
  return (
    <div className="grid gap-4 grid-cols-[2fr_2fr_1fr_1fr_1.5fr_1.1fr_2rem] grid-rows-1 p-2 rounded-lg items-center text-sm bg-slate-100">
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full shadow-lg overflow-hidden"
          src={image || ""}
          height={30}
          width={30}
          alt=""
        />
        <h4 className="text-xs">{name?.toUpperCase()}</h4>
      </div>

      <div className="text-left text-xs">{email}</div>
      <div className="text-left text-xs">
        {formatToNaira.format(accountBalance)}
      </div>
      <div className="text-left text-xs">
        {formatToNaira.format(agentBonus)}
      </div>

      <div className="text-xs ">{numberOfTransactions}</div>
      <div className="text-xs  ">{numberPayment}</div>
      <button className="cursor-pointer">
        <View size={20} className="text-emerald-500" />
      </button>
    </div>
  );
};

export default UserRecord;
