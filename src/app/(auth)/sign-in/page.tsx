import SignIn from "@/components/SignIn";
import { getAuthSession } from "@/lib/auth";
import { UserRole } from "@/lib/utils";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}
const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession();

  return (
    <>
      {!session ? (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
          <SignIn />
        </div>
      ) : session.user.type === UserRole.ADMIN ? (
        redirect("/admin")
      ) : session.user.type === UserRole.AGENT ? (
        redirect("/dashboard")
      ) : null}
    </>
  );
};

export default page;
