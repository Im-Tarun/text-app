import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Message } from "@/model/User.model";
import { apiResponse } from "@/types/apiResponse";


interface MessageCardData{
  message: Message,
  onMessageDelete : (messageId: string)=> void
}

const MessageCard = ({message, onMessageDelete}:MessageCardData)=> {

  const handleDeleteMsg = async ()=>{
    try {
      toast("Deleting this message")
      onMessageDelete(message._id as string)
      const response = await axios.delete<apiResponse>(`/api/delete-message/${message._id}`);
      toast.success("Success",{
        description: `${response?.data.message}`
      })
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError<apiResponse>
      toast.error("Error",{
        description: axiosError.response?.data.message
      })
    }
  }
  const messageDate = new Date(message.createdAt).toLocaleDateString("en-US",{
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card  className="w-full max-w-sm m-auto">
      <CardHeader>
        <CardTitle>Message</CardTitle>
        <CardDescription>
          {messageDate}
        </CardDescription>
        <CardAction>
      <AlertDialog >
        <AlertDialogTrigger asChild>
          <Button variant="destructive"><Trash/></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMsg}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </CardAction>
      </CardHeader>
      <CardContent>{message.content}</CardContent>
    
    </Card>
  );
}
export default MessageCard;
