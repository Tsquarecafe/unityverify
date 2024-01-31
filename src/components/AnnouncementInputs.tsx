"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/textarea";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getAnnouncement } from "@/lib/redux/slices/announcement/announcementThunk";
import { TailSpin } from "react-loader-spinner";
import { Button } from "./ui/Button";

interface AnnouncementInputsProps {}
const AnnouncementInputs: FC<AnnouncementInputsProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const { announcements, isLoading } = useSelector(
    (store: RootState) => store.announcement
  );

  const [titleInput, setTitleInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      if (!announcements) {
        await dispatch(getAnnouncement());
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (announcements && announcements.length > 0) {
      setTitleInput(announcements[0].title);
      setTextInput(announcements[0].text);
    }
  }, [announcements]);

  const handleUpdateAnnouncements = async () => {
    setLoading(true);
    try {
      if (!announcements) return;

      if (!titleInput || !textInput)
        return toast({
          title: "Missing Field",
          description: "Enter All fields",
          variant: "destructive",
        });

      const res = await axios.patch("/api/announcement", {
        announcementId: announcements[0].id,
        title: titleInput,
        text: textInput,
      });
      if (res.status === 200) {
        await dispatch(getAnnouncement());

        return toast({
          title: "Update Success",
          description: "Announcement has been updated sucessfully",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return toast({
          title: "Error Updating Announcement",
          description: error.response?.data,
          variant: "destructive",
        });

      return toast({
        title: "Error Updating Announcement",
        description: "Unable to Update Announcement . Plese try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!isLoading && announcements ? (
        <>
          <div className="space-y-3">
            <h5>Title</h5>
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Announcement Title"
            />
          </div>
          <div>
            <h5>Announcement Text</h5>
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Announcement Message "
            />
          </div>

          <Button
            onClick={handleUpdateAnnouncements}
            disabled={loading}
            isLoading={loading}
          >
            Update
          </Button>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <TailSpin width={30} height={30} />
        </div>
      )}
    </div>
  );
};

export default AnnouncementInputs;
