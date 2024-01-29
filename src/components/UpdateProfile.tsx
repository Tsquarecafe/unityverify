"use client";

import { FC, useEffect, useState } from "react";
import LabledInput from "./LabledInput";
import { Button } from "./ui/Button";
import { Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { TailSpin } from "react-loader-spinner";
import { getUser } from "@/lib/redux/slices/user/userThunk";
import { useSession } from "next-auth/react";

interface UpdateProfileProps {}

const UpdateProfile: FC<UpdateProfileProps> = ({}) => {
  const { user } = useSelector((state: RootState) => state.user);

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { data: session, update } = useSession();

  useEffect(() => {
    if (user) {
      setFirstName(user?.name?.split(" ")[0] || "");
      setLastName(user?.name?.split(" ")[1] || " ");
      setNewEmail(user?.email || " ");
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      if (!firstName || !lastName || !newEmail) {
        return toast({
          title: "Missing Fields",
          description: "Ensure all fields are carefully filled",
          variant: "destructive",
        });
      }

      const res = await axios.patch("/api/users/profile", {
        firstName,
        lastName,
        email: newEmail,
      });

      if (res.status === 201) {
        setIsLoading(false);

        await update({ ...res.data });
        await dispatch(getUser());
        return toast({
          title: "Update Successfull",
          description: "Your Profile has been updated",
        });
      }
    } catch (error) {
      setIsLoading(false);

      if (error instanceof AxiosError) {
        return toast({
          title: "Opps!!! An Error occurred",
          description: error.message,
          variant: "destructive",
        });
      }
      return toast({
        title: "Somthing went Wrong",
        description: "Try again latter",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {isUpdate ? (
        <div>
          <h4 className="text-lg font-semibold mb-6">Update your Profile</h4>
          <div className="space-y-4">
            <LabledInput
              labelText="First Name"
              type="text"
              inputValue={firstName}
              handleOnChange={setFirstName}
            />
            <LabledInput
              labelText="Last Name"
              type="text"
              inputValue={lastName}
              handleOnChange={setLastName}
            />
            <LabledInput
              labelText="Email"
              type="text"
              inputValue={newEmail}
              handleOnChange={setNewEmail}
            />

            <div className="flex justify-between items-center ">
              <span className="text-xs font-bold text-rose-400">
                **You can now make changes to your profile**
              </span>

              <div className="flex gap-4 items-center">
                <Button
                  type="button"
                  isLoading={isLoading}
                  onClick={handleProfileUpdate}
                  className="bg-green-300 text-green-700"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsUpdate(false)}
                  className="bg-rose-300 text-rose-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : user ? (
        <div>
          <h4 className="text-lg font-semibold mb-6">User Profile</h4>
          <div className="space-y-4">
            <LabledInput
              labelText="First Name"
              type="text"
              inputValue={user?.name?.split(" ")[0] || " "}
              handleOnChange={() => null}
              isReadOnly
            />
            <LabledInput
              labelText="Last Name"
              type="text"
              inputValue={user?.name?.split(" ")[1] || " "}
              handleOnChange={() => null}
              isReadOnly
            />
            <LabledInput
              labelText="Email"
              type="text"
              inputValue={user.email || " "}
              handleOnChange={() => null}
              isReadOnly
            />

            <Button
              onClick={() => setIsUpdate(true)}
              className="flex items-center gap-2 "
            >
              <Edit />
              Make Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <TailSpin />
        </div>
      )}
    </>
  );
};

export default UpdateProfile;
