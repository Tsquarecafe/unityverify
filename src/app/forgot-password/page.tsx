"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { FormSubmitHandler } from "@/types/events";
import axios, { AxiosError } from "axios";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface pageProps {}
const ForgotPassword: FC<pageProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();

  if (session) router.replace("/sign-in");

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("/api/users/single/forgot-password", {
        email,
      });

      if (res.status === 200) {
        setShowBanner(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          return toast({
            title: "Bad Request",
            description: error.response?.data,
            variant: "destructive",
          });
        }
        if (error.response?.status === 400) {
          return toast({
            title: "Error Creating Reset Link",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Error Creating Reset Link",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {showBanner ? (
          <div className="p-4 bg-emerald-100 flex justify-between items-center">
            <div>
              <h4 className="font-semibold "> Email Send Successfully!</h4>

              <p className="text-slate-500 text-sm">
                Please Check you Email for for Reset Link
              </p>
            </div>
            <div className="p-4 bg-white rounded-full">
              <Check className="text-emerald-600" />
            </div>
          </div>
        ) : null}
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900">
            Forgot Passord
          </h2>

          <p className="mt-3 font-medium text-center text-gray-400">
            Enter Registered Email to request reset link
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md p-2 shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>

              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 my-1 text-gray-900 placeholder-gray-500 focus:z-10  sm:text-sm"
                placeholder="name@mail.com"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent py-3 px-4 text-sm font-medium text-white  disabled:cursor-not-allowed"
            >
              Request Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
