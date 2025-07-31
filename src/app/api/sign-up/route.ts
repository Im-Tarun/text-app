import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcrypt"
import { sendEmailVerification } from "@/helpers/sendVerification";
import crypto from "crypto"


export async function POST(req:Request) {
    await dbConnection()
    try {
        const {username, email, password} = await req.json()
        const otp = crypto.randomInt(0, Math.pow(10, 6)).toString().padStart(6, "0");
        //checking if the username is already taken by a verified person
        //if username is take but account not verified it can be used by newperson
        const userWithVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(userWithVerifiedUsername){
            return Response.json({
                success: false,
                message:"Username already exists. Please select a unique username"
            },{
                status: 500
            })
        }

        //username is unique check if email exist, verified or not
        const userByEmail = await UserModel.findOne({
           email
        })

        if(userByEmail){
            if(userByEmail.isVerified){
                return Response.json({
                success: false,
                message:"Email already exists. Please login or select a unique email "
            },{
                status: 500
            })
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                userByEmail.username = username;
                userByEmail.verifyCode = otp;
                userByEmail.password = hashedPassword
                userByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000 )
                
                await userByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: otp,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMsg: true,
                message: []
            })
            await newUser.save()
        }

        const emailVerifyResponse = await sendEmailVerification(email, username, otp)

        if(!emailVerifyResponse.success){
            return Response.json(emailVerifyResponse,{
                status: 500
            })
        }
        return Response.json(emailVerifyResponse,{
            status: 200
        })

        
    } catch (error) {
        console.log("Error registering User")
        return Response.json({
            success: false,
            message:"Error registering User"
        },{
            status: 500
        })
    }
}