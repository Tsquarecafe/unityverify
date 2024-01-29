"use client";

import { FC, useEffect } from "react";
import TransactionRecord from "./TransactionRecord";
import { Button } from "./ui/Button";
import { Download } from "lucide-react";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransactions } from "@/lib/redux/slices/transaction/transactionThunk";
import { TailSpin } from "react-loader-spinner";
import { toast } from "@/hooks/use-toast";
import { getAllSlips } from "@/lib/redux/slices/service/serviceThunk";
import { useSession } from "next-auth/react";
import { UserRole } from "@/lib/utils";

const statusList = ["PENDING", "SUCCESS", "FAILED"];

interface AllTransactionsProps {}
const AllTransactions: FC<AllTransactionsProps> = ({}) => {
  const { transactions, numberOfPages, limit, currentPage } = useSelector(
    (store: RootState) => store.transactions
  );
  const { allSlips, isLoading } = useSelector(
    (store: RootState) => store.service
  );
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getSlipTypes = async () => {
      try {
        if (!allSlips) return await dispatch(getAllSlips());
      } catch (error) {
        return toast({
          title: "Error Getting NIN Slips",
          description:
            "Unable to retrieve NIN slip types . Plese try again later",
          variant: "destructive",
        });
      }
    };

    getSlipTypes();
  }, []);

  const handlePrevPage = async () => {
    dispatch(
      getTransactions({
        limit,
        page: currentPage > 1 ? currentPage - 1 : numberOfPages,
      })
    );
  };
  const handleSelectPage = async (value: number) => {
    dispatch(
      getTransactions({
        limit,
        page: value,
      })
    );
  };
  const handleNextPage = async () => {
    dispatch(
      getTransactions({
        limit,
        page: currentPage < numberOfPages ? currentPage + 1 : 1,
      })
    );
  };


  return (
    <>
      <div>
        <div className=" flex flex-col lg:flex-row gap-4 justify-between items-center text-sm my-6">
          <div className="grid grid-cols-[1.5fr_2fr] lg:flex items-center justify-between gap-4 ">
            <span className=" font-semibold">Filter by Slip Type</span>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Slip Type" />
              </SelectTrigger>
              <SelectContent>
                {allSlips?.map((slip) => (
                  <SelectItem className="" key={slip.id} value={slip.title}>
                    {slip.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1.5fr_2fr] lg:flex items-center justify-between gap-4 ">
            <span className=" font-semibold">Filter by Status</span>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusList.map((status, index) => (
                  <SelectItem key={index} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className=" text-xs w-full lg:w-fit" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full space-y-6">
            <thead>
              <tr className="grid gap-2 text-left text-white grid-cols-[2rem_2fr_1fr_1fr_0.8fr_1fr_1.5fr_3rem] grid-rows-1 w-full mb-3 bg-slate-800 p-3 rounded-lg">
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
                          {transactions
                            .slice(0, 7)
                            .map((transaction, index) => (
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

              <tr>
                {numberOfPages ? (
                  <div className="flex gap-6 items-center justify-center mx-auto mt-8 w-full ">
                    <Button className="bg-slate-700" onClick={handlePrevPage}>
                      Prev
                    </Button>
                    <div className="flex gap-4">
                      {[...Array(numberOfPages).keys()].map((_, index) => (
                        <button
                          className={`w-10 h-10 rounded-lg  ${
                            currentPage === index + 1
                              ? "bg-emerald-800 text-white "
                              : "bg-gray-300"
                          } hover:bg-emerald-500 hover:text-white`}
                          onClick={() => handleSelectPage(index + 1)}
                          key={index}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    <Button className="bg-slate-800" onClick={handleNextPage}>
                      Next
                    </Button>
                  </div>
                ) : null}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllTransactions;
