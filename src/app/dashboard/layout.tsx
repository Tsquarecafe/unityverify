"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/mobileSidebar/MobileSidebar";
import { toast } from "@/hooks/use-toast";
import { getPayments } from "@/lib/redux/slices/payment/paymentThunk";
import { getTransactions } from "@/lib/redux/slices/transaction/transactionThunk";
import { getUser } from "@/lib/redux/slices/user/userThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { UserRole } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface layoutProps {
  children: React.ReactNode;
}
const Layout: FC<layoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((store: RootState) => store.user);
  const { transactions, limit, currentPage } = useSelector(
    (store: RootState) => store.transactions
  );
  const { yourPayments } = useSelector((store: RootState) => store.payments);
  const { showMobileSidebar } = useSelector((store: RootState) => store.modal);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        if (!user) await dispatch(getUser());
        if (!transactions)
          await dispatch(
            getTransactions({
              limit: limit,
              page: currentPage,
            })
          );
        if (!yourPayments) await dispatch(getPayments());
      } catch (error) {
        return toast({
          title: "Somthing went wrong",
          description: "Unable to get user information",
          variant: "destructive",
        });
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    if (session && session.user.type === UserRole.ADMIN)
      return router.push("/admin");
  }, [session]);

  return (
    <div className="bg-slate-200 p-2 relative">
      <div className="flex gap-2 ">
        <div className="lg:min-w-[220px] min-h-screen hidden lg:block">
          <Sidebar />
        </div>

        {showMobileSidebar ? (
          <div className="md:hidden grid fixed overflow-hidden  z-50 top-0 bottom-0 right-0 left-0">
            <MobileSidebar />
          </div>
        ) : null}

        <div className="w-full">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
