"use client";

import { FC, useEffect, useRef, useState } from "react";
import SlipType from "@/components/SlipType";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { getAllSlips } from "@/lib/redux/slices/service/serviceThunk";
import { toast } from "@/hooks/use-toast";
import { Input } from "./ui/Input";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";
import { Button } from "./ui/Button";
import axios, { AxiosError } from "axios";

interface AdminSlipListProps {}
const AdminSlipList: FC<AdminSlipListProps> = ({}) => {
  const { allSlips, selectedSlipType, isLoading } = useSelector(
    (store: RootState) => store.service
  );

  const [showEdit, setShowEdit] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef(null);
  useOnClickOutside(ref, () => setShowEdit(false));

  useEffect(() => {
    const getSlipTypes = async () => {
      try {
        if (!allSlips) return await dispatch(getAllSlips());
      } catch (error) {
        return toast({
          title: "Error Getting NIN Slips",
          description:
            "Unable to retrieve NIN slip types . Plese try again later",
          variant: "destructive",
        });
      }
    };

    getSlipTypes();
  }, []);

  return (
    <div>
      {allSlips ? (
        allSlips.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
            {allSlips.map((slip) => (
              <div
                key={slip.id}
                className={` ${
                  selectedSlipType.title === slip.title && showEdit
                    ? "border border-yellow-300 bg-slate-100 rounded-lg"
                    : null
                }`}
              >
                <SlipType setShowEdit={setShowEdit} {...slip} />
                {selectedSlipType.title === slip.title && showEdit ? (
                  <div ref={ref}>
                    <EditSlipPrice />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full">
            <h3>No Slips to Display</h3>
          </div>
        )
      ) : (
        <div className="flex justify-center items-center">
          <TailSpin width={30} height={30} />
        </div>
      )}
    </div>
  );
};

export default AdminSlipList;

const EditSlipPrice = () => {
  const { selectedSlipType } = useSelector((store: RootState) => store.service);
  const [price, setPrice] = useState(selectedSlipType.price);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.patch("/api/slips", {
        slipId: selectedSlipType.id,
        price,
      });
      if (res.status === 200) {
        await dispatch(getAllSlips());

        return toast({
          title: "Update Success",
          description: "Slip price as been updated sucessfully",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return toast({
          title: "Error Updating Slips",
          description: error.response?.data,
          variant: "destructive",
        });

      return toast({
        title: "Error Updating Slips",
        description: "Unable to Update Slip Price . Plese try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {selectedSlipType ? (
        <div className="flex flex-col gap-2 mt-2 text-sm px-4 py-2 text-slate-700">
          Edit Price for {selectedSlipType.title}
          <div className="flex gap-3 items-center">
            <Input
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              placeholder="Enter new Price"
            />
            <Button isLoading={loading} onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
