"use client";

import { FC, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentModal } from "@/lib/redux/slices/modalSlice";
import { FormSubmitHandler } from "@/types/events";
import { setMostRecentPaymentRef } from "@/lib/redux/slices/payment/paymentSlice";

interface TopUpFormProps {}
const TopUpForm: FC<TopUpFormProps> = ({}) => {
  const [amount, setAmount] = useState<string>("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!amount)
        return toast({
          title: "Invalid Amount",
          description: "Please Enter a Valid Amount",
          variant: "destructive",
        });

      const res = await axios.post("/api/payments", {
        amount: parseInt(amount),
      });

      dispatch(
        setMostRecentPaymentRef({ paymentRef: res.data.paymentReference })
      );

      if (res.status === 201) {
        dispatch(setPaymentModal(true));
        setAmount("");
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        return toast({
          title: "Somthing went wrong",
          description: error.message,
          variant: "destructive",
        });
      }

      return toast({
        title: "Somthing went wrong",
        description: "Unable to initiate user payments",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h4 className="text-xl font-semibold mb-3">Top Up Form</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
        />
        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          Initiate Top Up
        </Button>
      </form>
    </div>
  );
};

export default TopUpForm;
