"use client";

import { RootState } from "@/lib/redux/store";
import { FC } from "react";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserRole } from "@/lib/utils";

interface AnouncementProps {}
const Anouncement: FC<AnouncementProps> = ({}) => {
  const { announcements } = useSelector(
    (store: RootState) => store.announcement
  );
  const { data: session } = useSession();

  return (
    <div className="bg-gradient-to-r h-full flex items-center from-emerald-800 to-slate-900 rounded-lg px-4 py-6 ">
      {announcements ? (
        announcements.length > 0 && (
          <div className="space-y-3 text-white">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold ">{announcements[0].title}</h4>

              {session && session.user.type === UserRole.ADMIN ? (
                <Link
                  className="text-emerald-200 text-xs"
                  href="/admin/announcement"
                >
                  Edit
                </Link>
              ) : null}
            </div>

            <p className="text-sm">{announcements[0].text}</p>
          </div>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Anouncement;
