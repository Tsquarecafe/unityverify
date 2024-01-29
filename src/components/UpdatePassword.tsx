"use client";

import { FC, useState } from "react";
import LabledInput from "./LabledInput";
import { Button } from "./ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/lib/redux/slices/user/userThunk";

interface UpdatePasswordProps {}
const UpdatePassword: FC<UpdatePasswordProps> = ({}) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((store: RootState) => store.user);

  const handleUpdate = async () => {
    try {
      if (!newPassword || !currentPassword)
        return toast({
          title: "Invalid Input",
          description: "Ensure you enter all fields ",
          variant: "destructive",
        });
      await axios.patch("/api/users/single/update-password", {
        newPassword,
        currentPassword,
      });

      dispatch(getUser());

      setCurrentPassword("");
      setNewPassword("");

      return toast({
        title: "Password Update Successfull",
        description: "Your password has been updated",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
        return toast({
          title: "Somthing went wrong",
          description: error.response?.data || error.message,
          variant: "destructive",
        });
      }

      return toast({
        title: "Somthing went wrong",
        description: "Unable to get update Password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <h4 className="text-lg font-semibold mb-6">Update Password</h4>
      <div className="space-y-4">
        <LabledInput
          labelText="Current Password"
          type="password"
          inputValue={currentPassword}
          handleOnChange={setCurrentPassword}
        />
        <LabledInput
          labelText="New Password"
          type="password"
          inputValue={newPassword}
          handleOnChange={setNewPassword}
        />

        <Button
          type="button"
          disabled={isLoading}
          isLoading={isLoading}
          onClick={handleUpdate}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default UpdatePassword;
