"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FC, useState } from "react";

interface pageProps {}
const ForgotPassword: FC<pageProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900">
            Forgot Passord
          </h2>

          <p className="mt-3 font-medium text-center text-gray-400">
            Enter Registered Email to request reset link
          </p>
        </div>
        <form className="mt-8 space-y-6">
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
