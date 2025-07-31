import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User.model"; 
import {usernameSchema} from '@/schemas/signUpSchema' 
import verifyCodeSchema from '@/schemas/verificationSchema'  

export async function POST(req: Request){
    dbConnection()
    try {
        const {username, verifyCode} = await req.json()
        const decodedUsername = decodeURIComponent(username)

        const verifyCodeValidation = verifyCodeSchema.safeParse({otp:verifyCode})
        const usernameValidation = usernameSchema.safeParse(decodedUsername)
        if(!verifyCodeValidation.success){
            const usernameError = verifyCodeValidation.error.format()?._errors || []
            return Response.json({
                success : false,
                message: usernameError?.length > 0 ? usernameError.join(", ") : "Invalid verification code"
            },{
                status: 400   
            })
        }
        if(!usernameValidation.success){
            const usernameError = usernameValidation.error.format()?._errors || []
            return Response.json({
                success : false,
                message: usernameError?.length > 0 ? usernameError.join(", ") : "Invalid username"
            },{
                status: 400
            })
        }
        const user = await UserModel.findOne({username: decodedUsername})
        if(!user){ 
           return Response.json({
                success : false,
                message: "Username not found"
            },{
                status: 404
            })
       }
       const isCodeTrue = verifyCode === user.verifyCode
       const isCodeValid = new Date(user.verifyCodeExpiry) > new Date()

       if(!isCodeTrue){
         return Response.json({
                success : false,
                message: "Incorrect verification code"
            },{
                status: 400
            })
       }
       if(!isCodeValid){
        return Response.json({
                success : false,
                message: "Verification code is expired"
            },{
                status: 400
            })
       }
       user.isVerified = true
       await user.save()
       
        return Response.json({
                success : true,
                message: "Account verified sucessfully"
            },{
                status: 200
        })

    } catch (error) {
        console.error("Error verifing account", error)
        return Response.json({
                success : false,
                message: "Error verifing account"
            },{
                status: 500
            })
    }
}