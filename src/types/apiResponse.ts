import { Message } from "@/model/User.model";

export interface apiResponse{
    success: boolean,
    message: string,
    isAcceptingMsg?: boolean,
    messages?: Array<Message>
}