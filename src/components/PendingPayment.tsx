import { PauseCircle } from "lucide-react";
import { FC } from "react";
import SinglePaymentHistory from "./SinglePaymentHistory";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { TailSpin } from "react-loader-spinner";
import { PaymentStatus } from "@prisma/client";

interface PendingPaymentProps {}
const PendingPayment: FC<PendingPaymentProps> = ({}) => {
  const { yourPayments, initiatedPayments } = useSelector(
    (store: RootState) => store.payments
  );

  return (
    <div className="bg-white px-2 py-4 rounded-lg w-full text-sm">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Pending Payments</h3>
          <PauseCircle className="h-4 w-4 text-yellow-600" />
        </div>

        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <div className="bg-emerald-500 h-10 w-10 flex items-center justify-center text-center text-white p-2 rounded">
              N
            </div>
            <span className="font-semibold text-xl"> {initiatedPayments}</span>
          </div>
          <p className="text-xs  text-zinc-500 ">
            Total Amount of Pending Payments
          </p>
        </div>
        <div className="space-y-3 ">
          <h4 className="text-sm font-semibold">Top Up History</h4>
          <div className="flex flex-col gap-8 p-2  bg-slate-100 rounded-md">
            {yourPayments ? (
              yourPayments.length > 0 ? (
                yourPayments
                  .filter((item) => item.status === PaymentStatus.INITIATED)
                  .slice(0, 5)
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
                    No Pending Payment
                  </h1>
                </div>
              )
            ) : (
              <div className="w-full p-6">
                <TailSpin width={35} height={35} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPayment;
