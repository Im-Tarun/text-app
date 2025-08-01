"use client";
import MessageCard from "@/components/MessageCard";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User.model";
import acceptMsgSchema from "@/schemas/acceptMessageSchema";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { User } from "next-auth";

const dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const onMessageDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id != messageId));
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMsgSchema>>({
    resolver: zodResolver(acceptMsgSchema),
    defaultValues: {
      isAcceptingMsg: session?.user?.isAcceptingMsg,
    },
  });

  const { register, watch, setValue } = form;

  const isAcceptingMsg = watch("isAcceptingMsg");

  const fetchAcceptMessages = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.get<apiResponse>("/api/accept-messages");
      if (response.data.isAcceptingMsg) {  
        setValue("isAcceptingMsg", response.data.isAcceptingMsg);
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<apiResponse>;
      toast.error("Error changing Accept Message", {
        description:
          axiosError?.response?.data.message || "There is a server error",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsMsgLoading(false);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<apiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh)
          toast.success("Showing latest Messages", {
            description: response.data.message,
          });
      } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError<apiResponse>;
        toast.error("Error Getting Messsages", {
          description:
            axiosError?.response?.data.message || "There is a server error",
        });
      } finally {
        setIsMsgLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsMsgLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitch = async () => {
    try {
      const response = await axios.post<apiResponse>("/api/accept-messages", {
        acceptMessages: !isAcceptingMsg,
      });
      setValue("isAcceptingMsg", !isAcceptingMsg);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<apiResponse>;
      toast.error("Error", {
        description:
          axiosError?.response?.data.message || "There was an server error",
      });
    }
  };

  if (!session || !session.user)
    return <div className="text-2xl m-8 p-8"> Please login...</div>;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
  const profileUrl = `${baseUrl}/user/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Copied to Clipboard");
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-[#ebebeb] rounded-lg max-w-6xl dark:bg-[#19243b] dark:text-white">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <p
            onClick={copyToClipboard}
            className="input input-bordered  mr-2 cursor-copy"
          >
            {profileUrl}
          </p>
          <Button
            variant={"secondary"}
            className="cursor-pointer"
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("isAcceptingMsg")}
          checked={isAcceptingMsg}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {isAcceptingMsg ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isMsgLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={onMessageDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default dashboard;
