import { FC } from "react";
import Image from "next/image";
import UserAuthForm from "./UserAuthForm";
import VerifyImg from "../../public/assets/verify_banner.jpg";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Brand from "./Brand";

interface SignInProps {}
const SignIn: FC<SignInProps> = ({}) => {
  return (
    <section className="max-w-screen h-screen m-0 bg-white shadow sm:rounded-lg flex justify-center flex-1">
      <div className="w-full lg:w-1/2 xl:w-5/12 p-6 sm:p-12 ">
        <div className="text-slate-800 flex items-center justify-between">
          <Brand />

          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Home
          </Link>
        </div>

        <div className="bg-white w-full flex items-center justify-center">
          <div className="w-full h-100">
            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
              Welcome back!
            </h1>

            <UserAuthForm />

            <p className="mt-4 text-sm">
              Need an account?{" "}
              <Link
                href="/sign-up"
                className="text-gray-500 hover:text-gray-700 font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-zinc-600 hidden lg:block w-full mx-auto md:w-1/2 xl:w-2/3 h-aut0 ">
        <Image
          src={VerifyImg}
          alt="Verify Banner"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default SignIn;
