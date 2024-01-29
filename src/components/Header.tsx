"use client";

import UserAccountNav from "./UserAccountNav";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "./ui/Button";
import { setUser } from "@/lib/redux/slices/user/userSlice";
import { UserRole, formatToNaira } from "@/lib/utils";
import { TailSpin } from "react-loader-spinner";
import Image from "next/image";
import { setShowMobileSidebar } from "@/lib/redux/slices/modalSlice";

const Header = ({}) => {
  const { user } = useSelector((store: RootState) => store.user);
  const { showMobileSidebar } = useSelector((store: RootState) => store.modal);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const claimBonus = async () => {
    try {
      setIsLoading(true);
      if (user && user.agentBonus > 0) {
        const res = await axios.patch("/api/users/single", {
          agentBonus: user?.agentBonus,
        });

        if (res.status === 200) {
          dispatch(setUser(res.data));
          setIsLoading(false);
          return toast({
            title: "Congratulations!!!",
            description: "Bonus has been successfully added",
          });
        }

        setIsLoading(false);
        return toast({
          title: "Something went Wrong",
          description: "We unable to claim you Bonus",
          variant: "destructive",
        });
      }

      return toast({
        title: "You have no Bonus to claim",
        description: "Make some transactions to get N20 for each",
        variant: "destructive",
      });
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        return toast({
          title: "Something went Wrong",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="grid  grid-cols-[1fr_50px] lg:grid-cols-[1fr_280px] gap-2 items-center w-full">
      <div className="w-full h-16 bg-white rounded-lg p-0 md:p-4  flex justify-between items-center">
        <span className={` ${user?.type === UserRole.ADMIN ? "block pl-2" : "hidden"} md:block font-semibold`}>
          Welcome to {user?.type === UserRole.ADMIN ? "Admin" : "Your"}{" "}
          Dashboard
        </span>

        {user ? (
          user.type === UserRole.AGENT ? (
            <div className="text-sm w-full h-full md:w-fit px-1 py-2 md:p-0 flex items-center font-semibold gap-2 md:gap-3 rounded-lg bg-white md:bg-slate-200 ">
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                onClick={claimBonus}
                className={`bg-emerald-900 relative h-fit md:h-full px-2 py-3 lg:p-3 md:p-2 text-xs  rounded-lg text-white`}
              >
                {user?.agentBonus ? (
                  <span className="bg-emerald-900 opacity-75 flex justify-center items-center border border-white absolute w-[20px] h-[20px] left-1/2 right-1/2  animate-ping rounded-full ">
                    <span className="bg-emerald-900 opacity-75 border border-white absolute w-[10px] h-[10px]   animate-ping rounded-full "></span>
                    <span className="bg-emerald-900 opacity-75 border border-white absolute w-[8px] h-[8px]   animate-ping rounded-full "></span>
                  </span>
                ) : null}
                Claim Agent Bonus:{" "}
                <span className="font-semibold">
                  {user ? user.agentBonus : 0}
                </span>
              </Button>

              <div className="m-2 mr-4">
                {user
                  ? formatToNaira.format(user.accountBalance)
                  : formatToNaira.format(0)}
              </div>
            </div>
          ) : null
        ) : (
          <div className="w-[50px] flex justify-center items-center">
            <TailSpin width={20} height={20} />
          </div>
        )}
      </div>

      <div className="h-16 bg-white rounded-lg py-4 px-1 lg:p-4 flex item-center justify-center lg:justify-between">
        <div className="hidden lg:flex flex-col ">
          <h4 className="text-medium text-xs mb-0">{user?.name}</h4>
          <span className="text-xs text-zinc-500">{user?.email}</span>
        </div>
        <div>
          {user ? (
            <>
              <div className="hidden md:block">
                <UserAccountNav user={user} />
              </div>
              <div className="flex md:hidden">
                <button
                  onClick={() =>
                    dispatch(setShowMobileSidebar(!showMobileSidebar))
                  }
                  className="border-2 border-emerald-200 rounded-full"
                >
                  <Image
                    src={
                      user.image ||
                      "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg"
                    }
                    width={30}
                    height={30}
                    alt="Avatar"
                    className="rounded-full overflow-hidden"
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-center items-center">
              <TailSpin width={20} height={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
