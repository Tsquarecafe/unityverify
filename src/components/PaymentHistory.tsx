"use client";

import { CreditCard } from "lucide-react";
import { FC } from "react";
import SinglePaymentHistory from "./SinglePaymentHistory";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { TailSpin } from "react-loader-spinner";
import { formatToNaira } from "@/lib/utils";

interface PaymentHistoryProps {}
const PaymentHistory: FC<PaymentHistoryProps> = ({}) => {
  const { yourPayments, totalAmount } = useSelector(
    (store: RootState) => store.payments
  );

  return (
    <div className="bg-white py-4 px-2 rounded-lg w-full text-sm">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Top up</h3>
          <CreditCard className="h-4 w-4" />
        </div>

        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <div className="bg-emerald-500 h-10 w-10 flex items-center justify-center text-center text-white p-2 rounded">
              N
            </div>
            <span className="font-semibold text-xl">
              {" "}
              {formatToNaira.format(totalAmount)}
            </span>
          </div>
          <p className="text-xs  text-zinc-500 ">
            Total Amount of units bought
          </p>
        </div>
        <div className="space-y-3 ">
          <h4 className="text-sm font-semibold">Top Up History</h4>
          <div className="flex flex-col gap-8 p-2 bg-slate-100 rounded-md">
            {yourPayments ? (
              yourPayments.length > 0 ? (
                yourPayments
                  .slice(0, 6)
                  .map((payment) => (
                    <SinglePaymentHistory
                      key={payment.id}
                      dateTime={payment.createdAt}
                      status={payment.status}
                      amount={payment.amount}
                    />
                  ))
              ) : (
                <div className="w-full p-4">
                  <h1 className=" text-center font-semibold">
                    No Payements Made yet
                  </h1>
                </div>
              )
            ) : (
              <div className="w-full p-6 flex items-center justify-center">
                <TailSpin height={30} width={30} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
