import AnnouncementInputs from "@/components/AnnouncementInputs";
import { Input } from "@/components/ui/Input";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="p-4 my-4 rounded-lg border border-slate-500">
      <div className="mb-4">
        <h2 className="font-semibold text-xl leading-10 text-slate-900">
          Announcement
        </h2>
        <p className="text-slate-600 text-sm ">
          You can Edit the Annoucement which will be visible for all users
        </p>
      </div>

      <hr className="mb-6  border-slate-300" />

      <div className="my-6">
        <AnnouncementInputs />
      </div>
    </div>
  );
};

export default page;
