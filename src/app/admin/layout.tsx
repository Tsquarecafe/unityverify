"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Breadcrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import MobileSidebar from "@/components/mobileSidebar/MobileSidebar";
import { toast } from "@/hooks/use-toast";
import { getAnnouncement } from "@/lib/redux/slices/announcement/announcementThunk";
import { getReport } from "@/lib/redux/slices/report/reportThunk";
import { getTransactions } from "@/lib/redux/slices/transaction/transactionThunk";
import { getUser } from "@/lib/redux/slices/user/userThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface layoutProps {
  children: React.ReactNode;
}
const Layout: FC<layoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: adminInfo } = useSelector((store: RootState) => store.user);
  const { transactions, limit, currentPage } = useSelector(
    (store: RootState) => store.transactions
  );
  const { announcements } = useSelector(
    (store: RootState) => store.announcement
  );

  const { showMobileSidebar } = useSelector((store: RootState) => store.modal);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        if (!adminInfo) await dispatch(getUser());
        if (!transactions)
          await dispatch(
            getTransactions({
              limit: limit,
              page: currentPage,
            })
          );

        await dispatch(getReport());
        if (!announcements) await dispatch(getAnnouncement());
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

  return (
    <div className="bg-slate-200 p-2">
      <div className="flex gap-2 ">
        <div className="lg:min-w-[220px] min-h-screen hidden lg:block">
          <AdminSidebar />
        </div>

        {showMobileSidebar ? (
          <div className="md:hidden grid fixed z-50 top-0 bottom-0 right-0 left-0">
            <MobileSidebar />
          </div>
        ) : null}

        <div className="w-full">
          <Header />
          <Breadcrumb
            homeElement={""}
            separator={<span> | </span>}
            activeClasses="text-emerald-500"
            containerClasses="flex py-3 bg-trasparent text-xs text-slate-700"
            listClasses="hover:underline mx-2 font-bold"
            capitalizeLinks
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
