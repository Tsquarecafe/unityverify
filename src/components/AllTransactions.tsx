"use client";

import { FC, useEffect, useState } from "react";
import TransactionRecord from "./TransactionRecord";
import { Button, buttonVariants } from "./ui/Button";
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
import { UserRole, cn } from "@/lib/utils";
import { generateCSVFile } from "@/lib/createCSV";

const statusList = ["ALL", "PENDING", "SUCCESS", "FAILED"];

interface AllTransactionsProps {}

type retrievePayloadType = {
  limit: number;
  status?: string;
  slipyType?: string;
};
const AllTransactions: FC<AllTransactionsProps> = ({}) => {
  const { transactions, numberOfPages, limit, currentPage } = useSelector(
    (store: RootState) => store.transactions
  );
  const { allSlips, isLoading } = useSelector(
    (store: RootState) => store.service
  );
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const [filterSlipType, setFilterSlipType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const retrievePayments = async () => {
    try {
      let payload: retrievePayloadType = { limit: 10 };

      if (filterSlipType) payload = { ...payload, slipyType: filterSlipType };
      if (filterStatus) payload = { ...payload, status: filterStatus };

      dispatch(getTransactions(payload));
    } catch (error) {
      return toast({
        title: "Somthing went wrong",
        description: "Unable to get Transactions details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    retrievePayments();
  }, [filterStatus, filterSlipType]);

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

            <Select onValueChange={setFilterSlipType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Slip Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL</SelectItem>
                {allSlips?.map((slip) => (
                  <SelectItem key={slip.id} value={slip.title}>
                    {slip.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1.5fr_2fr] lg:flex items-center justify-between gap-4 ">
            <span className=" font-semibold">Filter by Status</span>
            <Select onValueChange={setFilterStatus}>
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

          {transactions ? (
            <a
              download="UnityVerify_Transaction_List"
              href={generateCSVFile(transactions)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-xs w-full lg:w-fit"
              )}
            >
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </a>
          ) : null}
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
                <td>
                  {numberOfPages ? (
                    <div className="flex  gap-6 items-center justify-center mx-auto mt-8 w-full ">
                      <Button className="bg-slate-700" onClick={handlePrevPage}>
                        Prev
                      </Button>
                      <div className="flex gap-4 flex-wrap">
                        {[...Array(numberOfPages).keys()]
                          .slice(0, 10)
                          .map((_, index) => (
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
                        ...
                        {[...Array(numberOfPages).keys()]
                          .slice(-1)
                          .map((_, index) => (
                            <button
                              className={`w-10 h-10 rounded-lg  ${
                                currentPage ===
                                [...Array(numberOfPages).keys()].length
                                  ? "bg-emerald-800 text-white "
                                  : "bg-gray-300"
                              } hover:bg-emerald-500 hover:text-white`}
                              onClick={() =>
                                handleSelectPage(
                                  [...Array(numberOfPages).keys()].length
                                )
                              }
                              key={index}
                            >
                              {[...Array(numberOfPages).keys()].length}
                            </button>
                          ))}
                      </div>
                      <Button className="bg-slate-800" onClick={handleNextPage}>
                        Next
                      </Button>
                    </div>
                  ) : null}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllTransactions;
