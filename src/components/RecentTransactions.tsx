"use client";

import { FC } from "react";
import TransactionRecord from "./TransactionRecord";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserRole } from "@/lib/utils";
import { TailSpin } from "react-loader-spinner";

interface RecentTransactionsProps {}
const RecentTransactions: FC<RecentTransactionsProps> = ({}) => {
  const { transactions, isLoading } = useSelector(
    (store: RootState) => store.transactions
  );

  const { data: session } = useSession();

  return (
    <div className="bg-white rounded-lg col-span-3 p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold ">Recent Transaction</h4>

        <Link
          className="text-xs text-emerald-500 hover:underline"
          href={`${
            session?.user.type === UserRole.ADMIN
              ? "/admin/transactions"
              : "/dashboard/transactions"
          }`}
        >
          See All Transactions
        </Link>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full space-y-6">
          <thead>
            <tr
              className={`grid gap-6 text-left text-white ${
                session?.user.type === UserRole.ADMIN
                  ? " grid-cols-[2rem_2fr_1fr_1fr_0.8fr_1fr_1.5fr_3rem]"
                  : " grid-cols-[2rem_1fr_1fr_0.8fr_1fr_1.5fr_3rem]"
              } grid-rows-1 w-full mb-3 bg-slate-800 p-3 rounded-lg`}
            >
              <th>S/N</th>
              {session?.user.type === UserRole.ADMIN ? <th>Name</th> : null}
              <th>Type</th>
              <th>Refrence</th>
              <th>Price</th>
              <th>Slip Type</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {transactions && !isLoading ? (
                  transactions.length > 0 ? (
                    <div>
                      <div className="space-y-2">
                        {transactions.slice(0, 5).map((transaction, index) => (
                          // @ts-ignore
                          <TransactionRecord
                            index={index}
                            key={transaction.id}
                            {...transaction}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 flex justify-center items-center">
                      <h2>Nothing to Display</h2>
                    </div>
                  )
                ) : isLoading && !transactions ? (
                  <div className="flex w-full h-full items-center justify-center">
                    <TailSpin />
                  </div>
                ) : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
