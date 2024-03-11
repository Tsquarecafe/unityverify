"use client";

import { closeModal } from "@/lib/redux/slices/modalSlice";
import { AppDispatch } from "@/lib/redux/store";
import { FC, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FormSubmitHandler } from "@/types/events";
import { XSquare } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { TailSpin } from "react-loader-spinner";

interface AdminChangeUserPasswordProps {
  selectedUser: {
    id: string;
    name: string;
    email: string;
  };
}
const AdminChangeUserPassword: FC<AdminChangeUserPasswordProps> = ({
  selectedUser,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (password != confirmPassword)
        return toast({
          title: "Both Passwords do not match",
          description: "Please enter same password",
          variant: "destructive",
        });

      const res = await axios.patch(
        `/api/users/single/admin-change-password?userId=${selectedUser.id}`,
        {
          newPassword: password,
        }
      );

      if (res.status === 200)
        return toast({
          title: "Update Successfull",
          description: "User Password has been updated successfully",
        });
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast({
          title: "Error updating",
          description: error.message,
          variant: "destructive",
        });
      }
      return toast({
        title: "Error updating",
        description: "Something went Wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="bg-slate-900 bg-opacity-10 fixed top-0 left-0 right-0 bottom-0 ">
      <div className="flex justify-center items-center h-full">
        {selectedUser ? (
          <div className="bg-white max-w-[500px] relative z-50 lg:min-w-[400px] h-fit rounded-lg p-4 lg:p-8">
            <button
              onClick={() => (!loading ? dispatch(closeModal()) : null)}
              className="cursor-pointer absolute right-4 top-4"
            >
              <XSquare />
            </button>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Changer User Password{" "}
              </h3>
              <p className="text-xs text-rose-500 font-light mb-3">
                Please Ensure the you have the consent of the user with the
                details below before changing their password
              </p>

              <hr />

              <div className="mt-2">
                <div className="text-slate-600">
                  Name:{" "}
                  <span
                    className="
                  text-black font-semibold"
                  >
                    {selectedUser.name}
                  </span>
                </div>
                <div className="text-slate-600">
                  Email:{" "}
                  <span className="font-semibold text-black">
                    {selectedUser.email}
                  </span>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="my-4">
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                />
              </div>
              <div className="my-4">
                <Input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>

              <Button isLoading={loading} className=" w-full" type="submit">
                Update
              </Button>
            </form>
          </div>
        ) : (
          <TailSpin width={30} height={30} />
        )}
      </div>
    </div>
  );
};

export default AdminChangeUserPassword;
