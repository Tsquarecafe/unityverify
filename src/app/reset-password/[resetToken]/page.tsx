"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { FormSubmitHandler } from "@/types/events";
import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface pageProps {}
const ResetPassword: FC<pageProps> = ({}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [errors, setErrors] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const params = useParams<{ resetToken: string }>();
  const router = useRouter();

  const { data: session } = useSession();

  if (session) router.replace("/sign-in");

  useEffect(() => {
    const verifyToken = async () => {
      setErrors(false);
      try {
        const res = await axios.post("/api/users/single/verify-token", {
          token: params.resetToken,
        });

        if (res.status === 401) {
          setErrors(true);
          return toast({
            title: "Error Processing Token",
            description: "Invalid Token",
            variant: "destructive",
          });
        }

        if (res.status === 200) {
          const userInfo = res.data;
          setUserData(userInfo);
        }
      } catch (error) {
        console.log(error);
        setErrors(true);

        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return toast({
              title: "Error validating Token",
              description: error.response?.data,
              variant: "destructive",
            });
          }
        }

        return toast({
          title: "Error Validating Token",
          description: "Something went wrong, please try again",
          variant: "destructive",
        });
      }
    };

    verifyToken();
  }, [params]);

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password != confirmPassword)
      return toast({
        title: "Passwords do not match",
        description: "Please Enter Same Password for both fields",
        variant: "destructive",
      });

    if (!userData)
      return toast({
        title: "User Not Identified",
        description: "Cannot Complete Request Now",
        variant: "destructive",
      });

    try {
      const res = await axios.post("/api/users/single/reset-password", {
        userId: userData.id,
        password,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {showBanner ? (
          <div className="p-4 bg-emerald-100 flex justify-between items-center">
            <div>
              <h4 className="font-semibold "> Password Reset Successful!</h4>

              <p className="text-slate-500 text-sm">
                You can now Sign In with your new password{" "}
              </p>
              <Link className="text-sm font-semibold text-emerald-600 underline" href="/sign-in">Sign In Here</Link>
            </div>
            <div className="p-4 bg-white rounded-full">
              <Check className="text-emerald-600" />
            </div>
          </div>
        ) : null}
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900">
            Reset Passord
          </h2>

          <p className="mt-3 font-medium text-center text-gray-400">
            Enter your new password and confirm
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md p-2 shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 my-1 text-gray-900 placeholder-gray-500 focus:z-10  sm:text-sm"
                placeholder="New Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>

              <Input
                id="confirm-password"
                name="password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 my-1 text-gray-900 placeholder-gray-500 focus:z-10  sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || errors}
              className="group relative flex w-full justify-center rounded-md border border-transparent py-3 px-4 text-sm font-medium text-white  disabled:cursor-not-allowed"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
