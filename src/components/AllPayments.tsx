"use client";

import { FC } from "react";
import PaymentRecord from "./PaymentRecord";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import Pagination from "./Pagination";
import { getPayments } from "@/lib/redux/slices/payment/paymentThunk";

interface AllPaymentsProps {}
const AllPayments: FC<AllPaymentsProps> = ({}) => {
  const { yourPayments, currentPage, numberOfPages, limit } = useSelector(
    (store: RootState) => store.payments
  );
  const dispatch = useDispatch<AppDispatch>();

  const handlePrevPage = async () => {
    dispatch(
      getPayments({
        limit,
        page: currentPage > 1 ? currentPage - 1 : numberOfPages,
      })
    );
  };
  const handleSelectPage = async (value: number) => {
    dispatch(
      getPayments({
        limit,
        page: value,
      })
    );
  };
  const handleNextPage = async () => {
    dispatch(
      getPayments({
        limit,
        page: currentPage < numberOfPages ? currentPage + 1 : 1,
      })
    );
  };

  return (
    <div className="bg-white mt-4 rounded-lg p-4">
      <div className="m-4">
        <h2 className="text-slate-900 text-xl font-semibold ">
          Payment Report
        </h2>
        <p className="text-slate-500 text-xs">List of all payment record</p>
      </div>
      <hr />

      <div className="relative overflow-x-auto">
        <table className="space-y-2 mt-2 w-full">
          <thead>
            <tr className="grid gap-6 text-sm text-left grid-cols-[2rem_2fr_2fr_1fr_1.5fr_4rem_3rem] grid-rows-1 p-2 rounded-lg bg-slate-800 mb-3 text-white">
              <th>S/N</th>
              <th>Reference</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Date/Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr className="w-full   space-y-2">
              <td>
                {yourPayments ? (
                  yourPayments?.length > 0 ? (
                    yourPayments
                      .slice(0, 6)
                      .map((payment, index) => (
                        <PaymentRecord
                          key={payment.id}
                          id={payment.id}
                          index={index}
                          userId={payment.userId}
                          paymentReference={payment.paymentReference}
                          paymentMethod={payment.paymentMethod}
                          createdAt={payment.createdAt}
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
                  <div className="w-full p-6 flex justify-center items-center">
                    <TailSpin />
                  </div>
                )}
              </td>
            </tr>

            <Pagination
              currentPage={currentPage}
              numberOfPages={numberOfPages}
              handlePrevPage={handlePrevPage}
              handleSelectPage={handleSelectPage}
              handleNextPage={handleNextPage}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPayments;
