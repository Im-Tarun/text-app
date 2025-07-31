import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(req:Request) {
    dbConnection()
    const {username, content} = await req.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success : false,
                message: "User not found"
            },{
                status: 404
            })
        }
        if(!user.isAcceptingMsg){
            return Response.json({
                success : false,
                message: "User is not accepting new messages"
            },{
                status: 403
            })
        }
        
        const newMessage = {
            content,
            createdAt : new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
                success : true,
                message: "Message sent successfully"
            },{
                status: 200
            })
        
    } catch (error) {
        console.error("Internal server error in sending message", error)
        return Response.json({
                success : false,
                message: "Internal server error."
            },{
                status: 500
            })
    }

}


