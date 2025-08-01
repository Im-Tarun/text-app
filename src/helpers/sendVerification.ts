import { resend } from "@/lib/resend";
import EmailVerification from "../../emails/EmailVerification";
import { apiResponse } from "@/types/apiResponse";

export async function sendEmailVerification(
    email:string,
    username:string,
    verifyCode: string
):Promise<apiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Text App | Verification code ',
            react: EmailVerification({username, otp: verifyCode }),
        });
        if(response.error){
            console.log(response.error)
            return {
                success: false, 
                message: "There was a Error in Resend Email server"
            }
        }
        return {
            success: true,
            message: "Verification code sent successfully"
        }
        
    } catch (error) {
        console.log("error sending email verification code", error)
        return {
            success: false,
            message: "Failed to send verification code"
        }
    }
}