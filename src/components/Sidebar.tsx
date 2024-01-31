"use client";

import { FC } from "react";
import SidebarLink from "./SidebarLink";
import {
  HelpCircle,
  History,
  Home,
  LogOutIcon,
  MessageSquare,
  Settings,
  ShieldCheck,
  Wallet2,
} from "lucide-react";
import Brand from "./Brand";
import { Button, buttonVariants } from "./ui/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SidebarProps {}
const Sidebar: FC<SidebarProps> = ({}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    signOut({
      callbackUrl: `${window.location.origin}/sign-in`,
    });

    router.replace("/sign-in");
  };
  return (
    <div className="w-full text-sm h-full space-y-2 text-white rounded-lg grid grid-rows-[auto_1fr]">
      <div className=" hidden lg:block bg-slate-900 text-zinc-50 rounded-lg p-4">
        <Brand fromSidebar />
      </div>
      <div className=" bg-slate-900 max-h-full rounded-lg">
        <div className="flex flex-col p-4 space-y-4">
          <h5 className="text-slate-200 text-xs">Menu</h5>
          <SidebarLink icon={<Home />} text="Dashboard" link="/dashboard/" />
          <SidebarLink
            icon={<ShieldCheck />}
            text="Services"
            link="/dashboard/services"
          />
          <SidebarLink
            icon={<Wallet2 />}
            text="Wallet"
            link="/dashboard/wallet"
          />
        </div>

        <div className="flex flex-col p-4 space-y-4">
          <h5 className="text-slate-200 text-xs">History</h5>
          <SidebarLink
            icon={<History />}
            text="Transactions"
            link="/dashboard/transactions"
          />
        </div>

        <div className="flex flex-col p-4 space-y-4">
          <h5 className="text-slate-200 text-xs">Support & Config</h5>
          <SidebarLink
            icon={<MessageSquare />}
            text="Contact  Support"
            link="/dashboard/chat"
          />

          <SidebarLink icon={<HelpCircle />} text="FAQ" link="/dashboard/faq" />
        </div>
        <div className="space-y-3">
          <div className="flex flex-col p-4 space-y-4">
            <h5 className="text-slate-200 text-xs">Account</h5>

            <SidebarLink
              icon={<Settings />}
              text="Settings"
              link="/dashboard/settings"
            />
            <Button
              className={buttonVariants({
                variant: "outline",
              })}
              onClick={handleSignOut}
            >
              <LogOutIcon className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
