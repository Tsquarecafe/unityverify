import { FC } from "react";
import UserAvatar from "../UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { TailSpin } from "react-loader-spinner";
import { UserRole, cn } from "@/lib/utils";
import AdminSidebar from "../AdminSidebar";
import Sidebar from "../Sidebar";
import { buttonVariants } from "../ui/Button";
import { ChevronLeft, Link } from "lucide-react";
import { setShowMobileSidebar } from "@/lib/redux/slices/modalSlice";

interface MobileSidebarProps {}
const MobileSidebar: FC<MobileSidebarProps> = ({}) => {
  const { user } = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();

  return (
    <div className="w-full bg-white text-black overflow-scroll">
      <div className="flex w-full p-4 flex-col gap-4">
        <button
          onClick={() => dispatch(setShowMobileSidebar(false))}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </button>
        {user ? (
          <div className="border-2 border-slate-900 p-4 rounded-lg flex flex-col gap-4 items-center justify-center">
            <UserAvatar
              className="h-12 w-12"
              user={{ name: user.name || null, image: user.image || null }}
            />
            <div className="flex flex-col space-y-1 text-center leading-none">
              {user.name && <p className="font-medium">{user.name}</p>}
              {user.email && (
                <p className="w-[200px] truncate text-sm text--zinc-700">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        ) : (
          <TailSpin width={10} height={10} />
        )}

        <div className="w-full my-1">
          {user?.type === UserRole.ADMIN ? <AdminSidebar /> : <Sidebar />}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
