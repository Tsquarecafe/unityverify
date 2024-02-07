"use client";

import { FC, useEffect, useState } from "react";
import { FallingLines } from "react-loader-spinner";
import InfoCard from "./InfoCard";
import { Banknote, CreditCard, MonitorCheck, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { AdminCardsTile } from "@/lib/utils";

interface AdminInfoCardsProps {}

const infoInit = [
  {
    name: AdminCardsTile.income,
    amount: 0,
    Icon: Banknote,
    backgroundColor: "from-pink-500 to-pink-900",
    slug: "/admin/top-up",
  },
  {
    name: AdminCardsTile.users,
    amount: 0,
    Icon: User,
    backgroundColor: "from-emerald-500 to-emerald-900",
    slug: "/admin/users",
  },
  {
    name: AdminCardsTile.payments,
    amount: 0,
    Icon: CreditCard,
    backgroundColor: "from-yellow-500 to-yellow-900",
    slug: "/admin/top-up",
  },
  {
    name: AdminCardsTile.transactions,
    amount: 0,
    Icon: MonitorCheck,
    backgroundColor: "from-violet-500 to-violet-900",
    slug: "/admin/transactions",
  },
];

const AdminInfoCards: FC<AdminInfoCardsProps> = ({}) => {
  const { totalIncome, numOfUsers, numOfPayments, numOfTransaction } =
    useSelector((store: RootState) => store.report);
  const [adminInfo, setAdminInfo] = useState(infoInit);

  useEffect(() => {
    setAdminInfo(() =>
      adminInfo.map((info) => {
        return {
          ...info,
          amount:
            info.name == AdminCardsTile.users
              ? numOfUsers
              : info.name == AdminCardsTile.transactions
              ? numOfTransaction
              : info.name === AdminCardsTile.payments
              ? numOfPayments
              : totalIncome,
        };
      })
    );
  }, [totalIncome, numOfUsers, numOfPayments, numOfTransaction]);

  return (
    <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-4">
      {adminInfo ? (
        adminInfo.map((info, index) => <InfoCard key={index} {...info} />)
      ) : (
        <div className="w-full p-6 flex justify-center items-center">
          <FallingLines />
        </div>
      )}
    </div>
  );
};

export default AdminInfoCards;
