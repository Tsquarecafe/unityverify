import { ChangeEvent, FC, useRef, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { XSquare } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/lib/redux/slices/modalSlice";
import { useRouter } from "next/navigation";
import { FormSubmitHandler } from "@/types/events";
import {
  verifyByDemography,
  verifyByNIN,
  verifyByPhone,
  verifyByVNIN,
} from "@/lib/redux/slices/service/serviceThunk";
import { toast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/lib/redux/store";
import axios, { AxiosError } from "axios";
import {
  demoSearchServiceTitle,
  ninSearchServiceTitle,
  phoneSearchServiceTitle,
} from "@/lib/utils";

interface demographyInput {
  firstname: string;
  lastname: string;
  dob: string;
  gender: string;
}

const InputModal: FC = ({}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedSubService } = useSelector(
    (store: RootState) => store.service
  );

  const { modalTitle } = useSelector((store: RootState) => store.modal);
  const modalRef = useRef(null);

  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [demography, setDemography] = useState<demographyInput>({
    firstname: "",
    lastname: "",
    dob: "",
    gender: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useOnClickOutside(modalRef, () => (!loading ? dispatch(closeModal()) : null));

  const verify: FormSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!input && selectedSubService?.title != demoSearchServiceTitle) {
        return toast({
          title: "Verification Failed",
          description: "Please enter a valid input",
          variant: "destructive",
        });
      }

      if (
        (!demography.firstname || !demography.lastname || !demography.dob) &&
        selectedSubService?.title === demoSearchServiceTitle
      ) {
        return toast({
          title: "Verification Failed",
          description: "Please enter a valid input",
          variant: "destructive",
        });
      } else {
        const res = await axios.post("/api/transactions", {
          type: selectedSubService ? selectedSubService.title : "",
        });

        if (res?.status == 201 && res?.data) {
          let verificationResult;
          if (selectedSubService?.title === ninSearchServiceTitle) {
            verificationResult = await dispatch(
              verifyByNIN({
                nin: input,
                transactionId: res.data.id,
              })
            );
          } else if (selectedSubService?.title === phoneSearchServiceTitle) {
            verificationResult = await dispatch(
              verifyByPhone({
                phone: input,
                transactionId: res.data.id,
              })
            );
          } else if (selectedSubService?.title === demoSearchServiceTitle) {
            verificationResult = await dispatch(
              verifyByDemography({
                firstname: demography.firstname,
                lastname: demography.lastname,
                dob: demography.dob,
                gender: demography.gender,
                transactionId: res.data.id,
              })
            );
          } else {
            verificationResult = await dispatch(
              verifyByVNIN({
                vnin: input,
                transactionId: res.data.id,
              })
            );
          }

          if (verificationResult?.meta.requestStatus === "rejected") {
            return toast({
              title: "Verification Failed",
              description: verificationResult.payload,
              variant: "destructive",
            });
          }
          router.push(`/dashboard/nin/select-slip/${res.data.id}`);
        } else {
          return toast({
            title: "Verification Failed",
            description:
              "Unaable to initiate transaction. Plese try again later",
            variant: "destructive",
          });
        }

        if (!loading) {
          dispatch(closeModal());
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast({
          title: "Verification Failed",
          description: error?.response?.data,
          variant: "destructive",
        });
      }
      return toast({
        title: "Verification Failed",
        description:
          "The verification was not successful. Plese try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-slate-900 bg-opacity-50 fixed top-0 left-0 right-0 bottom-0">
      <div className="flex justify-center items-center h-full">
        <div
          ref={modalRef}
          className="bg-white max-w-[500px] relative lg:min-w-[400px] h-fit rounded-lg"
        >
          <div className="m-4 flex justify-between items-center">
            <h3 className="font-semibold">{modalTitle}</h3>
            <button
              onClick={() => (!loading ? dispatch(closeModal()) : null)}
              className="cursor-pointer"
            >
              <XSquare />
            </button>
          </div>
          <hr />
          <form onSubmit={verify}>
            {selectedSubService?.title === ninSearchServiceTitle ? (
              <NIN input={input} setInput={setInput} />
            ) : selectedSubService?.title === phoneSearchServiceTitle ? (
              <PhoneNumberSearch input={input} setInput={setInput} />
            ) : selectedSubService?.title === demoSearchServiceTitle ? (
              <DemographySearch
                demography={demography}
                setDemography={setDemography}
              />
            ) : (
              <VNIN input={input} setInput={setInput} />
            )}
            <hr />
            <div className="m-4">
              <Button isLoading={loading} className=" w-full" type="submit">
                Verify
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputModal;

const VNIN: FC<{
  input: string;
  setInput: React.Dispatch<React.SetStateAction<any>>;
}> = ({ input, setInput }) => {
  return (
    <div>
      <div className="m-4 bg-emerald-50 rounded-lg p-2">
        <span className="">IMPORTANT:</span> <br />
        Please dial{" "}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          346*3*YOUR NIN*696739#
        </kbd>{" "}
        from your registered mobile number to generate the Virtual NIN provided
        below.{" "}
      </div>

      <div className="m-4">
        <Input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Enter Virtual NIN"
        />
      </div>
    </div>
  );
};
const NIN: FC<{
  input: string;
  setInput: React.Dispatch<React.SetStateAction<any>>;
}> = ({ input, setInput }) => {
  return (
    <div>
      <div className="m-4">
        <Input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Enter your NIN"
        />
      </div>
    </div>
  );
};
const DemographySearch: FC<{
  demography: demographyInput;
  setDemography: React.Dispatch<React.SetStateAction<any>>;
}> = ({ demography, setDemography }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDemography({
      ...demography,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <div className="m-4">
        <Input
          onChange={handleChange}
          value={demography.firstname}
          name="firstname"
          type="text"
          placeholder="Enter Firstname"
        />
      </div>
      <div className="m-4">
        <Input
          onChange={handleChange}
          value={demography.lastname}
          name="lastname"
          type="text"
          placeholder="Enter Lastname"
        />
      </div>
      <div className="m-4">
        <select
          name="gender"
          // @ts-ignore
          onChange={handleChange}
          className="flex h-12 w-full  rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option className="text-muted-foreground">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="m-4">
        <Input
          onChange={handleChange}
          name="dob"
          value={demography.dob}
          type="date"
          placeholder="Enter Date of Birth"
        />
      </div>
    </div>
  );
};
const PhoneNumberSearch: FC<{
  input: string;
  setInput: React.Dispatch<React.SetStateAction<any>>;
}> = ({ input, setInput }) => {
  return (
    <div>
      <div className="m-4">
        <Input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Enter Phone Number"
        />
      </div>
    </div>
  );
};
