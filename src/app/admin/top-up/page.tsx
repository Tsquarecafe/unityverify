"use client";

import AdminPaymentRecord from "@/components/AdminPaymentRecord";
import PaymentRecord from "@/components/PaymentRecord";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { generateCSVFile } from "@/lib/createCSV";
import { getAllUsersPayments } from "@/lib/redux/slices/payment/paymentThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import { Download, Search, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

const statusList = ["ALL", "INITIATED", "CREDITED", "FAILED"];
const duration = ["Today", "This Week", "This Month"];
const paymentMethod = ["ALL", "CARD", "TRANSFER"];
type retrievePayloadType = {
  limit: number;
  search?: string;
  status?: string;
  method?: string;
  duration?: string;
};

interface TopUpProps {}
const TopUp: FC<TopUpProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchInput, setSearchInput] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [filterDuration, setFilterDuration] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");

  const { allPayments, limit, currentPage, numberOfPages, isLoading } =
    useSelector((state: RootState) => state.payments);

  const retrievePayments = async () => {
    try {
      let payload: retrievePayloadType = { limit: 10 };
      if (
        searchInput &&
        /^[A-Za-z]+[0-9]+[A-Za-z]+-[A-Za-z0-9]+$/.test(searchInput)
      )
        payload = { ...payload, search: searchInput };
      else if (
        searchInput &&
        !/^[A-Za-z]+[0-9]+[A-Za-z]+-[A-Za-z0-9]+$/.test(searchInput)
      )
        return;

      if (filterPaymentStatus)
        payload = { ...payload, status: filterPaymentStatus };
      if (filterDuration) payload = { ...payload, duration: filterDuration };
      if (filterPaymentMethod)
        payload = { ...payload, method: filterPaymentMethod };

      dispatch(getAllUsersPayments(payload));
    } catch (error) {
      return toast({
        title: "Somthing went wrong",
        description: "Unable to get payment details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const getAllPayments = async () => {
      try {
        if (!allPayments) return await dispatch(getAllUsersPayments({}));
      } catch (error) {
        return toast({
          title: "Error Getting NIN Slips",
          description:
            "Unable to retrieve NIN slip types . Plese try again later",
          variant: "destructive",
        });
      }
    };

    getAllPayments();
  }, []);

  useEffect(() => {
    retrievePayments();
  }, [searchInput, filterPaymentStatus, filterDuration, filterPaymentMethod]);

  const handlePrevPage = async () => {
    dispatch(
      getAllUsersPayments({
        limit,
        page: currentPage > 1 ? currentPage - 1 : numberOfPages,
      })
    );
  };
  const handleSelectPage = async (value: number) => {
    dispatch(
      getAllUsersPayments({
        limit,
        page: value,
      })
    );
  };
  const handleNextPage = async () => {
    dispatch(
      getAllUsersPayments({
        limit,
        page: currentPage < numberOfPages ? currentPage + 1 : 1,
      })
    );
  };

  return (
    <div>
      <div className="border border-slate-50 rounded-lg p-4 my-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-center text-sm mb-6">
          <div className="flex gap-2 items-center lg:min-w-[500px]">
            <div className="bg-white pr-2 flex w-full border-[1px] border-slate-200 gap-2 items-center justify-between rounded-lg">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="search"
                placeholder="Search Payment Reference"
                className="border-none"
              />
              <button onClick={() => setSearchInput("")}>
                <X />
              </button>
            </div>
            <Button onClick={() => retrievePayments()} className="text-xs">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {allPayments ? (
            <a
              download="UnityVerify_Payment_List"
              href={generateCSVFile(allPayments)}
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

        <div className="flex flex-col gap-4 lg:flex-row justify-between items-center mb-4">
          <div className="grid grid-cols-2 w-full items-center lg:gap-3">
            <span className="  font-semibold text-sm">Filter by Duration</span>
            <Select onValueChange={setFilterDuration}>
              <SelectTrigger className="">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {duration?.map((item, index) => (
                  <SelectItem className="" key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 w-full items-center lg:gap-3 ">
            <span className=" font-semibold text-sm">Filter by Status</span>
            <Select onValueChange={setFilterPaymentStatus}>
              <SelectTrigger className="">
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
          <div className="grid grid-cols-2 w-full items-center lg:gap-3 ">
            <span className=" font-semibold text-sm">Filter by Method</span>
            <Select onValueChange={setFilterPaymentMethod}>
              <SelectTrigger className="">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethod.map((method, index) => (
                  <SelectItem key={index} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="grid gap-6 text-sm text-left grid-cols-[2rem_2fr_2fr_1fr_4rem_1.5fr_3rem_3rem] grid-rows-1 p-2 rounded-lg bg-slate-800 mb-3 text-white">
              <th>S/N</th>
              <th>Name</th>
              <th>Reference</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Date/Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="relative">
            <tr>
              <td>
                {allPayments && allPayments?.length > 0 && !isLoading ? (
                  <div className="space-y-2 w-full">
                    {allPayments.slice(0, 7).map((payment, index) => (
                      <div className="w-full flex" key={payment.id}>
                        <AdminPaymentRecord index={index} {...payment} />
                      </div>
                    ))}
                  </div>
                ) : !isLoading && allPayments?.length === 0 ? (
                  <div className="bg-white p-6 flex justify-center items-center">
                    <h2>Nothing to Display</h2>
                  </div>
                ) : (
                  <div className="flex w-full h-full items-center justify-center">
                    <TailSpin />
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>

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
      </div>
    </div>
  );
};

export default TopUp;
