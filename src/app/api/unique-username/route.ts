import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User.model"; 
import {usernameSchema} from '@/schemas/signUpSchema' 


export async function GET(req:Request) {
    dbConnection();
    try {
       const {searchParams} = new URL(req.url) 
       const username =  searchParams.get('username')
       const result = usernameSchema.safeParse(username)
       if(!result.success){
            const usernameError = result.error.format()?._errors || []
            return Response.json({
                success : false,
                message: usernameError?.length > 0 ? usernameError.join(", ") : "Invalid username"
            },{
                status: 400
            })
       }
       const existingVerifiedUser = await UserModel.findOne({username, isVerified:true})
       if(existingVerifiedUser){ 
           return Response.json({
                success : false,
                message: "Username already exist"
            },{
                status: 400
            })
       }
       return Response.json({
            success : true,
            message: "Username is unique"
        },{
            status: 200
        })

        
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
                success : false,
                message: "Error checking username"
            },{
                status: 500
            }
        )
    }
}