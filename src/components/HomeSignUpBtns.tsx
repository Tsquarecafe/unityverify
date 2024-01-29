"use client";

import { FC, useState } from "react";
import { Button, buttonVariants } from "./ui/Button";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import Link from "next/link";

interface HomeSignUpBtnsProps {}
const HomeSignUpBtns: FC<HomeSignUpBtnsProps> = ({}) => {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);

  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoadingGoogle(true);
    try {
      await signIn(`google`);
    } catch (error) {
      toast({
        title: "Error Login in",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <Button
        isLoading={isLoadingGoogle}
        onClick={loginWithGoogle}
        className="w-full"
      >
        {isLoadingGoogle ? null : <Icons.google className="h-4 w-4 mr-2" />}
        <span className="ml-4">Log in with Google</span>
      </Button>

      <Link href="/sign-up" className={`${buttonVariants()} w-full`}>
        Do not have a gmail account
      </Link>
    </div>
  );
};

export default HomeSignUpBtns;
