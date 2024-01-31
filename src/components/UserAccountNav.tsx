"use client";

import { User } from "next-auth";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/DropdownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email"> | null;
}
const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const router = useRouter();
  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserAvatar
              className="h-8 w-8"
              user={{ name: user.name || null, image: user.image || null }}
            ></UserAvatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-white" align="end">
            <div className="flex items-center text-xs justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                  <p className="w-[200px] truncate text-sm text--zinc-700">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                signOut({
                  callbackUrl: `${window.location.origin}/sign-in`,
                });

                router.replace("/sign-in");
              }}
              className="cursor-pointer"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
};

export default UserAccountNav;
