"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";
import { closeModal, setPaymentModal } from "@/lib/redux/slices/modalSlice";
import {
  getAllUsersPayments,
  updatePayment,
} from "@/lib/redux/slices/payment/paymentThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FormSubmitHandler } from "@/types/events";
import { PaymentStatus } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Copy, XSquare } from "lucide-react";
import { FC, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import copy from "clipboard-copy";

interface CreditWithEmailProps {}

const CreditWithEmail: FC<CreditWithEmailProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mostRecentPaymentRef, setMostRecentPaymentRef] = useState("");
  const { paymentModal } = useSelector((store: RootState) => store.modal);

  const modalRef = useRef(null);
  useOnClickOutside(modalRef, () => dispatch(closeModal()));
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      if (mostRecentPaymentRef) {
        await copy(mostRecentPaymentRef);
      }
      setIsCopied(true);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };

  if (isCopied) {
    toast({
      title: "Text Copied!",
    });
  }

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!parseInt(amount) || !email)
        return toast({
          title: "Invalid Input",
          description: "Please Enter a Valid Input",
          variant: "destructive",
        });

      const res = await axios.post("/api/payments/via-email", {
        amount: parseInt(amount),
        email,
      });

      if (res.status === 201) {
        await dispatch(
          updatePayment({
            paymentId: res.data.id,
            status: PaymentStatus.CREDITED,
          })
        );
        await dispatch(getAllUsersPayments({}));
        setMostRecentPaymentRef(res.data.paymentReference);
        dispatch(setPaymentModal(true));
        setAmount("");
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        return toast({
          title: "Somthing went wrong",
          description: error.message,
          variant: "destructive",
        });
      }

      return toast({
        title: "Somthing went wrong",
        description: "Unable to initiate user payments",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="md:p-8 p-4 m-6 bg-white rounded-lg">
      <div className="mb-8">
        <h2 className="font-semibold text-2xl leading-10 text-slate-900 mb-4">
          Credit A User Via Email
        </h2>
        <p className="text-slate-600 leading-8 lg:max-w-4/5 w-full">
          This is an alternative solution for crediting a user. Where you
          provide the user email and the amount for which the user account
          should be credited. It will generate a payment Reference and credit
          the users account accordingly
        </p>
      </div>
      <div className="p-4 border border-emerald-400 rounded-lg">
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-3">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            <div className="w-full">
              <label className="block text-gray-700  pb-2">Email Address</label>
              <Input
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email Address"
                className="border-gray-700"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm pb-2">Amount</label>
              <Input
                value={amount}
                name="amount"
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Amount"
                className="border-gray-700"
              />
            </div>
          </div>
          <Button
            isLoading={isLoading}
            type="submit"
            className="h-12 flex gap-2 items-center"
          >
            Submit
          </Button>
        </form>
      </div>

      {paymentModal && (
        <div className=" bg-slate-900 bg-opacity-50 fixed top-0 left-0 right-0 bottom-0 ">
          <div className="flex justify-center items-center h-full">
            <div
              ref={modalRef}
              className="bg-white space-y-4 p-6 max-w-[500px] lg:min-w-[400px] h-fit rounded-lg"
            >
              <div className="m-4 mb-6 flex justify-between items-center">
                <h3 className="font-semibold">
                  Congratulation! The User Account has been Credited Succesfully
                </h3>

                <button
                  onClick={() => dispatch(closeModal())}
                  className="cursor-pointer"
                >
                  <XSquare />
                </button>
              </div>

              {mostRecentPaymentRef ? (
                <div className="flex bg-slate-100 p-4 rounded-lg border border-slate-300 gap-4 text-xs justify-between items-center">
                  <div className="flex flex-col gap-3">
                    Payment Reference:
                    <span className="font-semibold">
                      {mostRecentPaymentRef}
                    </span>
                  </div>

                  <button onClick={handleCopyClick}>
                    <Copy />
                  </button>
                </div>
              ) : (
                <div className="flex w-full p-4 justify-center items-center">
                  <TailSpin height={20} width={20} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditWithEmail;
