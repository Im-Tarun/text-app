import {z} from 'zod'

export const usernameSchema = z.string()
    .min(3,{message: "username must be atleast 3 characters"})
    .max(15,{message: "username must be no longer than 15 characters"})
    .regex(/^[a-zA-Z0-9_]+$/, {message: "username must not contain special characters"})

const signUpSchema = z.object({
    username: usernameSchema,
    email : z.string().email({message:"Invalid email"}),
    password : z.string().min(6, {message: "Password must be atleast 6 characters "})
})

export default signUpSchema