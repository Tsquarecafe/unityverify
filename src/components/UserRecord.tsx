import { FC, useState } from "react";
import { UserCog } from "lucide-react";
import { User } from "@prisma/client";
import Image from "next/image";
import { formatToNaira } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { openModal } from "@/lib/redux/slices/modalSlice";
import AdminChangeUserPassword from "./AdminChangeUserPassword";

interface UserRecordProps extends User {
  numberOfTransactions: number;
  numberPayment: number;
}

const UserRecord: FC<UserRecordProps> = ({
  id,
  name,
  email,
  image,
  accountBalance,
  agentBonus,
  numberOfTransactions,
  numberPayment,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen } = useSelector((store: RootState) => store.modal);

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

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
      <button
        className="cursor-pointer"
        onClick={() => {
          dispatch(openModal());
          email && name && setSelectedUser({ id, name, email });
        }}
      >
        <UserCog size={20} className="text-emerald-500" />
      </button>

      {isOpen && selectedUser && (
        <AdminChangeUserPassword selectedUser={selectedUser} />
      )}
    </div>
  );
};

export default UserRecord;
