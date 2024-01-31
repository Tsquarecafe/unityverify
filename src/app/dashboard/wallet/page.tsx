"use client";

import AccountInfocard from "@/components/AccountInfocard";
import AllPayments from "@/components/AllPayments";
import Anouncement from "@/components/Anouncement";
import PendingPayment from "@/components/PendingPayment";
import TopUpForm from "@/components/TopUpForm";
import { FC, useRef, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Copy, XSquare } from "lucide-react";
import { closeModal } from "@/lib/redux/slices/modalSlice";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import copy from "clipboard-copy";
import { toast } from "@/hooks/use-toast";
import { TailSpin } from "react-loader-spinner";

interface pageProps {}
const Wallet: FC<pageProps> = ({}) => {
  const { paymentModal } = useSelector((store: RootState) => store.modal);
  const { mostRecentPaymentRef } = useSelector(
    (store: RootState) => store.payments
  );

  const dispatch = useDispatch();
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

  return (
    <div>
      <div className="mt-2 grid lg:grid-cols-[1fr_280px] gap-2 ">
        <div className="flex flex-col gap-2">
          <div className="grid lg:grid-cols-2 gap-2">
            <AccountInfocard isDisplayedFromWallet />

            <div className="hidden h-full lg:block">
              <Anouncement />
            </div>
          </div>

          <TopUpForm />
        </div>

        <div className="grid grid-rows-1">
          <PendingPayment />
        </div>
      </div>
      {/* <AccountNumberCards /> */}
      <AllPayments />

      {paymentModal && (
        <div className=" bg-slate-900 bg-opacity-50 fixed top-0 left-0 right-0 bottom-0 ">
          <div className="flex justify-center items-center h-full">
            <div
              ref={modalRef}
              className="bg-white space-y-4 p-6 max-w-[500px] lg:min-w-[400px] h-fit rounded-lg"
            >
              <div className="m-4 mb-6 flex justify-between items-center">
                <h3 className="font-semibold">
                  Congratulation! Payment Initiated Succesfully
                </h3>

                <button
                  onClick={() => dispatch(closeModal())}
                  className="cursor-pointer"
                >
                  <XSquare />
                </button>
              </div>

              <hr />
              <div className="text-sm text-gray-500 ">
                Kindly access the Agent Whatapp group and there you will find
                the Account number. Make Payments of the exact amount and send
                reciept along side your payment reference to the whatapp group
                so your account credit can be processed!
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

              <div className="space-y-px flex gap-6 items-center mx-auto w-fit">
                <span className="text-slate-400 block mb-2 text-xs font-semibold">
                  Whatapp:
                </span>
                <Link
                  href="https://wa.me/+2348030961870"
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonVariants()} bg-green-200 hover:bg-green-300 text-white`}
                >
                  <Image
                    src="/assets/whatsapp.svg"
                    alt="Whatsapp logo"
                    height={50}
                    width={50}
                  />
                  Chat with us now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
